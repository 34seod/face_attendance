Rails.application.routes.draw do
  # For details on the DSL available within this file, see https://guides.rubyonrails.org/routing.html
  scope module: :api do
    post 'save' => 'image#save'
    post 'check' => 'image#check'
  end

  scope module: :gui do
    root 'attendance#index'
    get 'new' => 'attendance#new'
    get 'check' => 'attendance#check'
  end

  require 'sidekiq/web'
  # sidekiq ダッシュボード
  if Rails.env.development?
    mount Sidekiq::Web => '/sidekiq'
    mount LetterOpenerWeb::Engine, at: '/letter_opener'
  end
end
