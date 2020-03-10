class FaceTrainJob < ApplicationJob
  queue_as :default

  def perform(user_id)
    # train
    `python3 lib/assets/python/train.py`

    # send email
    RegistedMailer.with(user_id: user_id).registed_email.deliver_now
  end
end
