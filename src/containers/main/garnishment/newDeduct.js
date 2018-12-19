import React, { Component } from 'react';
import { Upload, message, Breadcrumb, Button, Icon, Form, Input } from 'antd'
import apiUrl from '../../../config/apiUrl'
import Config from '@/../config/config'
import { uploadExcle, excelLists } from '../../../utils/request';
import SearchTable from '@/components/SearchTable';
import {formatTime} from '@/utils/common';
import './newDeduct.less';



const FormItem = Form.Item
const candyType = [
    {type: 0, name: '全部', unit: ''},
    {type: 1, name: '邀请奖励', unit: '+'},
    {type: 2, name: '被邀请奖励', unit: '+'},
    {type: 3, name: '领取', unit: '+'},
    {type: 4, name: '提币', unit: '-'},
    {type: 5, name: '项目分享获得糖果', unit: '+'},
    {type: 6, name: '完成任务获得糖果', unit: '+'},
    {type: 7, name: '任务上层奖励糖果', unit: '+'},
    {type: 8, name: '兑换减少糖果', unit: '-'},
    {type: 9, name: '兑换增加糖果', unit: '+'},
    {type: 10, name: '转出糖果', unit: '-'},
    {type: 11, name: '转入糖果', unit: '+'},
    {type: 12, name: '平台发放糖果', unit: '+'},
    {type: 13, name: '平台扣除糖果', unit: '-'},
    {type: 14, name: '专属邀请领取糖果', unit: '+'},
    {type: 15, name: '手续费', unit: '-'}
  ]

class GarnishemntNewDeduct extends Component {
    constructor(props) {
        super(props)
        this.state = {
            pagination: {
                current: 1,
                total: 0,
                showTotal: (total) => '共 ' + total + ' 条数据'
            },
            account: '',
            symbol: '',
            symbolLists: [],
            downloadurl:'',
            i:1
        }
    }


    //
    submitBtn = () => {
        const { account, symbol } = this.state 
        if (account.length !== 11 || !account.startsWith('1')) {
          message.info('请输入正确的手机号')
          return
        }
        if (!symbol) {
          message.info('请输入糖果')
          return
        }
        console.log(account, symbol)
        excelLists({
            account:account,
            symbol:symbol
        }).then(res => {
              console.log(res)
              this.setState({downloadurl: res})
          })
        }


    



    render() {
        const props = {
            name: 'file',
            action: Config.backend + apiUrl.uploadExcle,
            headers: {
                Authorization: JSON.parse(localStorage.getItem('admin') || '{}')
            },
            onChange(info) {
              if (info.file.status !== 'uploading') {
                console.log(info.file, info.fileList);
              }
              if (info.file.status === 'done') {
                message.success(`${info.file.name} file uploaded successfully`);
                // setInterval(  
                //     ...props  
                    // uploadExcle().then(res => {
                    //  message.success(res)
                // })
                // ,1000)
            
              } else if (info.file.status === 'error') {
                message.error(`${info.file.name} file upload failed.`);
              }
            },
          };
        return (
            <div className="">
                <Breadcrumb>
                    <Breadcrumb.Item onClick={() => {this.props.history.goBack()}}>返回</Breadcrumb.Item>
                    <Breadcrumb.Item>糖果新增Excel</Breadcrumb.Item>
                </Breadcrumb>
                <Upload {...props}>
                    <Button>
                    <Icon type="upload" />
                    </Button>
                </Upload>
                <div className="divWarp">
                  <Form.Item>
                    <Input placeholder="请输入手机号" value={this.state.account} onChange={(e) => this.setState({account: e.target.value})}/>
                  </Form.Item>
                  <Form.Item>
                    <Input placeholder="请输入币种" value={this.state.symbol} onChange={(e) => this.setState({symbol: e.target.value})}/>
                  </Form.Item>
                  <Button type="primary" onClick={()=> this.submitBtn()} style={{marginLeft: '10px'}}>查询</Button>
                </div>
                <div>{this.state.downloadurl}</div>
                {/* {
                    this.state.i == 1?<div>444</div>:<div>666</div>
                } */}
                <a href="{this.state.downloadurl}" target="_blank"><Button type="primary">下载Excel</Button></a>
            </div>
        )
    }
}
export default GarnishemntNewDeduct