Rails.application.routes.draw do
  # For details on the DSL available within this file, see https://guides.rubyonrails.org/routing.html
  root 'join#index'

  scope module: :api do
    post 'save' => 'save_image#save'
  end
end
