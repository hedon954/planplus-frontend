Component({
    properties: {
        showDiyModal: {
            type: Boolean,
            value: true
        },
        timeLeft: {
            type: String,
            value: '30分钟'
        },
        content: {
            type: String,
            value: '吃饭'
        },
        place: {
            type: String,
            value: '银泰'
        },
        time: {
            type: String,
            value: '20:00'
        },
        predictTimeConsumed: {
            type: String,
            value: '60分钟'
        },
        isConflict: {
            type: Boolean,
            value: true
        }
    },

    methods: {
        handleModify() {
            this.triggerEvent('modifyTaskInfo');
        },
        handleVerify() {
            this.triggerEvent('verifyTaskInfo');
        }
    }
});