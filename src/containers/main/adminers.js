import React, { Component } from 'react';
import { message, Popconfirm,Form,Modal,Input,Button } from 'antd'
import SearchTable from '../../components/SearchTable';
import {manageAdmin, operateAdmin, addAdmin,editeAdmin,adminDetail} from '../../utils/request'
// import { Link } from 'react-router-dom';
import {formatTime} from '@/utils/common';
import './candysType.less'
let ref = null
const FormItem = Form.Item
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
        submit(values, this.props.id,this.props.type)
      }
    })
  }
  componentWillMount () {
    this.props.type === 'edit'? this.getData(this.props.id):''
  }
  getData = (id) => {
    adminDetail({admin_id:id}).then(data => {
      if (data) {
        this.setState({detail:data})
        this.props.form.setFieldsValue({
          account: data['account'],
          nickname: data['nickname'],
          // password: detail['password'],
        });
      }
    })
  }
  render () {
    const { getFieldDecorator } = this.props.form
    return (
      <Form onSubmit={this.handleSubmit}>
        <FormItem label="姓名">
          {getFieldDecorator('nickname', {
            rules: [{ required: true, message: '请输入姓名!' }]
          })(
            <Input type="text" placeholder="姓名" />
          )}
        </FormItem>
        <FormItem label="手机号/邮箱">
          {getFieldDecorator('account', {
            rules: [{ required: true, message: '请输入手机号/邮箱!' }]
          })(
            <Input type="text" placeholder="手机号/邮箱" />
          )}
        </FormItem>
        {
          this.props.type === 'add'?
          (<FormItem label="登录密码">
          {getFieldDecorator('password', {
            rules: [{ required: true, message: '请输入登录密码!' }]
          })(
            <Input type="password" placeholder="登录密码" />
          )}
        </FormItem>)
          :null
        }
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
    }
  }
  addUser = (values, id, type) => {
    console.log(values)
    type !== 'add' ? Object.assign(values,{'admin_id': id}) : values
    type === 'add' ?
    (addAdmin(values).then(
      (data) => {
        console.log(data)
        if (data.code === 0) {
          message.success('添加成功')
        }
      }
    ))
    :(editeAdmin(values).then(
      (data) => {
        console.log(data)
        if (data.code === 0) {
          message.success('编辑成功')
        }
      }
    ))
  }
  showModal = (id = null, type, detail = null) => {
    console.log('type')
    ref = Modal.info({
      title: type === 'add'?'新增检查员':'编辑检察员',
      maskClosable: true,
      content: <MyForm submit={this.addUser} id={id} type={type} detail={detail}></MyForm>,
      okText: ' ',
      okType: 'none'
    })
  }
  options = {
    buttons: [
      {
        text: '新增',
        onClick: () => this.showModal(null, 'add'),
        // onClick: () => {
        //   const { history } = this.props
        //   history.push('/main/adminList/add')
        // }
      }
    ],
    table: {
      columns: [
        {
          title: '姓名',
          dataIndex: 'nickname',
          key: 'nickname'
        },
        {
          title: '账号',
          dataIndex: 'account',
          key: 'account'
        },
        {
          title: '当前状态',
          dataIndex: 'status',
          key: 'status',
          render: (text, row) => (
            <span>{row.status>1 ? '封禁' : '正常'}</span>
          )
        },
        {
          title: '最近一次登录',
          dataIndex: 'last_checkin_time',
          key: 'last_checkin_time',
          render: (value) => {
            return (<span>{value? formatTime(value, true) : ''}</span>)
          }
        },
        {
          title: '操作',
          key: 'action',
          render: (text, row, index) => (
            <span>
              <a className="mt-10" onClick={() => this.showModal(row.admin_id, 'edit',this.state.detail)} target="_blank">编辑 </a>
              <Popconfirm title={`你确定要${row.status>1 ? '解封' : '封禁'}该管理员吗?`} visible={this.state.visible[index]} onVisibleChange={(visible) => this.handleVisibleChange(visible, row.status, index, row.admin_id)} onConfirm={(e) => this.operate(index, row.status, row.admin_id)} onCancel={this.cancel} okText="确定" cancelText="取消">
                <a>{row.status>1 ? '解封' : '封禁'}</a>
              </Popconfirm>
            </span>
          )
        }
      ]
    }
  }
  operate = (index, status, id) => {
    console.log(id)
    operateAdmin({
      admin_id: id,
      status: status === 2 ? 1 : 2
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
  search = (page, pageSize) => {
    manageAdmin ({
      page: page,
      limit: pageSize,
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
    adminDetail({admin_id:id}).then(data => {
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
      <div className="">
        <SearchTable options={this.options} data={this.state.data} pagination={this.state.pagination} search={this.search} {...this.props}/>
      </div>
    );
  }
}

export default AdminList

