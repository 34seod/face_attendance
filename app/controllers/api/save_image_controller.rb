module Api
  class SaveImageController < ApplicationController

    # POST "/save"
    def save
      File.open("tmp/seo/avc_#{Time.zone.now.strftime("%Y%m%d_%H%M%9N")}.png", 'wb') do |f|
        f.write(Base64.decode64(base_64_encoded_data))
      end
      head :no_content
    end

    private

    def permitted_params
      params.permit(:img)
    end

    def base_64_encoded_data
      permitted_params[:img].split(",").last
    end
  end
end
