/**
 * @file immersive-pic.js
 * @author swan
 */
/* globals swan,Page */

Page({ // eslint-disable-line
    data: {
        btnWidth: '543.48',
        navigationAreaStyle: {
            height: '44px'
        },
        homeIconSize: '65rpx'
    },

    /**
     * 点击导航的返回按钮，返回到首页
     *
     */
    backHandler() {
        swan.navigateBack({
            success: () => {
                console.log('success');
            },
            fail: () => {
                console.log('fail');
            }
        });
    }
});
