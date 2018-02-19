Vue.component('vue-cardstable', {
    template: '<div :class="cards_class"><div :class="card_container_class"><div v-for="(vuecard,i) in vuecards_all" :class="vuecard.card_class"  @mousedown="startMoveCard($event, i)" @mousemove="i != vuecards.length && moveCard($event, i)" @mouseup="stopMoveCard($event, i)" :style="{opacity: vuecard.opacity, position: vuecard.position, left: vuecard.x + vuecard.dx + \'px\', top: vuecard.y + vuecard.dy + \'px\', width: card_width + \'px\', height: card_height + \'px\'}"><slot name="card" :card="vuecard"></slot></div></div></div>',
    props: ['api_url','per_page','per_page_list','cards_class','card_container_class','card_class','card_class_selected','card_width','card_height'],
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
            vuecards: [],
            current_vuecard: [],
            current_i: null,
            current_replaced: null
        }
    },
    computed: {
        vuecards_all: function () {
            return this.vuecards.concat(this.current_vuecard)
        }
    },
    methods: {
        reload: function () {
            self = this;
            $.get(this.api_url + "?currentPage=" + self.currentPage + "&perPage=" + self.perPage + "&sortField=" + self.sortField + "&sortDesc=" + self.sortDesc + "&filterField=" + self.filterField + "&filterText=" + self.filterText).done (function (res) {

                self.vuecards = res.data;
                i = 0;
                for (card in self.vuecards) {
                    Vue.set(self.vuecards[i], 'card_class', self.card_class);
                    i = i + 1;
                }
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
        disableSelection: function () {
            return false
        },
        startMoveCard: function (e, i) {
            if (this.vuecards[i].card_class == this.card_class)
                this.vuecards[i].card_class = this.card_class_selected;
            else
                this.vuecards[i].card_class = this.card_class;
            this.disableSelection();
            document.onselectstart = new Function ("return false");
            this.current_i = i;
            this.current_replaced = i;
            this.current_vuecard = Object.assign({}, this.vuecards[i]);
            this.current_vuecard.mouseX = e.clientX + $(document).scrollLeft();
            this.current_vuecard.mouseY = e.clientY + $(document).scrollTop();
            this.current_vuecard.dx = 0;
            this.current_vuecard.dy = 0;
            this.current_vuecard.x = e.clientX + $(document).scrollLeft() - this.card_width / 2;
            this.current_vuecard.y = e.clientY + $(document).scrollTop() - this.card_height / 2;
            this.current_vuecard.position = 'absolute';
            this.current_vuecard.isMouseDown = true;
            Vue.set(this.vuecards[i], 'opacity', 0.3);
        },
        moveCard: function (e, i) {
            if (!this.current_vuecard.isMouseDown)
                return;
            v = this.current_vuecard;
            v.dx = e.clientX + $(document).scrollLeft() - this.current_vuecard.mouseX;
            v.dy = e.clientY + $(document).scrollTop() - this.current_vuecard.mouseY;
            this.current_vuecard = v;
            if (this.current_replaced != i) {
                el = this.vuecards[this.current_replaced];
                this.vuecards.splice(this.current_replaced, 1);
                this.vuecards.splice(i, 0, el);
                this.current_replaced = i;
            }
        },
        stopMoveCard: function (e, i) {
            this.current_vuecard.isMouseDown = false;
            this.enableSelection();
            if (this.current_i > this.current_replaced)
                self.$emit('vue-cardstable:element-moved', Object.assign({}, this.current_vuecard), Object.assign({}, this.vuecards_all[this.current_replaced + 1]));
            else if (this.current_i < this.current_replaced)
                self.$emit('vue-cardstable:element-moved', Object.assign({}, this.current_vuecard), Object.assign({}, this.vuecards_all[this.current_replaced - 1]));
            this.current_vuecard = [];
            Vue.set(this.vuecards[this.current_replaced], 'opacity',1);
        },
        enableSelection: function () {
            return true
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
    template: '<div><slot name="card_pagination" :pages="pages" :currentPage="currentPage" :maxPages="maxPages" :goToFirst="goToFirst" :goToLast="goToLast" :goToPrev="goToPrev" :goToNext="goToNext" :goToPage="goToPage"></slot></div>',
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
    template: '<div><slot name="card_pagination_dropdown" :perPage="perPage" :perPageList="perPageList" :changePerPage="changePerPage"></slot></div>',
    data: function () {
        return {
            perPage: null,
            perPageList: []
        }
    },
    methods: {
        changePerPage: function (perPage) {
            this.$emit('vue-cardstable-pagination-dropdown:change-perpage',perPage);
        },
        setPerPageData: function (perPageData) {
            this.perPage = perPageData['perPage'];
            this.perPageList = perPageData['perPageList'];
        }
    }
})

Vue.component('vue-cardstable-sort', {
    template: '<div><slot name="card_sort" :changeSortField="changeSortField" :changeSortDesc="changeSortDesc"></slot></div>',
    methods: {
        changeSortField: function (field) {
            this.$emit('vue-cardstable-sort:change-sort-field',field);
        },
        changeSortDesc: function (sortDesc) {
            this.$emit('vue-cardstable-sort:change-sort-desc',sortDesc);
        }
    }
})

Vue.component('vue-cardstable-filter', {
    template: '<div><slot name="card_filter" :search="search"></slot></div>',
    methods: {
        search: function (field, filterText) {
            this.$emit('vue-cardstable-filter:change-filter-text',{'filterText': filterText, 'filterField': field});
        }
    }
})