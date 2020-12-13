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
            "/images/createTask.png",
            "/images/modifyTask.png",
            "/images/startTask.png",
            "/images/finishTask.png"
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
