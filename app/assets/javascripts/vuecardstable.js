Vue.component('vue-cardstable', {
    template: '<div class="container"><div class="row"><div class="col-xs-12 col-sm-6 col-md-4 col-lg-3 d-flex align-items-stretch" v-for="vuecard in vuecards"><div class="card w-100 mt-2"><slot name="card" :card="vuecard"></slot></div></div></div></div>',
    props: ['api_url','per_page','per_page_list'],
    data: function () {
        return {
            currentPage: 1,
            perPage: this.per_page,
            perPageList: this.per_page_list,
            maxPages: 1,
            numOfDisplayedPages: 5,
            sortField: '',
            sortDesc: false,
            filterField: '',
            filterText: '',
            vuecards: []
        }
    },
    methods: {
        reload: function () {
            self = this;
            $.get(this.api_url + "?currentPage=" + self.currentPage + "&perPage=" + self.perPage + "&sortField=" + self.sortField + "&sortDesc=" + self.sortDesc + "&filterField=" + self.filterField + "&filterText=" + self.filterText).done (function (res) {
                self.vuecards = res.data;
                paginationData = {};
                paginationData['currentPage'] = self.currentPage;
                paginationData['maxPages'] = res.maxPages;
                paginationData['numOfDisplayedPages'] = self.numOfDisplayedPages;
                self.$emit('vue-cardstable:pagination-data',paginationData);
                perPageData = {};
                perPageData['perPage'] = self.perPage;
                perPageData['perPageList'] = self.perPageList;
                self.$emit('vue-cardstable:perpage-data',perPageData);
            })
        },
        changePage: function (page) {
            this.currentPage = page;
            this.reload();
        },
        changePerPage: function (perPage) {
            this.perPage = perPage;
            this.currentPage = 1;
            this.reload();
        },
        changeSortField: function (field) {
            this.sortField = field;
            this.currentPage = 1;
            this.reload();
        },
        changeSortDesc: function (sortDesc) {
            this.sortDesc = sortDesc;
            this.currentPage = 1;
            this.reload();
        },
        search: function (searchData) {
            this.filterField = searchData['filterField'];
            this.filterText = searchData['filterText'];
            this.currentPage = 1;
            this.reload();
        }
    },
    beforeMount: function () {
        this.reload();
    }
})

Vue.component('vue-cardstable-pagination', {
    template: '<nav><ul class="pagination justify-content-center"><li class="page-item" v-bind:class="{\'disabled\': (currentPage == 1)}"><a class="page-link" @click="goToFirst"><span aria-hidden="true">&laquo;</span><span class="sr-only">Previous</span></a></li><li class="page-item" v-bind:class="{\'disabled\': (currentPage == 1)}"><a class="page-link" @click="goToPrev">&lsaquo;</a></li><li class="page-item" v-for="page in pages" v-bind:class="{\'active\': page == currentPage}"><a class="page-link" @click="goToPage(page)">{{ page }}</a></li><li class="page-item" v-bind:class="{\'disabled\': (currentPage == maxPages)}"><a class="page-link" @click="goToNext">&rsaquo;</a></li><li class="page-item" v-bind:class="{\'disabled\': (currentPage == maxPages)}"><a class="page-link" @click="goToLast"><span aria-hidden="true">&raquo;</span><span class="sr-only">Next</span></a></li></ul></nav>',
    data: function () {
        return {
            pages: [1],
            currentPage: 1,
            maxPages: 1
        }
    },
    methods: {
        goToFirst: function () {
            this.$emit('vue-cardstable-pagination:change-page',1);
        },
        goToLast: function () {
            this.$emit('vue-cardstable-pagination:change-page',this.maxPages);
        },
        goToPrev: function () {
            this.$emit('vue-cardstable-pagination:change-page',this.currentPage - 1);
        },
        goToNext: function () {
            this.$emit('vue-cardstable-pagination:change-page',this.currentPage + 1);
        },
        goToPage: function (page) {
            this.$emit('vue-cardstable-pagination:change-page',page);
        },
        setPaginationData: function (paginationData) {
            this.currentPage = paginationData['currentPage'];
            this.maxPages = paginationData['maxPages'];
            if (paginationData['currentPage'] - (paginationData['numOfDisplayedPages'] - 1)/2 < 1 || paginationData['numOfDisplayedPages'] > paginationData['maxPages']) {
                startPage = 1;
            }
            else if (paginationData['currentPage'] + (paginationData['numOfDisplayedPages'] - 1)/2 > paginationData['maxPages']) {
                startPage = paginationData['maxPages'] - paginationData['numOfDisplayedPages'] + 1;
            }
            else {
                startPage = paginationData['currentPage'] - (paginationData['numOfDisplayedPages'] - 1)/2;
            }
            this.pages = Array.apply(null, Array(Math.min(paginationData['numOfDisplayedPages'], paginationData['maxPages']))).map(function (_, i) {return i + startPage;});
        }
    }
})

Vue.component('vue-cardstable-pagination-dropdown', {
    template: '<div class="form-group"><select class="form-control" @change="changePerPage" v-model="perPage"><option v-for="perPage in perPageList">{{ perPage }}</option></select></div>',
    data: function () {
        return {
            perPage: null,
            perPageList: []
        }
    },
    methods: {
        changePerPage: function () {
            this.$emit('vue-cardstable-pagination-dropdown:change-perpage',this.perPage);
        },
        setPerPageData: function (perPageData) {
            this.perPage = perPageData['perPage'];
            this.perPageList = perPageData['perPageList'];
        }
    }
})

Vue.component('vue-cardstable-sort', {
    template: '<div class="form-group"><div class="checkbox"><label><input type="checkbox" v-model="sortDesc" @click="changeSortDesc">Reverse order</label></div><select class="form-control" @change="changeSortField" v-model="field"><option v-for="field in sort_fields">{{ field }}</option></select></div>',
    props: ['sort_fields'],
    data: function () {
        return {
            field: '',
            sortDesc: false
        }
    },
    methods: {
        changeSortField: function () {
            this.$emit('vue-cardstable-sort:change-sort-field',this.field);
        },
        changeSortDesc: function () {
            this.$emit('vue-cardstable-sort:change-sort-desc',this.sortDesc);
        }
    }
})

Vue.component('vue-cardstable-filter', {
    template: '<div class="form-group"><select class="form-control" v-model="field"><option v-for="field in filter_fields">{{ field }}</option></select><input type="text" v-model="filterText" class="form-control" placeholder="Search for..."><button class="btn btn-default" @click="search">Search</button></div>',
    props: ['filter_fields'],
    data: function () {
        return {
            field: '',
            filterText: ''
        }
    },
    methods: {
        search: function () {
            this.$emit('vue-cardstable-filter:change-filter-text',{'filterText': this.filterText, 'filterField': this.field});
        }
    }
})