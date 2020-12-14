Component({
    properties: {
        content: {
            type: String,
            value: ''
        },
        time: {
            type: String,
            value: ''
        },
        place: {
            type: String,
            value: ''
        },
        countDownTime: {
            type: String,
            value: ''
        },
        isToday: {
            type: Boolean,
            value: true
        },
        delStyle: {
            type: String,
            value: ''
        },
        isStart: {
            type: Number,
        },
        formSubScribeId: {
            type: String,
            value: ''
        },
    },

    data: {}, // 私有数据，可用于模版渲染

    // 生命周期函数，可以为函数，或一个在methods段中定义的方法名
    attached: function () {},

    detached: function () {},

    methods: {
        handleTap(e) {
            this.triggerEvent("handleTap");
        },
        handleStartEnd(e1,e2) {
            this.triggerEvent("handleStartEnd", {e1, e2});
        }
    }
});