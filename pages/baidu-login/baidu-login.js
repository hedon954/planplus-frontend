/**
 * 实例化  app
 */
const app = getApp();

var barOption = {
    // 标题
    title: {
        text: '近一周任务数量统计',
        left:'20',
        top:'15',
    },
    color: ['#bedcfa', '#98acf8'],
    tooltip:{
        trigger:'axis'
    },
    // 图例
    legend: {
        data:['任务总数','已完成任务数'],
        top:'50',
    },
    grid:{
        top:110,
        left:40,
    },
    // x轴
    xAxis: {
        type:"category",
        axisLabel:{'interval':0},
        data:['11-29','\n11-30','12-01','\n12-02','12-03','\n12-04','12-05'],
    },
    yAxis: {
        name:"数量",
        type:"value",
    },
    // 数据
    series: [
        {
            name: '任务总数',
            type: 'bar',
            // data: [10, 25, 37, 15,14,28,36],
            data: [],
            barGap: 0,
        },
        {
            name: '已完成任务数',
            type: 'bar',
            // data: [5, 20, 36, 10,8,24,32],
            data: [],
        }
    ],
};

var lineOption = {
    title: {
        text: '近一周任务质量统计',
        left:'20',
        top:'15',
    },
    color: ['#b088f9', '#98acf8'],
    legend: {
        data: ['推迟次数', '完成百分比'],
        top: 55,
        left: 'center',
        z: 100
    },
    grid: {
        top:110,
        right:50,
        left:40,
        // containLabel: true
    },
    tooltip: {
        show: true,
        trigger: 'axis'
    },
    xAxis: {
        type: 'category',
        boundaryGap: false,
        axisLabel:{'interval':0},
        data: ['11-29','\n11-30','12-01','\n12-02','12-03','\n12-04','12-05'],
    },
    yAxis: [{
        x: 'center',
        type: 'value',
        splitLine: {
            lineStyle: {
                type: 'dashed'
            }
        }
        // show: false
    },{
        type: 'value',
        min:0,
        max:100,
        interval:20,
        axisLabel:{
            formatter:'{value}%'
        }
    }],
    series: [{
        name: '推迟次数',
        type: 'line',
        smooth: true,
        // data: [18, 36, 65, 30, 78, 40, 33]
        data: []
    }, {
        name: '完成百分比',
        type: 'line',
        smooth: true,
        yAxisIndex:1,
        // data: [12, 50, 51, 35, 70, 30, 20]
        data: []
    }]
};


/**
 * 当前页面
 */
Page({

    /**
     * 数据
     */
    data:{
        barOption:barOption,
        lineOption: lineOption,
        current: 0,
        itemId: 0,
        switchIndicateStatus: true,
        switchAutoPlayStatus: false,
        switchVerticalStatus: false,
        switchDuration: 500,
        autoPlayInterval: 2000,
    },
    onLoad: function () {
        // 监听页面加载的生命周期函数
        swan.request({
            url: 'https://www.hedon.wang/project/task/weeklyState',
            method: 'GET',
            header:{
                'Authorization': 'bearer '+app.data.access_token
            },
            responseType: 'text',
            success:res=>{
                console.log(res.data);
                if(res.data.code == 1000){
                   this.setData('barOption.xAxis.data',res.data.data.dateOfWeek);
                   this.setData('lineOption.xAxis.data',res.data.data.dateOfWeek);
                   this.setData('barOption.series[0].data',res.data.data.numOfTasks);
                   this.setData('barOption.series[1].data',res.data.data.numOfFinishedTasks);
                   this.setData('lineOption.series[1].data',res.data.data.completePercentage);
                   this.setData('lineOption.series[0].data',res.data.data.numOfDelay);
                }
                else{
                    swan.showToast({
                        title: res.data.message
                    })
                }
            }

        });

    },
    onShow: function() {
        // 监听页面显示的生命周期函数
    },

});
