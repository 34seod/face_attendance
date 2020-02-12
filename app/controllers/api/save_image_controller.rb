module Api
  class SaveImageController < ApplicationController
    def save
      binding.pry
      File.open('tmp/avc.jpeg', 'wb') { |f| f.write(Base64.decode64(base_64_encoded_data)) }
    end
  end
end
