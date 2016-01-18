const PAGE_DEFAULT_OPTIONS = {
    pageSize: 10,
    pageKey: '_page',
    pageSizeKey: 'pageSize',
    recordCountKey: 'recordCount',
    params: (item) => item
};

D.PageableModel = class PageableModel extends D.Model {
    static setDefault (defaults) {
        Object.assign(PAGE_DEFAULT_OPTIONS, defaults);
    }

    constructor (store, options) {
        super(store, options);

        this._data = this._option('data') || [];
        this._p = {
            page: this._option('page') || 1,
            pageCount: 0,
            pageSize: this._option('pageSize') || PAGE_DEFAULT_OPTIONS.pageSize,
            pageKey: this._option('pageKey') || PAGE_DEFAULT_OPTIONS.pageKey,
            pageSizeKey: this._option('pageSizeKey') || PAGE_DEFAULT_OPTIONS.pageSizeKey,
            recordCountKey: this._option('recordCountKey') || PAGE_DEFAULT_OPTIONS.recordCountKey
        };
    }

    set (data = {}, trigger) {
        this._p.recordCount = data[this._p.recordCountKey] || 0;
        this._p.pageCount = Math.ceil(this._p.recordCount / this._p.pageSize);
        super.set(data, trigger);
    }

    get params () {
        const { page, pageKey, pageSizeKey, pageSize } = this._p;
        const params = super.params;
        params[pageKey] = page;
        params[pageSizeKey] = pageSize;
        return PAGE_DEFAULT_OPTIONS.params(params);
    }

    clear (trigger) {
        this._p.page = 1;
        this._p.recordCount = 0;
        this._p.pageCount = 0;
        super.clear(trigger);
    }

    turnToPage (page) {
        if (page <= this._p.pageCount && page >= 1) this._p.page = page;
        return this;
    }

    firstPage () { return this.turnToPage(1); }

    lastPage () { return this.turnToPage(this._p.pageCount); }

    nextPage () { return this.turnToPage(this._p.page + 1); }

    prevPage () { return this.turnToPage(this._p.page - 1); }

    get pageInfo () {
        const { page, pageSize, recordCount } = this._p;
        let result;
        if (this.data && this.data.length > 0) {
            result = { page, start: (page - 1) * pageSize + 1, end: page * pageSize, total: recordCount };
        } else {
            result = { page, start: 0, end: 0, total: 0 };
        }

        if (result.end > result.total) result.end = result.total;
        return result;
    }
};

D.registerModel('pageable', D.PageableModel);
