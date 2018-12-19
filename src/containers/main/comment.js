import React, { Component } from 'react';
import { message, Modal, Form, Radio,Button } from 'antd'
import SearchTable from '../../components/SearchTable';
import {formatTime} from '@/utils/common';
import {commentList,commentDetail,comment} from '../../utils/request'
// import { Link } from 'react-router-dom';
import './candysType.less'
const RadioGroup = Radio.Group;
let ref = null
const FormItem = Form.Item

class AddForm extends Component {
  constructor(props) {
    super(props)
    this.state = {
      detail: {},
      value: false
    }
  }
  handleSubmit = (value,stauts) => {
    const { submit } = this.props
    ref.destroy()
    submit(this.props.row, value,this.props.index,stauts)
  }
  componentWillMount () {
    this.getDetail(this.props.row.id)
  }
  getDetail = (id) => {
    console.log(id)
    commentDetail({id:id}).then(res => {
      if (res) {
        this.setState({detail: res})
      }
    })
  }
  onChange = (e) => {
    console.log('radio checked', e.target.value);
    let detail = Object.assign(this.state.detail, {source: e.target.value})
    this.setState({
      detail
    });
  }
  render () {
    const { getFieldDecorator } = this.props.form
    console.log(this.state.detail)
    return (
      <Form className="formModal">
        <FormItem label="姓名">
          <span>{this.state.detail.nickname}</span>
        </FormItem>
        <FormItem label="注册账户">
          <span>{this.state.detail.account}</span>
        </FormItem>
        <FormItem label="内容">
        <span>{this.state.detail.message}</span>
        </FormItem>
        <FormItem label="信息源">
          <RadioGroup onChange={this.onChange} value={this.state.detail.source}>
            <Radio value={false}>非官方</Radio>
            <Radio value={true}>官方</Radio>
          </RadioGroup>
        </FormItem>
        <FormItem>
         <Button type="primary" onClick={()=> this.handleSubmit(this.state.detail.source,2)}>
            通过
          </Button>
          <Button type="danger" onClick={()=> this.handleSubmit(this.state.detail.source,3)}>
            拒绝
          </Button>
        </FormItem>
      </Form>
    )
  }
}
const MyModal = Form.create()(AddForm)
class Comment extends Component {
  constructor(props) {
    super(props)
    this.state = {
      pagination: {
        current: 1,
        total: 0,
        showTotal: (total) => '共 ' + total + ' 条数据'
      },
      value: [false,false,false],
      showV: '',
      data: []
    }
  }

  comment = (row,value,index,status) => {
    comment({
      id:row.id,
      source: value,
      status: status
    }).then(
      (data) => {
        console.log(row.status)
        console.log(status)
        if (data.code === 0) {
          message.success('审核成功')
          row.status = status
          this.setState({showV: 'comment'+row.id})
        }
      }
    )
  }
  options = {
    form: [
      {
        element: 'input',
        name: 'account',
        placeholder: '请输入注册账号'
      },
      {
        element: 'hidden',
        name: 'result'
      }
    ],
    table: {
      columns: [
        {
          title: '账号',
          dataIndex: 'account',
          key: 'account'
        },
        {
          title: '项目',
          dataIndex: 'name',
          key: 'name'
        },
        {
          title: '内容',
          dataIndex: 'message',
          key: 'message',
          // render: (value) => {
          //   return (<span title={value}>{value? (value.length>8?value.slice(0,4)+"...."+value.slice(-4):value) : value}</span>)
          // }
        },
        {
          title: '提交时间',
          dataIndex: 'created_at',
          key: 'created_at',
          render: (value) => {
            return (<span>{value? formatTime(value, true) : ''}</span>)
          }
        },
        {
          title: '状态',
          dataIndex: 'status',
          key: 'status',
          filters: [
            { text: '申请中', value: 1 },
            { text: '已通过', value: 2 },
            { text: '已拒绝', value: 3 }
          ],
          filteredValue: [],
          filterMultiple: false,
          render: (text, row) => (
            <span>{row.status === 3 ? '已拒绝' : (row.status === 2 ? '已通过' : '申请中')}</span>
          )
        },
        {
          title: '操作',
          key: 'action',
          render: (text, row, index) => (
            <span>
              <a className="mt-10" onClick={() => this.showModal(row, index)}>审核</a>
            </span>
          )
        }
      ]
    }
  }
  showModal = (row, index) => {
    ref = Modal.info({
      title: '评论审核',
      maskClosable: true,
      content: <MyModal submit={this.comment} row={row} index={index}></MyModal>,
      okText: ' ',
      okType: 'none'
    })
  }
  search = (page, pageSize, values = null) => {
    let requestData = {
      page: parseInt(page),
      limit: pageSize,
      ...values
    }
    for (let i in requestData) {
      if(i !== 'account') {
        requestData[i] = parseInt(requestData[i])
      }
    }
    commentList (requestData).then(data => {
      this.setState({
        pagination: {
          current: data.pageNum,
          total: data.total,
          showTotal: (total) => '共 ' + total + ' 条数据'
        },
        data: data.records
      })
    })
  }

  render() {
    return (
      <div className={this.state.showV}>
        <SearchTable options={this.options} data={this.state.data} pagination={this.state.pagination} search={this.search} {...this.props}/>
      </div>
    );
  }
}

export default Comment

