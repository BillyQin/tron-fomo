import React, { Component } from 'react';
import { message, Popconfirm,Form,Modal,Input,Button,DatePicker } from 'antd'
import SearchTable from '../../components/SearchTable';
import {agentList, agentIndentify,agentEdit,agentDetail,agentReject} from '../../utils/request'
import moment from 'moment';
import 'moment/locale/zh-cn'
import {formatTime} from '@/utils/common';
import './candysType.less'
let ref = null
const FormItem = Form.Item
const dateFormat = 'YYYY-MM-DD HH:mm:ss'
class AddForm extends Component {
  constructor(props) {
    super(props)
    this.state = {
      detail: {},
    }
  }
  handleSubmit = (e) => {
    const { submit } = this.props
    e.preventDefault()
    this.props.form.validateFields((err, values) => {
      if (!err) {
        ref.destroy()
        values.end_time = this.state.end_time || values.end_time.toDate().toISOString().slice(0, -5).replace('T',' ')
        values.start_time = this.state.start_time || values.start_time.toDate().toISOString().slice(0, -5).replace('T',' ')
        submit(values, this.props.id,this.props.detail)
      }
    })
  }
  componentWillMount () {
    this.props.type === 'edit'? this.getData(this.props.id):''
  }
  onChange = (type,e,value) => {
    console.log(e)
    console.log(value)
    if (type === 'end') {
      this.end_time=value
      this.setState({end_time: value})
    } else {
      this.start_time=value
      this.setState({start_time: value})
    }
  }
  onOk = (type,e) => {
    console.log(e._d)
    console.log(moment(e).format('YYYY-MM-DD HH:mm:ss'))
    if (type === 'end') {
      this.setState({end_time: moment(e).format('YYYY-MM-DD H:mm:ss')})
    } else {
      this.setState({start_time: moment(e).format('YYYY-MM-DD H:mm:ss')})
    }
  }
  getData = (id) => {
    agentDetail({user_id:id}).then(data => {
      if (data) {
        this.setState({detail:data})
        this.props.form.setFieldsValue({
          start_time: moment((data['start_time']).slice(0, -6).replace('T',' '), dateFormat),
          end_time: moment((data['end_time']).slice(0, -5).replace('T',' '), dateFormat),
        });
      }
    })
  }
  render () {
    const { getFieldDecorator } = this.props.form
    return (
      <Form onSubmit={this.handleSubmit}>
        <FormItem label="存续期开始时间">
          {getFieldDecorator('start_time', {
            rules: [{ required: true, message: '请输入姓名!' }]
          })(
            <DatePicker
              showTime
              format={dateFormat}
              placeholder="请选择开始时间"
              onChange={(e,value) => this.onChange('start',e,value)}
              onOk={(e)=>this.onOk('start',e)}
            />
          )}
        </FormItem>
        <FormItem label="存续期结束时间">
          {getFieldDecorator('end_time', {
            rules: [{ required: true, message: '请输入存续期结束时间!' }]
          })(
            <DatePicker
              showTime
              format={dateFormat}
              placeholder="请选择结束时间"
              onChange={(e,value) => this.onChange('end',e,value)}
              onOk={(e)=>this.onOk('end',e)}
            />
          )}
        </FormItem>
        <FormItem>
          <Button type="primary" htmlType="submit" style={{width: '100%'}}>
            提交
          </Button>
        </FormItem>
      </Form>
    )
  }
}
const MyForm = Form.create()(AddForm)

class AdminList extends Component {
  constructor(props) {
    super(props)
    this.state = {
      pagination: {
        current: 1,
        total: 0,
        showTotal: (total) => '共 ' + total + ' 条数据'
      },
      data: [],
      detail: {},
      visible: [false, false, false],
      show:''
    }
  }
  addUser = (values, id, detail) => {
    Object.assign(values,{'user_id': id})
    agentIndentify(values).then(
      (data) => {
        console.log(data)
        if (data) {
          detail.audit = 2
          this.setState({
              show:'Indentify'+id
          })
          console.log(detail.audit)
          message.success('操作成功')
        }
      }
    )
  }
  showModal = (id = null, type, detail = null) => {
    ref = Modal.info({
      title: type === 'add'?'新增代理':'审核代理',
      maskClosable: true,
      content: <MyForm submit={this.addUser} id={id} type={type} detail={detail}></MyForm>,
      okText: ' ',
      okType: 'none'
    })
  }
  options = {
    form: [
      {
        element: 'input',
        name: 'account',
        placeholder: '请输入代理人姓名/联系方式'
      },
      {
        element: 'hidden',
        name: 'result'
      }
    ],
    table: {
      columns: [
        {
          title: '昵称',
          dataIndex: 'nickname',
          key: 'nickname'
        },
        {
          title: '姓名',
          dataIndex: 'name',
          key: 'name'
        },
        {
          title: '微信',
          dataIndex: 'weixin',
          key: 'weixin'
        },
        {
          title: '邮箱',
          dataIndex: 'email',
          key: 'email'
        },
        {
          title: '联系方式',
          dataIndex: 'account',
          key: 'account'
        },
        {
          title: '是否审核',
          dataIndex: 'audit',
          key: 'is_agent',
          filters: [
            { text: '审核未通过', value: 3 },
            { text: '审核通过', value: 2 },
            { text: '未审核', value: 1 }
          ],
          filteredValue: [],
          filterMultiple: false,
          render: (value) => (
            <span>{value === 1 ? '未审核' : (value === 2 ? '审核通过' : '审核未通过')}</span>
          )
        },
        {
          title: '申请代理时间',
          dataIndex: 'end_time',
          key: 'end_time',
          render: (value, row) => {
            return (<span>{formatTime(row.start_time, true)}<br/>至<br/>{formatTime(value, true)}</span>)
          }
        },
        {
          title: '添加时间',
          dataIndex: 'updated_at',
          key: 'updated_at',
          render: (value) => {
            return (<span>{formatTime(value, true)}</span>)
          }
        },
        {
          title: '操作',
          key: 'action',
          render: (text, row, index) => (
            <span>
              <a className="mt-10" onClick={() => this.showModal(row.user_id, 'edit',row)} target="_blank">通过 </a>
              <Popconfirm title={`你确定要拒绝通过该代理的审核吗?`} visible={this.state.visible[index]} onVisibleChange={(visible) => this.handleVisibleChange(visible, row.audit, index, row.user_id)} onConfirm={(e) => this.operate(index, row.user_id)} onCancel={this.cancel} okText="确定" cancelText="取消">
                <a>拒绝</a>
              </Popconfirm>
            </span>
          )
        }
      ]
    }
  }
  operate = (index, id) => {
    console.log(index)
    agentReject({
      user_id: id,
    }).then((data) => {
      if (data) {
        this.setState(prveState => {
          prveState.visible[index] = false
          prveState.data[index].audit = 3
          return {
            visible: prveState.visible,
            show:'show'+id,
            data: prveState.data
          }
        })
      } else {
        message.error('操作不成功，请联系管理员')
        return true
      }
    })
  }
  handleVisibleChange = (visible, type, index, id) => {
    this.setState(prveState => {
      prveState.visible[index] = visible
      return {
        visible: prveState.visible
      }
    })
  }
  search = (page, pageSize,values) => {
    agentList ({
      page: page,
      limit: pageSize,
      ...values
    }).then(data => {
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
  componentWillMount () {
    let type = this.props.history.location.pathname.split('/').pop()
    let id = this.props.history.location.search.split('=').pop()
    type === 'edit'?this.getData(parseInt(id)):''
  }
  getData = (id) => {
    agentDetail({user_id:id}).then(data => {
      if (data) {
        this.setState({detail:data})
        // this.props.form.setFieldsValue({
        //   account: detail['account'],
        //   nickname: detail['nickname'],
        //   password: detail['password'],
        // });
      }
    })
  }
  render() {
    return (
      <div className={this.state.show}>
        <SearchTable options={this.options} data={this.state.data} pagination={this.state.pagination} search={this.search} {...this.props}/>
      </div>
    );
  }
}

export default AdminList

