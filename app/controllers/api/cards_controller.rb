module Api
  class CardsController < ApplicationController
    def index
      cards = Card.all
      if params["filterField"] != ''
        cards = cards.where("#{params['filterField']} LIKE ?","%#{params['filterText']}%")
      end
      if params["sortField"] != ''
        cards = (params["sortDesc"] == "true" ? cards.order("#{params["sortField"]} DESC") : cards.order(params["sortField"]))
      end
      res = {}
      res["perPage"] = Integer(params[:perPage])
      res["maxPages"] = (Float(cards.length)/res["perPage"]).ceil
      res["currentPage"] = Integer(params[:currentPage])
      res["data"] = cards.first(res["currentPage"]*res["perPage"])
      items = res["data"].count % res["perPage"]
      res["data"] = res["data"].last(items == 0 ? res["perPage"] : items).as_json
      render json: res.as_json()
    end
  end
end
