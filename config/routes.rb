Rails.application.routes.draw do
  
  root 'pages#index'

  namespace :api do
    resources :features, only: [:index] do     
      resources :comments, only: [:index, :create]  
    end
  end

  get ' *path ' , to: 'pages#index' , via: :all

end
