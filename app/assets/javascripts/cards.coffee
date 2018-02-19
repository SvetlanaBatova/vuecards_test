$ ->
  new Vue({
    el: '#app',
    data: {
      perPageList: [1,2,5,10]
      sortFields: ['','title','id']
      filterFields: ['','title','id','description']
      perPage: 5
      filterField: ''
      filterText: ''
      sortField: ''
      sortDesc: false
      cardWidth: 270
      cardHeight: 350
      api_url: "/api/cards"
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
        $.ajax(url: "/api/cards/element_moved", data: data).done ->
          self.$refs.vuecardstable.reload()
      onElementSelectionChanged: (e, is_selected) ->
        console.log("card with id #{e.id} is selected: #{is_selected}")
      getSelected: () ->
        selected_vuecards = this.$refs.vuecardstable.getSelected();
        console.log(selected_vuecards);
      onReload: (pageData) ->
        self = this
        $.get(this.api_url + "?currentPage=" + pageData['currentPage'] + "&perPage=" + pageData['perPage'] + "&sortField=" + pageData['sortField'] + "&sortDesc=" + pageData['sortDesc'] + "&filterField=" + pageData['filterField'] + "&filterText=" + pageData['filterText']).done (res) ->
          self.$refs.vuecardstable.updateAfterReload(res.data, res.maxPages)
    }
  })