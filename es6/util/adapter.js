D.Adapter = {
    Promise: Promise,

    ajax (params) {
        throw new Error('Ajax is not implemented');
    },

    ajaxResult (args) {
        return args[0];
    }

};
