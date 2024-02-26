from firebase import *
from ai.image_cutout import *
from ai.recognition import *
import cv2

#from deepface import DeepFace

def filter_images(familyName: str):
    users = get_uids(familyName)
    if users is None: return None
    users = {uid: role for uid, role in users.items() if role != 'admin'}
    print(users)
    
    userDetails = {}
    rules = {}
    for uid in users:
        user = get_user_details(uid)
        if user is None: continue 
        userDetails[uid] = user
        
        userRules = user.get("rules")
        if userRules is not None: rules[uid] = userRules

        download_images(uid)

    unsorted_images = []

    # so now we have the images downloaded into backend/photos/{uid}/uploaded and ../photos/{uid}/portrait
    # we can now filter the images based on the rules 
    for uid in users:
        for image in os.listdir(f'photos/{uid}/uploaded'):
            image_path = f'photos/{uid}/uploaded/{image}'
            face_filenames = cut_faces_from_image_dnn(image_path, uid)
            if face_filenames is None: 
                unsorted_images.append(image)
                continue

            # portrait_filenames = [f'photos/{uid}/portrait/portrait.{ext}' for ext in ['jpg', 'jpeg', 'png', 'gif', 'bmp']]
            # matches = check_faces_against_portraits(face_filenames, portrait_filenames)
            # print(matches)
            # break
    
    return None