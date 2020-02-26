module Api
  class ImageController < ApplicationController

    # POST /save
    def save
      ApplicationRecord.transaction do
        # DB
        user = User.new(user_params)

        if user.save
          # image
          Dir.mktmpdir do |dir|
            File.open("#{dir}/video.webm", 'wb') { |f| f.write(Base64.decode64(base_64_encoded_data)) }
            movie = FFMPEG::Movie.new("#{dir}/video.webm")
            FileUtils.mkdir_p("lib/assets/python/data/#{user.id}")
            movie.screenshot("lib/assets/python/data/#{user.id}/#{Time.zone.now.strftime('%Y%m%d%H%M%S')}_%d.jpg", { vframes: 10000, frame_rate: 24/1, quality: 1 }, validate: false)
          end

          # ML job
          FaceTrainJob.perform_later(user.id)

          flash[:notice] = I18n.t('notice.email')
          redirect_to root_url
        else
          render json: user.errors.messages, status: :unprocessable_entity
        end
      end
    end

    # POST /check
    def check
      # snapshot save
      file_path = "tmp/test"
      file_name = "target.jpg"
      FileUtils.mkdir_p(file_path)
      File.open("#{file_path}/#{file_name}", 'wb') { |f| f.write(Base64.decode64(base_64_encoded_data)) }

      # predict
      result = `python lib/assets/python/predict.py #{file_path}/#{file_name}`

      max = get_max(result)
      if max.nil?
        render json: {name: "No Face", accurate: 0 }
      else
        user = User.find(max[0])
        render json: {name: user.name, accurate: max[1]}
      end
    end

    private

    def user_params
      params.permit(:name, :email)
    end

    def base_64_encoded_data
      params[:data].split(",").last
    end

    def get_max(result)
      return if result == "No Face\n"
      target = eval(result).max_by {|x| x.split(" ")[1] }
      target.split(" ")
    end
  end
end
