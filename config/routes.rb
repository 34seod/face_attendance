Rails.application.routes.draw do
  # For details on the DSL available within this file, see https://guides.rubyonrails.org/routing.html
  scope module: :api do
    post 'save' => 'save_image#save'
  end

  scope module: :gui do
    root 'attendance#index'
    get 'new' => 'attendance#new'
    get 'check' => 'attendance#check'
  end
end
