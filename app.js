/**
 * @file app.js
 * @author swan
 */

/* globals swan */

App({

    data:{
        access_token:'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE2MDQ5Mzk0MzcsInVzZXJfbmFtZSI6IjE1NjIzMjA1MTU2IiwiYXV0aG9yaXRpZXMiOlsiUk9MRV9BRE1JTiJdLCJqdGkiOiIyMWFiZGVlNS00OGVkLTQzYTMtYjlkMC01M2Q2Y2IxODIxYWMiLCJjbGllbnRfaWQiOiJwbGFucGx1cyIsInNjb3BlIjpbInJlYWQiLCJ3cml0ZSJdfQ.FqLAalmwDbABLSmWVJZZIQn-H_v8AUdgv9VtVCjXAEE'
    },

    setData:function(param){
        this.data.access_token = param
    },

    onLaunch(options) {
        // do something when launch
    },
    onShow(options) {
        // do something when show
    },
    onHide() {
        // do something when hide
    }
});
