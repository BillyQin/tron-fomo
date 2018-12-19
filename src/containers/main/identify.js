import React, { Component } from 'react';
import { message,Form,Modal,Input,Button,Upload,Radio } from 'antd'
import SearchTable from '../../components/SearchTable';
import {formatTime} from '@/utils/common';
import {indifyList,indify,indifyDetail,indifyKyc} from '../../utils/request'
import axios from 'axios'
import './candysType.less'
import './modalImg.less'
let ref = null
const FormItem = Form.Item
const RadioGroup = Radio.Group

class AddForm extends Component {
  constructor(props) {
    super(props)
    this.state = {
      detail: {},
      previewVisible: false,
      frontVisible: false,
      backVisible: false,
      previewImage: '',
      card_front: '',
      card_back: '',
      hand_hold: '',
      indetifyRes: '',
      reason: '',
      status: 2
    }
  }
  handleSubmit = (status) => {
    const { submit } = this.props
    ref.destroy()
    submit(this.props.row, status, this.state.reason ,this.props.index)
  }
  componentWillMount () {
    this.getData(this.props.row.id)
  }
  getData = (id) => {
    indifyDetail({id:id}).then(data => {
      if (data) {
        this.setState({detail:data,indetifyRes:''})
        this.encrypt('card_front',data.card_front)
        this.encrypt('card_back',data.card_back)
        this.encrypt('hand_hold',data.hand_hold)
        this.props.form.setFieldsValue({
          account: data['account'],
          nickname: data['nickname']
        });
        this.setState({status: data.status, reason: data.fail_reason})
      }
    })
  }
  handleCancel= () => this.setState({ previewVisible: false,frontVisible: false,backVisible: false, })
  handleFront = (file) => {
    this.setState({
      previewImage: file.url || file.thumbUrl,
      frontVisible: true,
    });
  }
  handleBack = (file) => {
    this.setState({
      previewImage: file.url || file.thumbUrl,
      backVisible: true,
    });
  }
  handlePreview = (file) => {
    this.setState({
      previewImage: file.url || file.thumbUrl,
      previewVisible: true,
    });
  }
  encrypt=(type,url)=>{
    axios({
      method: "GET",
      url: url,
      headers: { Authorization: JSON.parse(localStorage.getItem('admin') || '{}') }
　　}).then(data => {
  　　if (data.data.code == 0) {
  　　　　var merchantData = data.data.data;
        type==='card_front'?this.setState({card_front:merchantData})
          :(
            type==='card_back'?this.setState({card_back:merchantData})
              :this.setState({hand_hold:merchantData})
          )
  　　   return merchantData;
  　　}
　　});
  }
  indifyMsg=()=>{
    indifyKyc({id:this.props.row.id}).then(res=>{
      res===1?this.setState({indetifyRes:'验证一致'}):(res===2?this.setState({indetifyRes:'未找到记录'}):this.setState({indetifyRes:'手机号、姓名、身份证号验证不一致'}))
      res===0 && (this.state.detail.shuqin_type===1?this.setState({indetifyRes:'验证一致'}):(this.state.detail.shuqin_type===2?this.setState({indetifyRes:'未找到记录'}):this.setState({indetifyRes:'手机号、姓名、身份证号验证不一致'})))
    })
  }
  onChange = (e) => {
    this.setState({status: e.target.value})
  }
  render () {
    const { getFieldDecorator } = this.props.form
    return (
      <Form className="formModal">
        <FormItem label="姓名">
          <span>{this.state.detail.name}</span>
        </FormItem>
        <FormItem label="身份证号">
          <span>{this.state.detail.card_no}</span>
        </FormItem>
        <FormItem label="身份证正面">
          <Upload
            listType="picture-card"
            fileList={[{
              uid: -1,
              name: '身份证正面.png',
              status: 'done',
              url: 'data:image/png;base64,' + this.state.card_front
            }]}
            onPreview={this.handleFront}
          >
          </Upload>
          <Modal visible={this.state.frontVisible} footer={null} onCancel={this.handleCancel}>
            <img alt="身份证正面" style={{ width: '100%' }} src={this.state.previewImage}/>
          </Modal>
        </FormItem>
        <FormItem label="身份证反面">
          <Upload
            listType="picture-card"
            fileList={[{
              uid: -1,
              name: '身份证反面.png',
              status: 'done',
              url: 'data:image/png;base64,' +this.state.card_back,
            }]}
            onPreview={this.handleBack}
          >
          </Upload>
          <Modal visible={this.state.backVisible} footer={null} onCancel={this.handleCancel}>
            <img alt="身份证反面" style={{ width: '100%' }} src={this.state.previewImage} />
          </Modal>
        </FormItem>
        <FormItem label="手持身份证">
          <Upload
            listType="picture-card"
            fileList={[{
              uid: -1,
              name: '手持身份证.png',
              status: 'done',
              url: 'data:image/png;base64,' +this.state.hand_hold,
            }]}
            onPreview={this.handlePreview}
          >
          </Upload>
          <Modal visible={this.state.previewVisible} footer={null} onCancel={this.handleCancel}>
            <img alt="手持身份证" style={{ width: '100%' }} src={this.state.previewImage} />
          </Modal>
        </FormItem>
        <FormItem label="审核结果" style={{display:this.state.indetifyRes?'block':'none'}}>
            <span>{this.state.indetifyRes}</span>
        </FormItem>
        <FormItem>
          <Button type="primary" onClick={()=> this.indifyMsg(2)} style={{display:!this.state.indetifyRes?'block':'none'}}>
            审核
          </Button>
        </FormItem>
         <FormItem label="审核">
          <RadioGroup onChange={this.onChange} value={this.state.status}>
            <Radio value={2}>通过</Radio>
            <Radio value={3}>拒绝</Radio>
          </RadioGroup>
        </FormItem>
        {
          this.state.status === 3 &&
          <FormItem label="原因">
            <Input placeholder="请输入拒绝原因" maxLength={20} value={this.state.reason} onChange={(e) => this.setState({reason: e.target.value})}/>
            <span>最多20个汉字(含字符)</span>
          </FormItem>
        }
        <FormItem>
          <Button type="primary" onClick={()=> this.handleSubmit(this.state.status)}>
            确定
          </Button>
        </FormItem>
      </Form>
    )
  }
}
const MyModal = Form.create()(AddForm)

class Identify extends Component {
  constructor(props) {
    super(props)
    this.state = {
      pagination: {
        current: 1,
        total: 0,
        showTotal: (total) => '共 ' + total + ' 条数据'
      },
      data: [],
      showV: '',
      visible: [false, false, false],
      detail: {}
    }
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
          title: '帐号',
          dataIndex: 'account',
          key: 'account'
        },
        {
          title: '姓名',
          dataIndex: 'name',
          key: 'name'
        },
        {
          title: '身份证号',
          dataIndex: 'card_no',
          key: 'card_no',
          render: (value) => {
            return (<span>{value}</span>)
          }
        },
        {
          title: '申请时间',
          dataIndex: 'created_at',
          key: 'created_at',
          render: (value) => {
            return (<span>{value? formatTime(value, true) : ''}</span>)
          }
        },
        {
          title: '当前状态',
          dataIndex: 'status',
          key: 'status',
          filters: [
            { text: '已拒绝', value: 3 },
            { text: '已通过', value: 2 },
            { text: '审核中', value: 1 }
          ],
          filteredValue: [],
          filterMultiple: false,
          render: (value) => {
            return (<span>{value === 1? '审核中': (value === 2? '已通过': '已拒绝')}</span>)
          }
        },
        {
          title: '审核时间',
          dataIndex: 'audit_at',
          key: 'audit_at',
          render: (value) => {
            return (<span>{value? formatTime(value, true) : ''}</span>)
          }
        },
        {
          title: '操作',
          key: 'action',
          render: (text, row, index) => (
            <span>
              <a className="mt-10"
                onClick={() => this.showModal(row, index)}
              >审核</a>
            </span>
          )
        }
      ]
    }
  }
  showModal = (row, index) => {
    ref = Modal.info({
      title: '认证审核',
      maskClosable: true,
      content: <MyModal submit={this.indify} row={row} index={index}></MyModal>,
      okText: ' ',
      okType: 'none'
    })
  }
  indify = (row,status,reason='',index) => {
    indify({
      id: row.id,
      status: status,
      reason
    }).then(
      (data) => {
        if (data) {
          if (status === 2) {
            message.success('审核通过')
          } else if (status === 3) {
            message.error('已拒绝')
          }
          row.status = status
          row.audit_at = formatTime(data,true)
          this.setState({showV: 'comment'+row.id})
        }
      }
    )
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
    indifyList (requestData).then(data => {
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
      <div>
        <SearchTable options={this.options} data={this.state.data} pagination={this.state.pagination} search={this.search} {...this.props}/>
      </div>
    );
  }
}

export default Identify
