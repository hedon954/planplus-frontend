Page({
    data: {
        promptText: '获取验证码',
        countDown: 60,
    },

    getVerificationCode: function() {

        this.setData('promptText', this.data.countDown + '秒后重新获取');

        this.interval = setInterval(() => {
            if(this.count(this.data.countDown) <= 0) {
                this.interval && clearInterval(this.interval);
            }
        }, 1000);

    },

    count: function(n) {
        n -= 1;
        this.setData('countDown', n);
        if(n <= 0) {
            this.setData({
                promptText: '获取验证码',
                countDown: 60
            });
            return 0;
        }
        this.setData('promptText', this.data.countDown + '秒后重新获取');
        return n;
    }

});