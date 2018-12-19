import React, { PureComponent, Component } from 'react'
import { Button, Select, Input, Form, Table } from 'antd'
import './SearchTable.less'
import pageData from '../utils/pageData'
import { compare, filterNull } from '../utils/common'
import moment from 'moment'
const Option = Select.Option

class SearchFormItem extends PureComponent {
  render () {
    const { element, options, placeholder, width, ...props } = this.props
    if (element === 'select') {
      return (
        <Select defaultValue={options[0].value}>
          {options.map((oItem,key) => (
            <Option key={key} {...props} value={oItem.value}>
            {typeof oItem.label === 'undefined' ? oItem.value : oItem.label}
            </Option>))
          }
        </Select>
      )
    } else if (element === 'hidden') {
      return <Input type='hidden' {...props}/>
    } else {
      return <Input placeholder={placeholder} {...props} style={{width}}/>
    }
  }
}

class SearchForm extends Component {
  sendRequest = (value) => {
    // value: -1 - 搜索   0 - 换页   1 - 刷新
    const { form, formList = [], history, search } = this.props
    const query = pageData.get(history) || {}
    let current = null
    let searchForm = {}
    if (value === -1) {
      current = 1
      searchForm = form.getFieldsValue()
      let otherSearchForm = {}
      let timeSearchForm = {}
      for (let key in searchForm) {
        let same = false
        if (!same) {
          otherSearchForm[key] = searchForm[key]
        } else {
          timeSearchForm[key] = searchForm[key]
        }
      }
      pageData.clear(history, {
        page: 1,
        ...filterNull(otherSearchForm),
      })
    } else {
      current = parseInt(query.page || 1)
      // 解决直接setFieldsValue时form还未建立的问题,getFieldsValue()为{}
      setTimeout(() => {
        const { page, ...formValues } = query
        let otherFormValues = {}
        let timeFormValues = {}
        for (let key in formValues) {
          if (key.indexOf('_start_time') !== -1 || key.indexOf('_end_time') !== -1) {
            timeFormValues[key] = formValues[key]
          } else {
            otherFormValues[key] = formValues[key]
          }
        }
        let timeRangeForm = {}
        for (let key in timeFormValues) {
          if (key.indexOf('_start_time') !== -1) {
            if (!timeRangeForm[key.replace('_start_time', '')]) {
              timeRangeForm[key.replace('_start_time', '')] = []
            }
            timeRangeForm[key.replace('_start_time', '')][0] = moment(timeFormValues[key], 'X')
          } else {
            if (!timeRangeForm[key.replace('_end_time', '')]) {
              timeRangeForm[key.replace('_end_time', '')] = []
            }
            timeRangeForm[key.replace('_end_time', '')][1] = moment(timeFormValues[key], 'X')
          }
        }
        const timeKeys = Object.keys(timeRangeForm)
        if (timeKeys.length) {
          // 将时间戳(秒级别)转换成moment格式的时间
          form.setFieldsValue({
            ...otherFormValues,
            ...timeRangeForm
          })
        } else {
          let formNullValues = {}
          formList.forEach(item => {
            formNullValues[item.name] = null
          })
          form.setFieldsValue({
            ...formNullValues,
            ...formValues
          })
        }
      })
      let queryForm = {}
      for (let key in query) {
        if (key === 'page') {
          queryForm[key] = parseInt(query[key])
        // } else if (key === 'id') {
        //   break
        }else {
          queryForm[key] = query[key]
        }
      }
      // 时间的转换(time转成start_time和end_time)
      // console.log(queryForm)
      search(parseInt(current), 7,queryForm)
    }
  }
  componentWillMount () {
    const { getForm, form } = this.props
    getForm(form)
    this.sendRequest(1)
  }
  shouldComponentUpdate (nextProps, nextState) {
    const hasPropsChange = !compare(nextProps, this.props)
    if (hasPropsChange) {
      this.sendRequest(0)
    }
    return true
    // const hasStateChange = !compare(nextState, this.state)
    // return hasPropsChange || hasStateChange
  }
  render () {
    const { formList, buttons = [], form } = this.props
    const { getFieldDecorator } = form
    return (
      <Form layout="inline">
        <div className="search-table-head">
          {
            formList && <div className="search-form">
              {formList.map((item, index) => {
                let { element, rules, name, value, options, ...props } = item
                return (
                  <Form.Item key={index}>
                    {getFieldDecorator(name, {
                      rules: rules,
                      ...options
                    })(
                      <SearchFormItem options={options} element={element} key={index} {...props} />
                    )}
                  </Form.Item>
                )
              })}
              <Button type="primary" onClick={() => this.sendRequest(-1)} style={{marginLeft: '10px'}}>查询</Button>
            </div>
          }
          {buttons.map((item, index) => {
            let { text, ...props } = item
            return <Button key={index} type="primary" style={{marginLeft: '10px'}} {...props}>{text}</Button>
          })}
        </div>
      </Form>
    )
  }
}

const WrappedSearchForm = Form.create()(SearchForm)

class SearchTable extends Component {
  state = {
    pagination: {}
  }
  form = null
  getForm = (form) => {
    this.form = form
  }
  setPagination = (data) => {
    this.setState(prevState => {
      return {
        pagination: {
          ...prevState.pagination,
          ...data
        }
      }
    })
  }
  rowClassName = (record, index) => {
    if ((index + 1) % 2 === 0) {
      return 'color-line'
    }
    return ''
  }
  componentWillMount () {
    // const { pagination, history } = this.props
    const { pagination } = this.props
    const defaultPagination = {
      defaultPageSize: 7
      // onChange: (page, pageSize) => {
      //   pageData.save(history, {
      //     page
      //   })
      // }
    }
    this.setState({
      pagination: {
        ...defaultPagination,
        ...pagination
      }
    })
  }
  componentWillReceiveProps (nextProps) {
    let current = null
    let total = 0
    const { history, pagination } = this.props
    const isPaginationChange = !compare(pagination, nextProps.pagination)
    const query = pageData.get(history) || {}
    if (isPaginationChange) {
      current = parseInt(query.page ? query.page : nextProps.pagination.current ? nextProps.pagination.current : pagination.current)
      // total = parseInt(nextProps.pagination.total ? nextProps.pagination.total : pagination.total)
    } else {
      // total = pagination.total
      current = parseInt(query.page) || 1
    }
    total = nextProps.pagination.total
    // 移除详情项
    this.setPagination({
      current: current,
      total
    })
  }
  onChange = (pagination, filters) => {
    const { history, options } = this.props
    let filtersProps = {}
    const filtersKeys = Object.keys(filters)
    if (filtersKeys.length) {
      for (let i = 0; i < filtersKeys.length; i++) {
        filtersProps[filtersKeys[i]] = filters[filtersKeys[i]][0]
        for (let k = 0; k < options.table.columns.length; k++) {
          if (filtersKeys[i] === options.table.columns[k].key) {
            options.table.columns[k].filteredValue = filters[filtersKeys[i]][0]
          }
        }
      }
    }
    pageData.save(history, {
      page: pagination.current,
      ...filtersProps
    })
  }
  render () {
    const { options: {form, buttons, table}, pagination, data, search = () => {}, onChange, rowSelection=null, ...props } = this.props
    return (
      <div className="search-table-container">
        <WrappedSearchForm getForm={this.getForm} formList={form} buttons={buttons} setPagination={this.setPagination} search={search} {...props}/>
        <Table rowClassName={this.rowClassName} className="search-table" onChange={this.onChange} rowSelection={rowSelection}
        dataSource={data} pagination={this.state.pagination} search={search} rowKey='id' {...table}/>
      </div>
    )
  }
}

export default SearchTable
