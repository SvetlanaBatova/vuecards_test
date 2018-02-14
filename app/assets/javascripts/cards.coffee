$ ->
  new Vue({
    el: '#app',
    data: {
      perPageList: [1,2,5,10],
      sortFields: ['title','id'],
      filterFields: ['title','id','description'],
      perPage: 2
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
    }
  })