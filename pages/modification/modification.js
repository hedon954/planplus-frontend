Page({
    data: {
        taskId: 0,
        content: "吃饭",
        startDate: '2020-11-05',
        startTime: '12:12',
        endDate: '2020-11-06',
        endTime: '14:00',
        place: '银泰',
        frequencyList: [{
            id: '0',
            name:'仅一次'
        }, {
            id: '1',
            name: '每天'
        }, {
            id: '2',
            name:'每周'
        }, {
            id: '3',
            name: '每月'
        }],
        frequencyIndex: 0,
        frequency: 0,
        aheadTimeList: [{
            id: '0',
            name:'5分钟'
        }, {
            id: '1',
            name: '10分钟'
        }, {
            id: '2',
            name:'20分钟'
        }, {
            id: '3',
            name: '30分钟'
        }, {
            id: '4',
            name:'1小时'
        }, {
            id: '5',
            name: '2小时'
        }, {
            id: '6',
            name:'5小时'
        }],
        aheadTimeIndex: 0,
        aheadIndexMap: [5, 10, 20, 30, 60, 120, 300],
        aheadTime: 5
    },
    onLoad(options) {
        console.log(options);
        console.log(options.taskId);
        this.setData('taskId', options.taskId);
    },
    dateChangeDay(e) {
        console.log('picker-date changed，值为', e.detail.value);
        console.log(e.currentTarget.id);
        if(e.currentTarget.id == 'startD') {
            this.setData(
                'startDate', e.detail.value
            );
        } else if(e.currentTarget.id == 'endD') {
            this.setData(
                'endDate', e.detail.value
            );
        }
        console.log(this.data.startDate);
    },
    timeChange(e) {
        console.log('picker-time changed，值为', e.detail.value);
        if(e.currentTarget.id == 'startT') {
            this.setData(
                'startTime', e.detail.value
            );
        } else {
            this.setData(
                'endTime', e.detail.value
            );
        }
    },
    selectorChange(e) {
        if(e.currentTarget.id == 'frq') {
            this.setData({
                frequencyIndex: e.detail.value,
                frequency: e.detail.value
            });
            console.log(e.detail.value);
        } else if(e.currentTarget.id == 'ahd') {
            console.log(this.data.aheadIndexMap[e.detail.value]);
            this.setData({
                aheadTimeIndex: e.detail.value,
                aheadTime: this.data.aheadIndexMap[e.detail.value]
            })
        }
    }
});
