#from deepface import DeepFace

def check_faces_against_portraits(face_filenames: str, portrait_filenames: str):
    metrics = ["cosine", "euclidean", "euclidean_l2"]

    results = []
    matches = {}
    for face in face_filenames:
        for portrait in portrait_filenames:
            result = 2 #DeepFace.verify(img1_path = face, 
            #     img2_path = portrait, 
            #     distance_metric = metrics[2],
            #     enforce_detection = False
            # )
            results.append(result)
            if result['verified']:
                matches[face] = portrait
                continue
    return matches