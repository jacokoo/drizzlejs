D.Adapter = {
    Promise: Promise,

    ajax (params) { throw new Error('Ajax is not implemented'); },

    ajaxResult (args) { return args[0]; },

    getEventTarget (event) { return e.currentTarget || e.target; }


};
