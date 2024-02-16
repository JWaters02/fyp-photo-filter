import cv2

# Load the image using OpenCV
image_path = r'ai/training-data/family-photo.png'
image = cv2.imread(image_path)
gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)

# Load the pre-trained face detection model from OpenCV
face_cascade = cv2.CascadeClassifier(cv2.data.haarcascades + 'haarcascade_frontalface_default.xml')

# Detect faces in the image
faces = face_cascade.detectMultiScale(gray, scaleFactor=1.1, minNeighbors=5, minSize=(30, 30))

# Use OpenCV to save each detected face with original colors
for i, (x, y, w, h) in enumerate(faces):
    face = image[y:y+h, x:x+w]
    face_filename = f'ai/image-cutout-output/face_{i+1}.jpg'
    cv2.imwrite(face_filename, face)

print(f'{len(faces)} faces detected and saved.')
