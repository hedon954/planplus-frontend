Page({ // eslint-disable-line
    data: {
        fourStepsActive: 1,
        fourSteps: [
            {
                text: '创建任务'
            },
            {
                text: '修改任务'
            },
            {
                text: '推迟任务'
            },
            {
                text: '开始任务'
            }
        ],
        showImage: [
            "https://tva1.sinaimg.cn/large/0081Kckwgy1glmbjjg8s7j30u01j478t.jpg",
            "https://tva1.sinaimg.cn/large/0081Kckwgy1glmbk1zihuj30u01j4jxu.jpg",
            "https://tva1.sinaimg.cn/large/0081Kckwgy1glmbk9tpevj30u01j479j.jpg",
            "https://tva1.sinaimg.cn/large/0081Kckwgy1glmbkez6faj30u01j4juc.jpg"
        ],
        imageActive: 0
    },

    /**
     * 展示提示
     *
     * @param {string} title 提示内容
     */
    showToast(title) {
        swan.showToast({
            title,
            icon: 'none'
        });
    },

    /**
     * 执行步骤 —— Up
     */
    changeActiveUp() {
        const {fourStepsActive, fourSteps} = this.data;
        if (fourStepsActive < fourSteps.length) {
            this.setData({
                fourStepsActive: fourStepsActive + 1,
                imageActive: fourStepsActive
            });
        }
        else {
            this.showToast("恭喜您完成用户指引~");
        }
    },

    /**
     * 执行步骤 ——Down
     */
    changeActiveDown() {
        const {fourStepsActive, fourSteps, imageActive} = this.data;
        if (1 < fourStepsActive) {
            this.setData({
                imageActive: imageActive - 1,
                fourStepsActive: fourStepsActive - 1,
            });
        }
        else {
            this.showToast("前面没有啦~")
        }
    }
});
