module Api
  class SaveImageController < ApplicationController

    # POST "/save"
    def save
      Dir.mktmpdir do |dir|
        File.open("#{dir}/av.webm", 'wb') { |f| f.write(Base64.decode64(base_64_encoded_data)) }
        movie = FFMPEG::Movie.new("#{dir}/av.webm")
        movie.screenshot("./tmp/seo/screenshot_%d.jpg", { vframes: 1000, frame_rate: '12/1' }, validate: false)
      end
      head :no_content
    end

    private

    def permitted_params
      params.permit(:data)
    end

    def base_64_encoded_data
      permitted_params[:data].split(",").last
    end
  end
end
