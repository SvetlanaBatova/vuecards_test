$ ->
  new Vue({
    el: '#app',
    data: {
      perPageList: [1,2,5,10]
      sortFields: ['title','id']
      filterFields: ['title','id','description']
      perPage: 5
      filterField: ''
      filterText: ''
      sortField: ''
      sortDesc: false
      cardWidth: 270
      cardHeight: 350
    }
    methods: {
      onPaginationData: (paginationData) ->
        this.$refs.pagination.setPaginationData(paginationData)
      onChangePage: (page) ->
        this.$refs.vuecardstable.changePage(page)
      onChangePerPage: (perPage) ->
        this.$refs.vuecardstable.changePerPage(perPage)
      onChangeSortField: (field) ->
        this.$refs.vuecardstable.changeSortField(field)
      onChangeSortDesc: (sortDesc) ->
        this.$refs.vuecardstable.changeSortDesc(sortDesc)
      onPerPageData: (perPageData) ->
        this.$refs.perpage.setPerPageData(perPageData)
      onSearch: (searchData) ->
        this.$refs.vuecardstable.search(searchData)
      onElementMoved: (e, new_position) ->
        self = this
        data = {}
        data['e'] = e.id;
        data['new_position'] = new_position.id;
        $.ajax(url: "/api/cards/element_moved", data:data).done ->
          self.$refs.vuecardstable.reload()
    }
  })