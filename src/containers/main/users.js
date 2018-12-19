import React, { Component } from 'react';
import { message, Popconfirm,Form,Modal,Checkbox,Button,DatePicker } from 'antd'
import SearchTable from '../../components/SearchTable';
import {userList, operateUser,editAgent,showAgent,addAgent, transformStatus, excelDownload} from '@/utils/request'
// import { Link } from 'react-router-dom';
import {formatTime} from '@/utils/common';
import moment from 'moment';
import { commonGet } from '../../config/mobileApi';
let ref = null
const FormItem = Form.Item
const dateFormat = 'YYYY-MM-DD HH:mm:ss'

class AddForm extends Component {
  constructor(props) {
    super(props)
    this.state = {
      detail: {},
      start_time: '',
      end_time: '',
    },
    this.end_time= '',
    this.start_time= ''
  }
  handleSubmit = (e) => {
    const { submit,detail } = this.props
    e.preventDefault()
    this.props.form.validateFields((err, values) => {
      if (!err) {
        ref.destroy()
        values.start_time = this.state.start_time || values.start_time.toDate().toISOString().slice(0, -5).replace('T',' ')
        values.end_time = this.state.end_time || values.end_time.toDate().toISOString().slice(0, -5).replace('T',' ')
        values.status = values.status?1:2
        console.log(this.props.type)
        submit(values, this.props.id, this.props.type, detail)
      }
    })
  }
  componentWillMount () {
    console.log(this.props.type)
    this.props.type === 'edit'? this.getData(this.props.id):''
  }
  getData = (id) => {
    showAgent({user_id:id}).then(data => {
      if (data) {
        this.setState({detail:data})
        this.props.form.setFieldsValue({
          start_time: moment((data['start_time']).slice(0, -6).replace('T',' '), dateFormat),
          end_time: moment((data['end_time']).slice(0, -5).replace('T',' '), dateFormat),
          status: data['status'] === 1? true: false,
        });
      }
    })
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
          {getFieldDecorator('status', {
            valuePropName: 'checked',
          })(
            <Checkbox>是否代理</Checkbox>
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
class UserList extends Component {
  constructor(props) {
    super(props)
    this.state = {
      pagination: {
        current: 1,
        total: 0,
        showTotal: (total) => '共 ' + total + ' 条数据'
      },
      data: [],
      visible: [false, false, false],
      showV: ''
    }
  }
  options = {
    form: [
      {
        element: 'input',
        name: 'account',
        placeholder: '请输入注册账号'
      }
    ],
    buttons: [
      {
        text: '用户列表下载',
        onClick: () => {excelDownload().then(link => {
            window.location.href = link;
          })
        }
      }
    ],
    table: {
      columns: [
        {
          title: '注册账户',
          dataIndex: 'account',
          key: 'account'
        },
        {
          title: '邀请人',
          dataIndex: 'inviter_account',
          key: 'inviter_account'
        },
        {
          title: '昵称',
          dataIndex: 'nickname',
          key: 'nickname'
        },
        {
          title: '注册时间',
          dataIndex: 'created_at',
          key: 'created_at',
          render: (value) => {
            return (<span>{value? formatTime(value, true):''}</span>)
          }
        },
        {
          title: '认证状态',
          dataIndex: 'kyc_status',
          key: 'kyc_status',
          filters: [
            { text: '未通过', value: 3 },
            { text: '未认证', value: 1 },
            { text: '已认证', value: 2 }
          ],
          filteredValue: [],
          filterMultiple: false,
          render: (value) => {
            return (<span>{value === 2? '已认证': (value === 1? '未认证': '未通过')}</span>)
          }
        },
        {
          title: '当前状态',
          dataIndex: 'status',
          key: 'status',
          filters: [
            { text: '封禁', value: 2 },
            { text: '正常', value: 1 }
          ],
          filteredValue: [],
          filterMultiple: false,
          render: (text, row) => (
            <span>{row.status>1 ? '封禁' : '正常'}</span>
          )
        },
        {
          title: '是否代理',
          dataIndex: 'is_agent',
          key: 'is_agent',
          filters: [
            { text: '代理过期', value: 3 },
            { text: '未代理', value: 1 },
            { text: '已代理', value: 2 }
          ],
          filteredValue: [],
          filterMultiple: false,
          render: (value) => (
            <span>{value === 2 ? '已代理' : (value === 1 ? '未代理' : '代理过期')}</span>
          )
        },
        {
          title: '存续时间',
          dataIndex: 'start_time',
          key: 'start_time',
          render: (value,row) => {
            return (<span>{row.is_agent === 1 ? '':(<span>{value? formatTime(value, true):''}<br/>{row.end_time? formatTime(row.end_time, true):''}</span>)}</span>)
          }
        },
        {
          title: '转让状态',
          dataIndex: 'transform_status',
          key: 'transform_status',
          render: (value,row) => {
            return (<span>{row.transform_status === 1 ? '允许转入': '禁止转入'}</span>)
          }
        },
        {
          title: '持有资产（¥）',
          dataIndex: 'asset',
          key: 'asset',
        },
        {
          title: '操作',
          key: 'action',
          render: (text, row, index) => (
            <span>
              <a className="mt-10" onClick={() => this.showModal(row.user_id, row)} target="_blank">{row.is_agent !== 1 ? '编辑代理':'新增代理'}</a>&nbsp;
              <Popconfirm key={0} title={`你确定要${row.status>1 ? '解封' : '封禁'}该用户吗?`} visible={this.state.visible[index]} onVisibleChange={(visible) => this.handleVisibleChange(visible, row.status, index, row.user_id)} onConfirm={(e) => this.operate(index, row.status, row.user_id)} onCancel={this.cancel} okText="确定" cancelText="取消">
                <a>{row.status>1 ? ' 解封' : ' 封禁 '}</a>
              </Popconfirm>

              <a className="mt-10" onClick={() => this.setTransStatus(row.transform_status === 1? 2:1, row.user_id, index)}>{row.transform_status === 1 ? '禁止转入':' 允许转入'}</a>&nbsp;
            </span>
          )
        }
      ]
    }
  }
  showModal = (id, row) => {
    let type = row.is_agent===2?'edit':'add'
    ref = Modal.info({
      title: row.is_agent !== 2 ? '编辑代理':'新增代理',
      maskClosable: true,
      content: <MyForm submit={this.addUser} id={id} type={type} detail={row}></MyForm>,
      okText: ' ',
      okType: 'none'
    })
  }

  setTransStatus = (transform_status, user_id, index) => {
    transformStatus({transform_status, user_id}).then(() => {
      let newRow = this.state.data
      newRow[index].transform_status = transform_status
      this.setState({data: newRow})
    })
  }
  
  addUser = (values, id, type, row) => {
    Object.assign(values,{'user_id': id})
    type === 'add' ?
    (addAgent(values).then(
      (data) => {
        if (data.code === 0) {
          row.is_agent = values.status
          row.end_time = values.end_time
          row.start_time = values.start_time
          this.setState({showV: 'agent'+id})
          message.success('添加成功')
        }
      }
    ))
    :(editAgent(values).then(
      (data) => {
        if (data.code === 0) {
          row.is_agent = values.status
          row.end_time = values.end_time
          row.start_time = values.start_time
          this.setState({showV: 'agent'+id})
          message.success('编辑成功')
        }
      }
    ))
  }
  operate = (index, status, id) => {
    operateUser({
      status: status === 2 ? 1 : 2,
      user_id: id
    }).then((data) => {
      if (data) {
        this.setState(prveState => {
          prveState.visible[index] = false
          prveState.data[index].status = status === 2 ? 1 : 2
          return {
            visible: prveState.visible,
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
  search = (page, pageSize, values = null, filters) => {
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
    userList (requestData).then(data => {
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

export default UserList
