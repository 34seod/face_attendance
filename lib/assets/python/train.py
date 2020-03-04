import cv2
import numpy as np
from shutil import rmtree
from os import listdir, mkdir
from os.path import isdir, isfile, join
from PIL import Image

# 주요 파라메터
base_dir = 'lib/assets/python'
MODEL_FOLDER = join(base_dir, 'model')
DATA_FOLDER = join(base_dir, 'data')
FACE_CLASSIFIER = cv2.CascadeClassifier(join(base_dir, 'lib/haarcascade_frontalface_default.xml'))

# --------------------------------------------------------------------------------------------------
# 없으면 만든다
def make_folder_if_not_exist(path):
    if not isdir(path):
        mkdir(path)
    return path

def get_images_and_labels(datapath):
    target_labels = [f for f in listdir(datapath) if f.startswith(".") == False]
    images = []
    labels = []

    for label in target_labels:
        image_paths = []
        [image_paths.append(join(datapath, label, f)) for f in listdir(join(datapath, label))]

        # images will contains face images
        for image_path in image_paths:
            # Read the image and convert to grayscale
            image_pil = Image.open(image_path).convert('L')
            # Convert the image format into numpy array
            image = np.array(image_pil, 'uint8')
            # Detect the face in the image
            faces = FACE_CLASSIFIER.detectMultiScale(image)
            # If face is detected, append the face to images and the label to labels
            for (x, y, w, h) in faces:
                images.append(image[y: y + h, x: x + w])
                labels.append(int(label))
    # return the images list and labels list
    return images, labels
# --------------------------------------------------------------------------------------------------

make_folder_if_not_exist(DATA_FOLDER)
make_folder_if_not_exist(MODEL_FOLDER)

images, labels = get_images_and_labels("data")

recognizer = cv2.face.LBPHFaceRecognizer_create()
if isfile(join(MODEL_FOLDER, 'train.yml')):
    recognizer.read(join(MODEL_FOLDER, 'train.yml'))
    recognizer.update(images, np.array(labels))
else:
    recognizer.train(images, np.array(labels))
recognizer.save(join(MODEL_FOLDER, 'train.yml'))

# rmtree(DATA_FOLDER)
