import os
import cv2

def cut_faces_from_image(image_path: str, uid: str):
    # Load the image using OpenCV
    image = cv2.imread(image_path)
    gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)

    # Load the pre-trained face detection model from OpenCV
    face_cascade = cv2.CascadeClassifier(cv2.data.haarcascades + 'haarcascade_frontalface_default.xml')

    # Detect faces in the image
    faces = face_cascade.detectMultiScale(gray, scaleFactor=1.5, minNeighbors=5, minSize=(30, 30))

    # Use OpenCV to save each detected face with original colors
    image_name = image_path.split('/')[-1]
    image_extension = image_name.split('.')[-1]
    image_name_without_extension = image_name.split('.')[0]
    output_path = f'photos/' + uid + '/cutouts/' + image_name_without_extension + '/'
    if not os.path.exists(output_path): os.makedirs(output_path)
    
    face_filenames = []
    for i, (x, y, w, h) in enumerate(faces):
        face = image[y:y+h, x:x+w]
        face_filename = output_path + image_name_without_extension + f'_{i+1}.' + image_extension
        print(face_filename)
        face_filenames.append(face_filename)
        cv2.imwrite(face_filename, face)

    print(f'{len(faces)} faces detected and saved.')
    print(face_filenames)
    return face_filenames

def cut_faces_from_image_dnn(image_path: str, uid: str):
    # Load the image
    image = cv2.imread(image_path)
    h, w = image.shape[:2]

    # Load the DNN model
    modelFile = "ai/models/opencv_face_detector_uint8.pb"
    configFile = "ai/models/opencv_face_detector.pbtxt"
    net = cv2.dnn.readNetFromTensorflow(modelFile, configFile)

    # Prepare the image as a blob and set the input to the network
    blob = cv2.dnn.blobFromImage(image, 1.0, (300, 300), [104, 117, 123], True, False)
    net.setInput(blob)

    # Run the detection
    detections = net.forward()

    # Prepare the output path
    image_name = image_path.split('/')[-1]
    image_extension = image_name.split('.')[-1]
    image_name_without_extension = image_name.split('.')[0]
    output_path = f'photos/{uid}/cutouts/{image_name_without_extension}/'
    if not os.path.exists(output_path):
        os.makedirs(output_path)

    face_filenames = []
    for i in range(detections.shape[2]):
        confidence = detections[0, 0, i, 2]
        if confidence > 0.7:  # Confidence threshold
            x1 = int(detections[0, 0, i, 3] * w)
            y1 = int(detections[0, 0, i, 4] * h)
            x2 = int(detections[0, 0, i, 5] * w)
            y2 = int(detections[0, 0, i, 6] * h)
            face = image[y1:y2, x1:x2]
            face_filename = f"{output_path}{image_name_without_extension}_{i+1}.{image_extension}"
            print(face_filename)
            cv2.imwrite(face_filename, face)
            face_filenames.append(face_filename)

    print(f'{len(face_filenames)} faces detected and saved.')
    print(face_filenames)
    return face_filenames
