import React, { Component } from 'react';
import { Input, Icon, Carousel } from 'antd';
import { bannerList, infoList } from '@/config/mobileApi';
import { formatTimeCopyQuShiFen,getScrollTop, getClientHeight, getScrollHeight } from '@/utils/common';
import './article.less';


class Article extends Component {
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
        this.s = true
    }

    componentWillMount() {
        this.bannerInfoList();
        this.infoList(this.page);// 新闻列表
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
            this.infoList(this.page,this.s=false)
        }
    }

    // banner 列表
    bannerInfoList = () => {
        let params = {
            limit:5,
            page:1,
            type:1
        }
        bannerList(params).then(res=>{
            this.setState({
                banner:res.records
            })
        })
    }

    keyup = (e) => {
        if (e.keyCode == 13) {
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

    // 新闻列表
    infoList = (page=1,s) => {
        let params = {
            limit:10,
            page:page,
            title:this.state.title.toLowerCase(),
            type:1
        }
        infoList(params).then(res=>{
            if (this.s == true) {
                this.setState({
                    detail:res.records
                })
            }

            if (this.s == false) {
                this.state.detail = this.state.detail.concat(res.records?res.records:[])
                this.setState({detail:this.state.detail})
            }

            if (this.state.detail!=null) {
                if (this.state.detail.length < parseInt(res.total)) {
                    this.loading = true
                }
            } 
    
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
                        <div className="List" key={i}>
                            <a href={item.url} target="_blank">
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
                            </a>
                        </div>
                    )):<div className="reault">没有您搜索的结果</div>
                }
            </div>
        </div>
    )
  }


}
export default Article