class Card < ApplicationRecord
  def as_json(options={})
    r = super(options)
    r.merge!({
                 'image_url' => ActionController::Base.helpers.asset_path(image)
             })
    r
  end
end
