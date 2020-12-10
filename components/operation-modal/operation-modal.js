Component({
    properties: {
        showOperationModal: {
            type: Boolean,
            value: true,
        },
        formSubScribeId: {
            type: String,
            value: ''
        },
        btnVisible: {
            type: Boolean,
            value: true
        }
    },

    methods: {
        handleDelay(e) {
            this.triggerEvent('handleDelay', e);
        },
        handleDraft(e) {
            this.triggerEvent('handleDraft', e);
        },
        handleDelete(e) {
            this.triggerEvent('handleDelete', e);
        },
        handleCancel(e) {
            this.triggerEvent('handleCancel', e);
        }
    }
});