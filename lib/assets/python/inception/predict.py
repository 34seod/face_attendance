# https://github.com/tensorflow/tensorflow/blob/c565660e008cf666c582668cb0d0937ca86e71fb/tensorflow/examples/image_retraining/retrain.py
# python retrain.py --bottleneck_dir=./workspace/bottlenecks --model_dir=./workspace/inception --output_graph=./workspace/users_graph.pb --output_labels=./workspace/users_labels.txt --image_dir ./workspace/users --how_many_training_steps 1000

import tensorflow as tf
import matplotlib.pyplot as plt
import matplotlib.image as mpimg
import sys

tf.app.flags.DEFINE_string("output_graph", "./workspace/users_graph.pb", "학습된 신경망이 저장된 위치")
tf.app.flags.DEFINE_string("output_labels", "./workspace/users_labels.txt", "학습할 레이블 데이터 파일")
tf.app.flags.DEFINE_boolean("show_image", False, "이미지 추론 후 이미지를 보여줍니다")
FLAGS = tf.app.flags.FLAGS

def main(_):
    labels = [line.rstrip() for line in tf.gfile.GFile(FLAGS.output_labels)]

    with tf.gfile.FastGFile(FLAGS.output_graph, 'rb') as fp:
        graph_def = tf.GraphDef()
        graph_def.ParseFromString(fp.read())
        tf.import_graph_def(graph_def, name='')

    with tf.Session() as sess:
        logits = sess.graph.get_tensor_by_name('final_result:0')
        image = tf.gfile.FastGFile(sys.argv[1], 'rb').read()
        prediction = sess.run(logits, {'DecodeJpeg/contents:0': image})

    # print('=== 예측 결과 ===')
    for i in range(len(labels)):
        name = labels[i]
        score = prediction[0][i]
        print('%s (%.2f%%)' % (name, score * 100))

    if FLAGS.show_image:
        img = mpimg.imread(sys.argv[1])
        plt.imshow(img)
        plt.show()

if __name__ == "__main__":
    tf.app.run()
