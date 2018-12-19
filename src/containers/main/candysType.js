import React, { Component } from 'react';
import { message, Form, Input, Button, Breadcrumb, Upload, DatePicker, Modal, Icon, Radio} from 'antd'
import moment from 'moment';
import 'moment/locale/zh-cn'
import {addCandy,editCandy,candyDetail,bgList} from '../../utils/request'
import './candysType.less'
import Config from '@/../config/config'
import apiUrl from '../../config/apiUrl'

const FormItem = Form.Item
const dateFormat = 'YYYY-MM-DD HH:mm:ss';
const { TextArea } = Input;
const RadioGroup = Radio.Group;

class CandyForm extends Component {
  constructor(props) {
    super(props)
    this.state = {
      previewVisible: false,
      previewImage: '',
      fileList: [{
        uid: -1,
        url: '',
      }],
      data: {},
      status: '',
      start_time: '',
      end_time: '',
      share_background_url:'',
      bgLists:[],
      visible: [false, false, false],
    }
    this.taken = 0
  }
  handleSubmit = (e) => {
    const {history} = this.props
    let type = this.props.history.location.pathname.split('/').pop()
    e.preventDefault()
    let id = this.props.history.location.search.split('=').pop()
    
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        if (parseFloat(values.total) - parseFloat(this.taken) < 0) {
          message.error(`发放总量必须大于或等于${this.taken}`)
          return
        }
        values.end_time = this.state.end_time || values.end_time.toDate().toISOString().slice(0, -5).replace('T',' ')
        values.start_time = this.state.start_time || values.start_time.toDate().toISOString().slice(0, -5).replace('T',' ')
        values.candy_icon = this.state.fileList[0].url
        values.share_background_url = this.state.share_background_url
        Object.assign(values,{id, id})
        values.id = parseInt(values.id)
        type !== 'add' ? values.id = parseInt(values.id) : values.item_id = parseInt(values.id)
        values.total = parseFloat(values.total) - parseFloat(this.taken)
        values.quota = parseFloat(values.quota)
        values.unit_price = parseFloat(values.unit_price)
        values.charge_count = parseFloat(values.charge_count)
        values.i_fifth_reward = parseFloat(values.i_fifth_reward)
        values.i_first_reward = parseFloat(values.i_first_reward)
        values.i_fourth_reward = parseFloat(values.i_fourth_reward)
        values.i_second_reward = parseFloat(values.i_second_reward)
        values.i_sixth_reward = parseFloat(values.i_sixth_reward)
        values.i_third_reward = parseFloat(values.i_third_reward)
        values.fifth_reward = parseFloat(values.fifth_reward)
        values.first_reward = parseFloat(values.first_reward)
        values.fourth_reward = parseFloat(values.fourth_reward)
        values.second_reward = parseFloat(values.second_reward)
        values.sixth_reward = parseFloat(values.sixth_reward)
        values.third_reward = parseFloat(values.third_reward)
        values.transform_charge = parseFloat(values.transform_charge)
        values.minimum = parseFloat(values.minimum)
        values.decimal = parseFloat(values.decimal)
        console.log(values)
        type === 'add' ?
        (addCandy(values).then(
          (data) => {
            if (data.code === 0) {
              message.success('添加成功！')
              history.goBack()
            }
          }
        ))
        :(editCandy(values).then(
          (data) => {
            if (data.code === 0) {
              message.success('编辑成功！')
              history.goBack()
            }
          }
        ))
      }
    })
  }
  onChange = (type,e,value) => {
    if (type === 'end') {
      this.end_time=value
      this.setState({end_time: value})
    } else {
      this.start_time=value
      this.setState({start_time: value})
    }
  }
  onOk = (type,e) => {
    if (type === 'end') {
      this.setState({end_time: moment(e).format('YYYY-MM-DD H:mm:ss')})
    } else {
      this.setState({start_time: moment(e).format('YYYY-MM-DD H:mm:ss')})
    }
  }
  componentWillMount () {
    let type = this.props.history.location.pathname.split('/').pop()
    let id = this.props.history.location.search.split('=').pop()
    this.getAllBg().then(() => {
      if (type === 'edit') {
        this.getData(parseInt(id))
      }
    })
  }
  getAllBg = ()=>{
    return new Promise((resolve)=> {
      bgList ().then(data => {
        this.setState({
          bgLists: data
        })
        resolve()
      })
    })
  }
  getData = (id) => {
    candyDetail({id}).then(data => {
      if (data) {
        this.state.fileList[0].url = data['candy_icon']
        this.taken = data['taken'] || 0
        const share_background = this.state.bgLists.filter(item => item.id===data['share_background'])
        const share_background_url = share_background[0]['url']
        this.setState({data, share_background_url})
        this.props.form.setFieldsValue({
          candy_symbol: data['candy_symbol'],
          address: data['address'],
          contract_address: data['contract_address'],
          decimal: data['decimal'],
          total: data['taken']?data['total']+data['taken']:data['total'],
          quota: data['quota'],
          start_time: moment((data['start_time']).slice(0, -6).replace('T',' '), dateFormat),
          end_time: moment((data['end_time']).slice(0, -5).replace('T',' '), dateFormat),
          first_reward: data['first_reward'],
          i_first_reward: data['i_first_reward'],
          second_reward: data['second_reward'],
          i_second_reward: data['i_second_reward'],
          third_reward: data['third_reward'],
          i_third_reward: data['i_third_reward'],
          fourth_reward: data['fourth_reward'],
          i_fourth_reward: data['i_fourth_reward'],
          fifth_reward: data['fifth_reward'],
          i_fifth_reward: data['i_fifth_reward'],
          sixth_reward: data['sixth_reward'],
          i_sixth_reward: data['i_sixth_reward'],
          unit_price: data['unit_price'],
          share_rule_detail: data['share_rule_detail'],
          charge_count: data['charge_count'],
          candy_icon: data['candy_icon'],
          draw_info: data['draw_info'],
          share_background_url,
          local_currency: data['local_currency'],
          transform_charge: data['transform_charge'],
          invite_code: data['invite_code'],
          minimum: data['minimum'],
          only_new: data['only_new']
        });
      }
    })
  }
  handleCancel = () => this.setState({ previewVisible: false })

  onclick=(e) => {
    this.setState({
      share_background_url: e.target.value,
    });
  }

  handlePreview = (file) => {
    this.setState({
      previewImage: file.url || file.thumbUrl,
      previewVisible: true,
    });
  }

  changeIcon = (file) => {
    let fileList = [{
      uid: -1,
      url: file.data,
    }]
    this.setState({fileList: fileList})
  }

  update = (file) => {
    if (file.file.size > 1024*500) {
      message.error('上传图片过大,请重新选择图片！')
      return false
    } else if (file.file.name) {

    }
  }

  render () {
    const { getFieldDecorator } = this.props.form
    let type = this.props.history.location.pathname.split('/').pop()
    const uploadButton = (
      <div>
        <Icon type="plus" />
        <div className="ant-upload-text">上传图片</div>
      </div>
    );

    const options = {
      action: Config.backend + apiUrl.upload,
      headers: {
        Authorization: JSON.parse(localStorage.getItem('admin') || '{}')
      },
      fileList:this.state.fileList[0].url ? this.state.fileList : null
    }
    return (
      <div>
        <Breadcrumb>
          <Breadcrumb.Item onClick={() => {this.props.history.goBack()}}>返回</Breadcrumb.Item>
          <Breadcrumb.Item>{type === 'add' ? '新增': '编辑'}糖果</Breadcrumb.Item>
        </Breadcrumb>
        <Form onSubmit={this.handleSubmit} className="formRow" layout="inline">
          <FormItem label="糖果名称">
            {getFieldDecorator('candy_symbol', {
              rules: [{ required: true, message: '请输入糖果名称!' }]
            })(
              <Input type="text" placeholder="糖果名称，不能和其他糖果重复命名" />
            )}
          </FormItem>
          <FormItem label="发放总量">
            {getFieldDecorator('total', {
              rules: [{ required: true, message: '请输入发放总量!' }]
            })(
              <Input type="text" placeholder="发放总量" />
            )}
          </FormItem>
          <FormItem label="单人领取">
            {getFieldDecorator('quota', {
              rules: [{ required: true, message: '请输入单人领取!' }]
            })(
              <Input type="text" placeholder="单人领取" />
            )}
          </FormItem>
          <FormItem label="领取提示">
            {getFieldDecorator('draw_info', {
              rules: [{ required: true, message: '请输入领取提示!' }]
            })(
              <Input type="text" placeholder="领取提示" />
            )}
          </FormItem>
          <FormItem label="钱包地址">
            {getFieldDecorator('address', {
              rules: [{ required: true, message: '请输入区块链地址!' }]
            })(
              <Input type="text" placeholder="区块链地址" />
            )}
          </FormItem>
          <FormItem label="合约地址">
            {getFieldDecorator('contract_address', {
              rules: [{ required: true, message: '请输入糖果智能合约地址!' }]
            })(
              <Input type="text" placeholder="请输入糖果智能合约地址!" />
            )}
          </FormItem>
          <FormItem label="合约小数位数">
            {getFieldDecorator('decimal', {
              rules: [{ required: true, message: '请输入合约小数位数!' }]
            })(
              <Input type="number" placeholder="请输入合约小数位数!" />
            )}
          </FormItem>
          <FormItem label="领取开始时间">
            {getFieldDecorator('start_time', {
              rules: [{ type: 'object', required: true, message: '请选择开始时间' }]
            })(
              <DatePicker
                showTime
                format={dateFormat}
                placeholder="请选择开始时间"
                onChange={(e,value) => this.onChange('start',e,value)}
                onOk={(e,value)=>this.onOk('start',e,value)}
              />
            )}
          </FormItem>
          <FormItem label="领取结束时间">
            {getFieldDecorator('end_time', {
              rules: [{ type: 'object', required: true, message: '请选择结束时间' }]
            })(
              <DatePicker
                showTime
                format={dateFormat}
                placeholder="请选择结束时间"
                onChange={(e,value)=>this.onChange('end',e,value)}
                onOk={(e,value)=>this.onOk('end',e,value)}
              />
            )}
          </FormItem>
          <FormItem label="一级奖励">
            {getFieldDecorator('first_reward', {
              rules: [{ required: true, message: '请输入一级奖励!' }]
            })(
              <Input type="number" placeholder="一级奖励" step={0.001}/>
            )}
          </FormItem>
          <FormItem label="二级奖励">
            {getFieldDecorator('second_reward', {
              rules: [{ required: true, message: '请输入二级奖励!' }]
            })(
              <Input type="number" placeholder="二级奖励" step={0.001}/>
            )}
          </FormItem>
          <FormItem label="三级奖励">
            {getFieldDecorator('third_reward', {
              rules: [{ required: true, message: '请输入三级奖励!' }]
            })(
              <Input type="number" placeholder="三级奖励" step={0.001}/>
            )}
          </FormItem>
          <FormItem label="四级奖励">
            {getFieldDecorator('fourth_reward', {
              rules: [{ required: true, message: '请输入四级奖励!' }]
            })(
              <Input type="number" placeholder="四级奖励" step={0.001}/>
            )}
          </FormItem>
          <FormItem label="五级奖励">
            {getFieldDecorator('fifth_reward', {
              rules: [{ required: true, message: '请输入五级奖励!' }]
            })(
              <Input type="number" placeholder="五级奖励" step={0.001}/>
            )}
          </FormItem>
          <FormItem label="六级奖励">
            {getFieldDecorator('sixth_reward', {
              rules: [{ required: true, message: '请输入六级奖励!' }]
            })(
              <Input type="number" placeholder="六级奖励" step={0.001}/>
            )}
          </FormItem>
          <FormItem label="项目奖励一">
            {getFieldDecorator('i_first_reward', {
              rules: [{ required: true, message: '请输入项目奖励一!' }]
            })(
              <Input type="number" placeholder="项目奖励一" step={0.001}/>
            )}
          </FormItem>
          <FormItem label="项目奖励二">
            {getFieldDecorator('i_second_reward', {
              rules: [{ required: true, message: '请输入项目奖励二!' }]
            })(
              <Input type="number" placeholder="项目奖励二" step={0.001}/>
            )}
          </FormItem>
          <FormItem label="项目奖励三">
            {getFieldDecorator('i_third_reward', {
              rules: [{ required: true, message: '请输入项目奖励三!' }]
            })(
              <Input type="number" placeholder="项目奖励三" step={0.001}/>
            )}
          </FormItem>
          <FormItem label="项目奖励四">
            {getFieldDecorator('i_fourth_reward', {
              rules: [{ required: true, message: '请输入项目奖励四!' }]
            })(
              <Input type="number" placeholder="项目奖励四" step={0.001}/>
            )}
          </FormItem>
          <FormItem label="项目奖励五">
            {getFieldDecorator('i_fifth_reward', {
              rules: [{ required: true, message: '请输入项目奖励五!' }]
            })(
              <Input type="number" placeholder="项目奖励五" step={0.001}/>
            )}
          </FormItem>
          <FormItem label="项目奖励六">
            {getFieldDecorator('i_sixth_reward', {
              rules: [{ required: true, message: '请输入项目奖励六!' }]
            })(
              <Input type="number" placeholder="项目奖励六" step={0.001}/>
            )}
          </FormItem>
          <FormItem label="提币手续费">
            {getFieldDecorator('charge_count', {
              rules: [{ required: true, message: '请输入糖果单价!' }]
            })(
              <Input type="number" placeholder="提币手续费" step={0.001}/>
            )}
          </FormItem>
          <FormItem label="糖果转让费">
            {getFieldDecorator('transform_charge', {
              rules: [{ required: true, message: '请输入糖果转让费!' }]
            })(
              <Input type="number" placeholder="糖果转让费" step={0.001}/>
            )}
          </FormItem>
          <FormItem label="糖果单价">
            {getFieldDecorator('unit_price', {
              rules: [{ required: true, message: '请输入糖果单价!' }]
            })(
              <Input type="number" placeholder="糖果单价" step={0.001}/>
            )}
          </FormItem>
          <FormItem label="最小提币数量">
            {getFieldDecorator('minimum', {
              rules: [{ required: true, message: '请输入最小提币数量!' }]
            })(
              <Input type="number" placeholder="最小提币数量" step={0.001}/>
            )}
          </FormItem>
          <FormItem label="领取码">
            {getFieldDecorator('invite_code', {
              rules: [{ required: false, message: '请输入领取码!' }]
            })(
              <Input placeholder="领取码"/>
            )}
          </FormItem>
          <FormItem label="新用户可领取">
            {getFieldDecorator('only_new')(
              <RadioGroup>
                <Radio value={true}>是</Radio>
                <Radio value={false}>否</Radio>
              </RadioGroup>
            )}
          </FormItem>
          <FormItem label="采用交易所价格">
            {getFieldDecorator('local_currency')(
              <RadioGroup>
                <Radio value={false}>是</Radio>
                <Radio value={true}>否</Radio>
              </RadioGroup>
            )}
          </FormItem>
          <FormItem label="邀请规则">
            {getFieldDecorator('share_rule_detail', {
              rules: [{ required: true, message: '请输入邀请规则!' }]
            })(
              <TextArea placeholder="邀请规则" autosize/>
            )}
          </FormItem>
          <FormItem label="ICON">
            {getFieldDecorator('candy_icon', {
              rules: [{ required: true, message: '请上传图片!' }]
            })(
              <div className="clearfix">
                <Upload {...options}
                  listType="picture-card"
                  accept = 'image/*'
                  onPreview={this.handlePreview}
                  onSuccess = {this.changeIcon}
                  onChange = {this.update}
                >
                  {this.state.fileList.length > 1 ? null : uploadButton}
                </Upload>
                <Modal visible={this.state.previewVisible} footer={null} onCancel={this.handleCancel}>
                  <img alt="example" style={{ width: '100%' }} src={this.state.previewImage} />
                </Modal>
              </div>
            )}
          </FormItem>
          <FormItem label="背景图" className='bgList'>
            {getFieldDecorator('share_background_url', {
              rules: [{ required: true, message: '请选择背景图片!' }]
            })(
              <RadioGroup onChange={this.onclick} value={this.state.share_background_url}>
                {this.state.bgLists.map((item,key)=>{
                  return (<Radio key={key} value={item.url}><img src={item.url} width='100'/></Radio>)
                })}
              </RadioGroup>
            )}
          </FormItem>
          <FormItem>
            <Button type="primary" htmlType="submit" style={{width: '100%'}}>
              提交
            </Button>
          </FormItem>
        </Form>
      </div>
    )
  }
}
const CandyType = Form.create()(CandyForm)

export default CandyType

