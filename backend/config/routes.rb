Rails.application.routes.draw do
  get "up" => "rails/health#show", as: :rails_health_check

  namespace :api do
    resources :messages, only: [:create, :index] do
      post :suggestions, on: :member
    end

    post "generate-report", to: "reports#create"
  end
end