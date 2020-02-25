class FaceTrainJob < ApplicationJob
  queue_as :default

  def perform(user_id)
    # Do something later
    user = User.find(user_id)

    # train
    train_step = 100
    inception_dir = 'lib/assets/python'
    `python #{inception_dir}/retrain.py --bottleneck_dir=#{inception_dir}/workspace/bottlenecks --model_dir=#{inception_dir}/workspace/inception --output_graph=#{inception_dir}/workspace/users_graph.pb --output_labels=#{inception_dir}/workspace/users_labels.txt --image_dir #{inception_dir}/workspace/users --how_many_training_steps #{train_step}`

    # send email
    RegistedMailer.with(user: user).registed_email.deliver_now
  end
end
