class FaceTrainJob < ApplicationJob
  queue_as :default

  def perform(user_id)
    # Do something later
    user = User.find(user_id)

    # train
    result = `python lib/assets/python/test.py`

    # send email
    RegistedMailer.with(user: user).registed_email.deliver_now
  end
end
