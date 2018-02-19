Rails.application.routes.draw do
  # For details on the DSL available within this file, see http://guides.rubyonrails.org/routing.html
  namespace :api do
    get '/cards', to: 'cards#index'
    get '/cards/element_moved', to: 'cards#element_moved'
  end

  root 'cards#index'
end
