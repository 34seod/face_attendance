class FaceTrainJob < ApplicationJob
  queue_as :default

  def perform(user_id)
    # Do something later
    user = User.find(user_id)

    # train
    train_step = 100
    result = `python lib/assets/python/inception/retrain.py --bottleneck_dir=./workspace/bottlenecks --model_dir=./workspace/inception --output_graph=./workspace/users_graph.pb --output_labels=./workspace/users_labels.txt --image_dir ./workspace/users --how_many_training_steps #{train_step}`

    # send email
    RegistedMailer.with(user: user).registed_email.deliver_now
  end
end
