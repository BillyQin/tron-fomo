import React, { Component } from 'react';
import { Input, Icon, Carousel, Form, Modal } from 'antd';
import { bannerList, infoList, infoDetails} from '@/config/mobileApi';
import { formatTimeCopy, formatTimeCopyQuShiFen, getScrollTop, getClientHeight, getScrollHeight } from '@/utils/common';
import './notice.less';

// 公告详情弹框
let ref = null
const FormItem = Form.Item
class NoticeDetail extends Component {
  constructor(props) {
      super(props)
      this.state = {
        title:'',
        created_at:'',
        origin:'',
        prospectus:''
      }
  }

  componentWillMount() {
      this.infoDetails();// 资讯详情
  }

  infoDetails = () => {
      let params = {
          id:this.props.id
      }
    infoDetails(params).then(res=>{
        this.setState({
            title:res.title,
            created_at:res.created_at,
            origin:res.origin,
            prospectus:res.prospectus
        })
        console.log(res)
    })
  }

  render() {
      const { title, created_at, origin, prospectus } = this.state
    return(
        <div className="noticeDetail">
            <h1>{title}</h1>
            <div className="center">
                <div className="center-left">{formatTimeCopy(created_at)}</div>
                <div className="center-right">{origin}</div>
            </div>
            <div className="bottom" dangerouslySetInnerHTML={{__html: prospectus}}></div>
        </div>
    )
  }
}
const MyForm = Form.create()(NoticeDetail) 

class Notice extends Component {
    constructor(props) {
        super(props);
        this.state = {
            banner:[],
            title:'',
            detail:[]
        }
        this.page = 1
        this.loading = false
        this.loadMore = null
        this.s = false
    }
  
    componentWillMount() {
        this.bannerInfoList();
        this.infoList(this.page);// 公告列表
    }

    componentDidMount() {
        const loadMore = () => {
            this.getData()
        }
        this.loadMore = loadMore
        window.addEventListener('scroll', this.loadMore);
    }

    componentWillUnmount() {
        window.removeEventListener('scroll', this.loadMore);
    }

    getData = () => {
        if (this.loading && getScrollTop() + getClientHeight() +100 > getScrollHeight()) {
            this.loading = false
            this.page ++;
            this.infoList(this.page)
        }
    }

    // banner 列表
    bannerInfoList = () => {
        let params = {
            limit:5,
            page:1,
            type:2
        }
        bannerList(params).then(res=>{
            this.setState({
                banner:res.records
            })
        })
    }

    keyup = (e) => {
        if (e.keyCode == 13) {
            console.log('13')
            this.infoList(1,this.s=true);
        }   
    }

    searchInfo = () => {
        this.infoList(1,this.s=true);
    }

    onChangeSearch = (e) => {
        this.setState({
            title:e.target.value
        })      
    }

    // 公告列表
    infoList = (page=1) => {
        let params = {
            limit:10,
            page:page,
            title:this.state.title.toLowerCase(),
            type:2
        }
        infoList(params).then(res=>{
            if (this.s == true) {
                this.setState({
                    detail:res.records
                })
            }

            if (this.s == false) {
                this.state.detail = this.state.detail.concat(res.records?res.records:[])
                    this.setState({
                        detail:this.state.detail
                    })
            }
           
            if (this.state.detail!=null) {
                if (this.state.detail.length < parseInt(res.total)) {
                    this.loading = true
                }
            }  
            
        })
    }

    showModal = (id) => {
        ref = Modal.info({
          title: '公告详情',
          maskClosable: true,
          content: <MyForm id={id} submit={this.addUser}></MyForm>,
          okText: ' ',
          okType: 'none',
          closable: true,
          iconType:'none',
        })
      }

  render() {
    return (
        <div className="infoRightWarp">
            <div className="content">
                <div className="search">
                    <Input type="search"
                        placeholder="搜索"
                        onChange={this.onChangeSearch}
                        onKeyUp={this.keyup}
                    />
                    <Icon type="search" onClick={this.searchInfo} theme="outlined" />
                </div>
                <div className="slidebar">
                    <Carousel autoplay>
                    {
                        this.state.banner?this.state.banner.map((item,i)=>(
                            <a href={item.link} key={i}  target="_blank">
                                <img src={item.url} />
                            </a>
                        )):''
                    } 
                    </Carousel>
                </div>
                {
                    this.state.detail?
                    this.state.detail.map((item,i)=>(
                        <div className="List" key={i} onClick={this.showModal.bind(this,item.id)}>
                            <div className="list">
                                <div className="list-left">
                                    <img src={item.icon}/>
                                </div>
                                <div className="list-right">
                                <p className="zding-title">
                                    {item.stick?<img className="zding" src={require('../../../../assets/img/zding.png')}/>:''}
                                    <span>{item.title}</span>
                                </p>
                                    <div className="origin-time">
                                        <span className="origin">{item.origin}</span>
                                        <span className="time">{formatTimeCopyQuShiFen(item.created_at)}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )):<div className="reault">没有您搜索的结果</div>
                }
            </div>
        </div>
    )
  }


}
export default Notice