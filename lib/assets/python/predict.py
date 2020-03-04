import cv2
import numpy as np
from sys import argv, exit
from os import listdir, mkdir
from os.path import isdir, isfile, join

# 주요 파라메터
base_dir = 'lib/assets/python'
MODEL_FOLDER = join(base_dir, 'model/train.yml')
FACE_CLASSIFIER = cv2.CascadeClassifier(join(base_dir, 'lib/haarcascade_frontalface_default.xml'))

recognizer = cv2.face.LBPHFaceRecognizer_create()
recognizer.read(MODEL_FOLDER)

im = cv2.imread(argv[1])
gray = cv2.cvtColor(im,cv2.COLOR_BGR2GRAY)
faces = FACE_CLASSIFIER.detectMultiScale(gray, scaleFactor=1.2, minNeighbors=5, minSize=(100, 100), flags=cv2.CASCADE_SCALE_IMAGE)
for(x,y,w,h) in faces:
     nbr_predicted, conf = recognizer.predict(gray[y:y+h,x:x+w])
     confidence = int(100*(1-(conf)/300))
     print([nbr_predicted, confidence])
