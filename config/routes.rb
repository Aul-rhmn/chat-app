Rails.application.routes.draw do
  namespace :api do
    resources :messages, only: [:index, :create]
  end
  
  # Catch-all route to handle SPA routing
  get '*path', to: 'application#index', constraints: ->(request) do
    !request.xhr? && request.format.html?
  end
end

