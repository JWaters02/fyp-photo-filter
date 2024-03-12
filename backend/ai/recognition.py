import os
from deepface import DeepFace

def run_deepface(face_filenames, portrait_filenames):
    metrics = ["euclidean_l2"]
    matches = check_faces_against_portraits(face_filenames, portrait_filenames, metrics)
    failures = [face for face in face_filenames if face not in matches]
    return matches, failures

def check_faces_against_portraits(face_filenames, portrait_filenames, metrics, r=0):
    results = []
    matches = {}
    failures = []
    for face in face_filenames:
        for portrait in portrait_filenames:
            result = DeepFace.verify(img1_path = face, 
                img2_path = portrait, 
                distance_metric = metrics[r],
                enforce_detection = False
            )
            results.append(result)
            if result['verified']:
                matches[face] = portrait
                if face in failures: failures.remove(face)
                continue
            else:
                if not face in failures: failures.append(face)
                continue  
    r += 1

    # if there are still failures, try again with a different distance metric
    if len(failures) > 0 and r < len(metrics):
        print(f"Retrying with distance metric {metrics[r]}")
        new_matches = check_faces_against_portraits(failures, portrait_filenames, metrics, r)
        for face, portrait in new_matches.items():
            if face not in matches:
                matches[face] = portrait
    else:
        return matches
    return matches

if __name__ == "__main__":
    face_filenames = ["backend\photos\PnKqc9B3hjV5cxmhYztxCzARkdJ3\cutouts\IMG-20240224-WA0018\IMG-20240224-WA0018_1.jpg", "backend\photos\PnKqc9B3hjV5cxmhYztxCzARkdJ3\cutouts\IMG-20240224-WA0018\IMG-20240224-WA0018_2.jpg"]
    portrait_filenames = ["backend\photos\PnKqc9B3hjV5cxmhYztxCzARkdJ3\portrait\portrait.jpg", "backend\photos\VYmXtICASbPnaNTAHswCeb9hk692\portrait\portrait.jpg"]
    print(run_deepface(face_filenames, portrait_filenames))