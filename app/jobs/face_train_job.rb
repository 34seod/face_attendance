class FaceTrainJob < ApplicationJob
  queue_as :default

  def perform(user_id)
    # train
    train = `python3 lib/assets/python/train.py`
    raise if train.include?("train error")

    # send email
    RegistedMailer.with(user_id: user_id).registed_email.deliver_now
  end
end
