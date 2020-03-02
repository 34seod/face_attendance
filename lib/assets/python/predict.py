# https://github.com/tensorflow/tensorflow/blob/c565660e008cf666c582668cb0d0937ca86e71fb/tensorflow/examples/image_retraining/retrain.py
# python retrain.py --bottleneck_dir=./workspace/bottlenecks --model_dir=./workspace/inception --output_graph=./workspace/users_graph.pb --output_labels=./workspace/users_labels.txt --image_dir ./workspace/users --how_many_training_steps 1000

import tensorflow as tf
import cv2
from shutil import rmtree
from os import listdir, mkdir
from os.path import isdir, isfile, join

tf.app.flags.DEFINE_string("output_graph", "lib/assets/python/workspace/users_graph.pb", "학습된 신경망이 저장된 위치")
tf.app.flags.DEFINE_string("output_labels", "lib/assets/python/workspace/users_labels.txt", "학습할 레이블 데이터 파일")
tf.app.flags.DEFINE_boolean("show_image", False, "이미지 추론 후 이미지를 보여줍니다")
FLAGS = tf.app.flags.FLAGS
PREDICT_DATA_FOLDER = 'lib/assets/python/workspace/predict_data'
TARGET_FOLDER = 'lib/assets/python/workspace/target'
FACE_CLASSIFIER = cv2.CascadeClassifier('lib/assets/python/workspace/haarcascade_frontalface_default.xml')

def face_extractor(img):
    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
    faces = FACE_CLASSIFIER.detectMultiScale(gray, 1.3, 5)
    if faces is():
        return None
    for(x,y,w,h) in faces:
        cropped_face = img[y:y+h, x:x+w]
    return cropped_face

def make_folder_if_not_exist(path):
    if not isdir(path):
        mkdir(path)
    return path

def get_image(folder_path):
    make_folder_if_not_exist(TARGET_FOLDER)
    files = [f for f in listdir(folder_path) if isfile(join(folder_path, f))]

    for i, img_file in enumerate(files):
        image_path = join(folder_path, img_file)
        image = cv2.imread(image_path)

        if face_extractor(image) is not None:
            face = cv2.resize(face_extractor(image), (200, 200))
            face = cv2.cvtColor(face, cv2.COLOR_BGR2GRAY)
            cv2.imwrite(join(TARGET_FOLDER, f"{i}.jpg"), face)
            rmtree(PREDICT_DATA_FOLDER)
            return join(TARGET_FOLDER, f"{i}.jpg")
        else:
            pass

def main(_):
    file_path = get_image(PREDICT_DATA_FOLDER)

    labels = [line.rstrip() for line in tf.gfile.GFile(FLAGS.output_labels)]

    with tf.gfile.FastGFile(FLAGS.output_graph, 'rb') as fp:
        graph_def = tf.GraphDef()
        graph_def.ParseFromString(fp.read())
        tf.import_graph_def(graph_def, name='')

    with tf.Session() as sess:
        logits = sess.graph.get_tensor_by_name('final_result:0')
        image = tf.gfile.FastGFile(file_path, 'rb').read()
        prediction = sess.run(logits, {'DecodeJpeg/contents:0': image})

    for i in range(len(labels)):
        name = labels[i]
        score = prediction[0][i]
        print('%s (%.2f%%)' % (name, score * 100))

    rmtree(TARGET_FOLDER)

if __name__ == "__main__":
    tf.app.run()
