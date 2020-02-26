import cv2
import numpy as np
from sys import argv, exit
from os import listdir, mkdir
from os.path import isdir, isfile, join

# 주요 파라메터
MODEL_FOLDER = 'lib/assets/python/model'
FACE_CLASSIFIER = cv2.CascadeClassifier('lib/assets/python/lib/haarcascade_frontalface_default.xml')
# --------------------------------------------------------------------------------------------------
def face_extractor(img):
    #흑백처리
    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
    #얼굴 찾기
    faces = FACE_CLASSIFIER.detectMultiScale(gray, 1.3, 5)
    #찾은 얼굴이 없으면 프로그램 종료
    if faces is():
        print("No Face")
        exit()
    #얼굴들이 있으면
    for(x,y,w,h) in faces:
        cropped_face = img[y:y+h, x:x+w]
    #cropped_face 리턴
    return cropped_face
# --------------------------------------------------------------------------------------------------

# 1. 이미지 불러오기
test_img = cv2.imread(argv[1])
face = cv2.resize(face_extractor(test_img),(200,200))
face = cv2.cvtColor(face, cv2.COLOR_BGR2GRAY)

# 2. 이미지 체크
result = []
model = cv2.face.LBPHFaceRecognizer_create()
model_files = [f for f in listdir(MODEL_FOLDER) if isfile(join(MODEL_FOLDER, f))]

for model_file in model_files:
    model.read(join(MODEL_FOLDER, model_file))
    predict = model.predict(face)
    confidence = int(100*(1-(predict[1])/300))
    user_id = model_file.split(".")[0]
    result.append(f"{user_id} {confidence}")
    if confidence == 100:
        break

print(result)
