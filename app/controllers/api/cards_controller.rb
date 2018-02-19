module Api
  class CardsController < ApplicationController
    def index
      cards = Card.all.order(:orderN)
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

    def element_moved
      e = Card.find(params[:e])
      new_position = Card.find(params[:new_position])
      if e.orderN > new_position.orderN
        cards = Card.where('orderN BETWEEN ? AND ?', new_position.orderN, e.orderN - 1).order(:orderN)
        cards.each do |card|
          card.orderN = card.orderN + 1
          card.save
        end
        e.orderN = new_position.orderN
        e.save
      else
        cards = Card.where('orderN BETWEEN ? AND ?', e.orderN + 1, new_position.orderN).order(:orderN)
        cards.each do |card|
          card.orderN = card.orderN - 1
          card.save
        end
        e.orderN = new_position.orderN
        e.save
      end
      render json: true
    end
  end
end
