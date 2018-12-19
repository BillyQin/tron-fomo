import React, { Component } from 'react'
import echarts from 'echarts/lib/echarts'
import { compare } from '../utils/common'
import 'echarts/lib/chart/bar'
import 'echarts/lib/chart/line'
import 'echarts/lib/component/tooltip'
import 'echarts/lib/component/grid'
import 'echarts/lib/component/title'

export default class MyChart extends Component {
  constructor(props) {
    super(props);
    this.myChart = null
    this.lineChart = null
  }

  componentDidMount () {
    const { type } = this.props.option // { type }取option下的type
    // 我们要定义一个setPieOption函数将data传入option里面
    this.myChart = echarts.init(this.refs.lineChart) // 初始化echarts
    let options = this.axisOption(this.props.option)
    // console.log(options)
    this.myChart.setOption(options)
  }

  componentWillReceiveProps (nextProps) {
    const hasPropsChange = !compare(nextProps, this.props)
    if (hasPropsChange) {
      // console.log(nextProps)
      this.myChart.setOption(this.axisOption(nextProps.option))
    }
  }

  // handleRef = (n) => {
  //   this.node = n
  //   console.log(n)
  // }
  axisOption (option) {
    // console.log(option)
    // const myChart=echarts.init(document.getElementsByClassName('demo'))
    return { // 柱状图或者折线图
      color: '#fff',
      backgroundColor: 'transparent',
      // {
      //   colorStops: [
      //     {
      //       offset: 0, color: 'rgb(247,140,160)' // 0% 处的颜色
      //     },
      //     {
      //       offset: 0.33, color: 'rgb(249,116,143)' // 0% 处的颜色
      //     },
      //     {
      //       offset: 0.66, color: 'rgb(253,134,140)' // 0% 处的颜色
      //     },
      //     {
      //       offset: 1, color: 'rgb(254,154,139)' // 100% 处的颜色
      //     }
      //   ],
      //   globalCoord: false // 缺省为 false
      // },
      title: { // 图表标题设置
        text: option.title,
        textStyle: {
          color: '#33a7ae',
          align: 'center'
        },
        x: '',
        top: 0,
        left: 0
      },
      tooltip: { // 提示框设置
        trigger: 'axis'
      },
      xAxis: [
        {
          type: 'category', // category:离散数据；value：连续数据；time：时间；log：对数
          // name: '时间', // 坐标轴名称
          splitLine: {show: false}, // 是否显示分割线
          data: option.xData,
          boundaryGap: false,
          axisLine: {
            lineStyle: {
              color: '#fff'
            }
          }
        }
      ],
      yAxis: [
        {
          show: false, // 是否显示Y轴
          type: 'value', // 同xAxis的type一样
          // name: '次数',
          // splitNumber: 10, // 分割端数
          splitLine: {show: false},
          axisLine: {
            lineStyle: {
              color: '#fff'
            }
          }
        }
      ],
      toolbox: { // 工具栏
        show: false,
        feature: {
          mark: {
            show: false
          },
          dataView: {
            // readOnly: true,
            show: false
          },
          restore: {
            show: false
          },
          saveAsImage: {
            show: false
          }
        }
      },
      series: [
        {
          type: option.type,
          data: option.data
        }
      ]
    }
  }
  render () {
    const { height } = this.props.option
    return (
      <div ref='lineChart' style={{height}}></div>
    )
  }
}
