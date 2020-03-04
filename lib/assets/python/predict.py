import cv2
from shutil import rmtree
from os import listdir
from os.path import join

# 주요 파라메터
base_dir = 'lib/assets/python'
MODEL_FOLDER = join(base_dir, 'model/train.yml')
DETECT_FOLDER = join(base_dir, 'detect')
FACE_CLASSIFIER = cv2.CascadeClassifier(join(base_dir, 'lib/haarcascade_frontalface_default.xml'))

recognizer = cv2.face.LBPHFaceRecognizer_create()
recognizer.read(MODEL_FOLDER)

image_paths = [join(DETECT_FOLDER, f)for f in listdir(DETECT_FOLDER) if f.startswith(".") == False]
for image_path in image_paths:
     im = cv2.imread(image_path)
     gray = cv2.cvtColor(im,cv2.COLOR_BGR2GRAY)
     faces = FACE_CLASSIFIER.detectMultiScale(gray, scaleFactor=1.2, minNeighbors=5, minSize=(100, 100), flags=cv2.CASCADE_SCALE_IMAGE)
     if len(faces) == 0:
          pass
     else:
          for(x,y,w,h) in faces:
               nbr_predicted, conf = recognizer.predict(gray[y:y+h,x:x+w])
               confidence = int(100*(1-(conf)/300))
               print([nbr_predicted, confidence])
          break
rmtree(DETECT_FOLDER)
