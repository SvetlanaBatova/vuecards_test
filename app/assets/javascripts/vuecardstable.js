Vue.component('vue-cardstable', {
    template: '<div :class="cards_class"><div :class="card_container_class"><div v-for="(vuecard,i) in vuecards_all" :class="vuecard.card_class" @contextmenu="selectOne($event)"  @mousedown="startMoveCard($event, i)" @mousemove="i != vuecards.length && moveCard($event, i)" @mouseup="stopMoveCard($event, i)" :style="{opacity: vuecard.opacity, position: vuecard.position, left: vuecard.x + vuecard.dx + \'px\', top: vuecard.y + vuecard.dy + \'px\', width: card_width + \'px\', height: card_height + \'px\'}"><slot name="card" :card="vuecard"></slot></div></div></div>',
    props: ['per_page','per_page_list','cards_class','card_container_class','card_class','card_class_selected','card_width','card_height'],
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
            currentVuecard: [],
            currentI: null,
            currentReplaced: null,
            prevScrollTop: null,
            prevScrollLeft: null
        }
    },
    computed: {
        vuecards_all: function () {
            return this.vuecards.concat(this.currentVuecard)
        }
    },
    methods: {
        reload: function () {
            this.$emit('vue-cardstable:reload', {'currentPage': this.currentPage, 'perPage': this.perPage, 'sortField': this.sortField, 'sortDesc': this.sortDesc, 'filterField': this.filterField, 'filterText': this.filterText});
        },
        updateAfterReload: function (vuecards, maxPages) {
            this.vuecards = vuecards;
            i = 0;
            for (card in this.vuecards) {
                Vue.set(this.vuecards[i], 'card_class', this.card_class);
                i = i + 1;
            }
            paginationData = {};
            paginationData['currentPage'] = this.currentPage;
            paginationData['maxPages'] = maxPages;
            paginationData['numOfDisplayedPages'] = this.numOfDisplayedPages;
            this.$emit('vue-cardstable:pagination-data',paginationData);
            perPageData = {};
            perPageData['perPage'] = this.perPage;
            perPageData['perPageList'] = this.perPageList;
            this.$emit('vue-cardstable:perpage-data',perPageData);
        },
        selectOne: function (e) {
            e.preventDefault();
            return false;
        },
        disableSelection: function () {
            return false;
        },
        isSelected: function (card) {
            if (card.card_class == this.card_class)
                return false;
            else
                return true;
        },
        getSelected: function () {
            return Object.assign({}, this.vuecards.filter(this.isSelected));
        },
        startMoveCard: function (e, i) {
            if (e.which == 3) {
                k = 0;
                for (card in this.vuecards) {
                    if (k != i)
                        Vue.set(this.vuecards[k], 'card_class', this.card_class);
                    k++;
                }
                Vue.set(this.vuecards[i], 'card_class', this.card_class_selected);
            }
            if (e.which != 1)
                return;
            this.disableSelection();
            document.onselectstart = new Function("return false");
            if (e.shiftKey || e.ctrlKey) {
                if (this.vuecards[i].card_class == this.card_class) {
                    this.vuecards[i].card_class = this.card_class_selected;
                    this.$emit('vue-cardstable:element-selection-changed', Object.assign({}, this.vuecards[i]), true);
                }
                else {
                    this.vuecards[i].card_class = this.card_class;
                    this.$emit('vue-cardstable:element-selection-changed', Object.assign({}, this.vuecards[i]), false);
                }
            }
            else {
                this.currentI = i;
                this.currentReplaced = i;
                this.currentVuecard = Object.assign({}, this.vuecards[i]);
                this.prevScrollLeft = $(document).scrollLeft();
                this.prevScrollTop = $(document).scrollTop();
                this.currentVuecard.mouseX = e.clientX + this.prevScrollLeft;
                this.currentVuecard.mouseY = e.clientY + this.prevScrollTop;
                this.currentVuecard.dx = 0;
                this.currentVuecard.dy = 0;
                this.currentVuecard.x = e.clientX + this.prevScrollLeft - this.card_width / 2;
                this.currentVuecard.y = e.clientY + this.prevScrollTop - this.card_height / 2;
                this.currentVuecard.position = 'absolute';
                this.currentVuecard.isMouseDown = true;
                Vue.set(this.vuecards[i], 'opacity', 0.3);
            }
        },
        moveCard: function (e, i) {
            if (!this.currentVuecard.isMouseDown)
                return;
            v = this.currentVuecard;
            v.dx = e.clientX + 2 * $(document).scrollLeft() - this.prevScrollLeft - this.currentVuecard.mouseX;
            v.dy = e.clientY + 2 * $(document).scrollTop() - this.prevScrollTop - this.currentVuecard.mouseY;
            this.prevScrollLeft = $(document).scrollLeft();
            this.prevScrollTop = $(document).scrollTop();
            this.currentVuecard = v;
            if (this.currentReplaced != i) {
                el = this.vuecards[this.currentReplaced];
                this.vuecards.splice(this.currentReplaced, 1);
                this.vuecards.splice(i, 0, el);
                this.currentReplaced = i;
            }
        },
        stopMoveCard: function (e, i) {
            if (e.which != 1)
                return;
            this.enableSelection();
            if (e.shiftKey || e.ctrlKey)
                return;
            this.currentVuecard.isMouseDown = false;
            if (this.currentI > this.currentReplaced)
                this.$emit('vue-cardstable:element-moved', Object.assign({}, this.currentVuecard), Object.assign({}, this.vuecards_all[this.currentReplaced + 1]));
            else if (this.currentI < this.currentReplaced)
                this.$emit('vue-cardstable:element-moved', Object.assign({}, this.currentVuecard), Object.assign({}, this.vuecards_all[this.currentReplaced - 1]));
            this.currentVuecard = [];
            Vue.set(this.vuecards[this.currentReplaced], 'opacity',1);
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