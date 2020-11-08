Component({
    properties: {
        showDelayModal: {
            type: Boolean,
            value: true,
        }
    },

    methods: {
        handleClick(e) {
            this.triggerEvent('handleDelay', e);
        },
        handleCancel() {
            this.triggerEvent('handleClose');
        }
    }
});