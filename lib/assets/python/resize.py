import cv2
from shutil import rmtree
from os import listdir, mkdir
from os.path import isdir, isfile, join

# 주요 파라메터
DATA_FOLDER = 'lib/assets/python/workspace/data'
TRAINING_FOLDER = 'lib/assets/python/workspace/users'
FACE_CLASSIFIER = cv2.CascadeClassifier('lib/assets/python/workspace/haarcascade_frontalface_default.xml')

# --------------------------------------------------------------------------------------------------
#전체 사진에서 얼굴 부위만 잘라 리턴
def face_extractor(img):
    #흑백처리
    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
    #얼굴 찾기
    faces = FACE_CLASSIFIER.detectMultiScale(gray, 1.3, 5)
    #찾은 얼굴이 없으면 None으로 리턴
    if faces is():
        return None
    #얼굴들이 있으면
    for(x,y,w,h) in faces:
        cropped_face = img[y:y+h, x:x+w]
    #cropped_face 리턴
    return cropped_face

# 없으면 만든다
def make_folder_if_not_exist(path):
    if not isdir(path):
        mkdir(path)
    return path
# --------------------------------------------------------------------------------------------------

make_folder_if_not_exist(DATA_FOLDER)
make_folder_if_not_exist(TRAINING_FOLDER)

# 1. 이미지 리스트
user_folders = [folder for folder in listdir(DATA_FOLDER) if isdir(join(DATA_FOLDER, folder))]

# 2. 얼굴 잘라내기
for folder in user_folders:
    folder_path = join(DATA_FOLDER, folder)
    files = [f for f in listdir(folder_path) if isfile(join(folder_path, f))]

    for i, img_file in enumerate(files):
        image_path = join(DATA_FOLDER, folder, img_file)
        image = cv2.imread(image_path)

        if face_extractor(image) is not None:
            #얼굴 이미지 크기를 200x200으로 조정
            face = cv2.resize(face_extractor(image), (200, 200))
            #조정된 이미지를 흑백으로 변환
            face = cv2.cvtColor(face, cv2.COLOR_BGR2GRAY)
            #faces폴더에 jpg파일로 저장
            file_name_path = make_folder_if_not_exist(join(TRAINING_FOLDER, folder))
            cv2.imwrite(join(file_name_path, f"{i}.jpg"), face)
        else:
            pass

rmtree(DATA_FOLDER)
