module Api
  class SaveImageController < ApplicationController

    # POST "/save"
    def save
      ApplicationRecord.transaction do
        # DB
        user = User.new(user_params)

        if user.save
          # image
          Dir.mktmpdir do |dir|
            File.open("#{dir}/video.webm", 'wb') { |f| f.write(Base64.decode64(base_64_encoded_data)) }
            movie = FFMPEG::Movie.new("#{dir}/video.webm")
            FileUtils.mkdir_p("lib/assets/python/inception/workspace/users/#{user_params[:company_id]}")
            movie.screenshot("lib/assets/python/inception/workspace/users/#{user_params[:company_id]}/#{Time.zone.now.strftime('%Y%m%d%H%M%S')}_%d.jpg", { vframes: 10000, frame_rate: 24/1, quality: 1 }, validate: false)
          end

          # ML job
          FaceTrainJob.perform_later(user.id)

          redirect_to root_url
        else
          render json: user.errors.messages, status: :unprocessable_entity
        end
      end
    end

    private

    def user_params
      params.permit(:name, :company_id, :nfc_id)
    end

    def base_64_encoded_data
      params[:data].split(",").last
    end
  end
end
