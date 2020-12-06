/**
 * 实例化  app
 */
const app = getApp();

var weeklyDate= ["11-30", '\n12-01', "12-02", "\n12-03", "12-04", "\n12-05", "12-06"];

var barOption = {
    // 标题
    title: {
        text: '近一周任务数量统计',
        left:'10',
        top:'10',
    },
    color: ['#37A2DA', '#67E0E3'],
    tooltip:{
        trigger:'axis'
    },
    // 图例
    legend: {
        data:['任务总数','已完成任务数'],
        top:'45',
    },
    grid:{
        top:90,
    },
    // x轴
    xAxis: {
        type:"category",
        axisLabel:{'interval':0},
        data:weeklyDate,
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
            data: [10, 25, 37, 15,14,28,36],
            barGap: 0,
        },
        {
            name: '已完成任务数',
            type: 'bar',
            data: [5, 20, 36, 10,8,24,32],
        }
    ],
};

var lineOption = {
    title: {
        text: '近一周任务质量统计',
        left:'10',
        top:'10',
    },
    color: ['#37A2DA', '#9FE6B8'],
    legend: {
        data: ['推迟次数', '完成百分比'],
        top: 45,
        left: 'center',
        z: 100
    },
    grid: {
        top:90,
        right:50,
        left:30,
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
        data: weeklyDate,
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
        data: [18, 36, 65, 30, 78, 40, 33]
    }, {
        name: '完成百分比',
        type: 'line',
        smooth: true,
        yAxisIndex:1,
        data: [12, 50, 51, 35, 70, 30, 20]
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
        barOption: barOption,
        lineOption: lineOption,
        date:[],
        numOfTasks:[],
        numOfFinishedTasks:[],
        completePercentage:[],
    },
    onLoad: function () {
        // 监听页面加载的生命周期函数
        swan.request({
            url: 'http://localhost:10030/project/task/weeklyState',
            method: 'GET',
            header:{
                'Authorization': 'bearer '+app.data.access_token
            },
            responseType: 'text',
            success:res=>{
                console.log(res.data);
                if(res.data.code == 1000){
                   this.setData({
                       date:res.data.data.dateOfWeek,
                       numOfFinishedTasks:res.data.data.numOfFinishedTasks,
                       numOfTasks:res.data.data.numOfTasks,
                       completePercentage:res.data.data.completePercentage,
                   });
                   this.setChartsData(this.data.date);
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

    setChartsData:function(param){
        barOption.xAxis.data = param;
    }

});
