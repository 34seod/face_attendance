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
            FileUtils.mkdir_p("lib/assets/python/workspace/data/#{user.id}")
            movie.screenshot("lib/assets/python/workspace/data/#{user.id}/#{Time.zone.now.strftime('%Y%m%d%H%M%S')}_%d.jpg", { vframes: 10000, frame_rate: 24/1, quality: 1 }, validate: false)
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
      Dir.mktmpdir do |dir|
        File.open("#{dir}/video.webm", 'wb') { |f| f.write(Base64.decode64(base_64_encoded_data)) }
        movie = FFMPEG::Movie.new("#{dir}/video.webm")
        FileUtils.mkdir_p("lib/assets/python/workspace/predict_data")
        movie.screenshot("lib/assets/python/workspace/predict_data/%d.jpg", { vframes: 10000, frame_rate: 24/1, quality: 1 }, validate: false)
      end

      # predict
      result = `python lib/assets/python/predict.py`
      max = get_max(result)
      user = User.find(max[0])
      render json: {name: user.name, accurate: max[1]}
    end

    private

    def user_params
      params.permit(:name, :email)
    end

    def base_64_encoded_data
      params[:data].split(",").last
    end

    def get_max(result)
      object = result.split("\n").each_with_object({}) do |data, a|
        match = data.match(/(.+) \((.+)\%\)/)
        next if match[1] == "basic"
        a[match[1]] = match[2].to_f
      end.max { |a, b| a[1] <=> b[1] }
    end
  end
end
