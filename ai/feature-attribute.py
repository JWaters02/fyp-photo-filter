# https://github.com/serengil/deepface

from deepface import DeepFace

# img = r"ai/training-data/face_2.jpg"
# demography = DeepFace.analyze(img)

# print(demography)

metrics = ["cosine", "euclidean", "euclidean_l2"]

#face verification
result = DeepFace.verify(img1_path = r"ai/image-cutout-output/face_2.jpg", 
        img2_path = r"ai/image-cutout-output/face_7.jpg", 
        distance_metric = metrics[2],
        enforce_detection=False
)

print(result)