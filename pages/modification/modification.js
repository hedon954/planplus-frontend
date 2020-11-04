Page({
    data: {
        content: "吃饭",
        startDate: '2020-11-05',
        startTime: '12:12',
        endDate: '2020-11-06',
        endTime: '14:00',
        place: '银泰',
        frequency: '仅一次',
        remindTime: '提前5分钟'
    },
    dateChangeDay(e) {
        console.log('picker-date changed，值为', e.detail.value);
        console.log(e.currentTarget.id);
        if(e.currentTarget.id == 'startD') {
            this.setData(
                'startDate', e.detail.value
            );
        } else {
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
    }
});
