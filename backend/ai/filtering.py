from firebase import *
from ai.image_cutout import *
from ai.recognition import *
import cv2

#from deepface import DeepFace

def filter_images(familyName: str):
    users = get_uids(familyName)
    if users is None: return None
    users = {uid: role for uid, role in users.items() if role != 'admin'}
    
    userDetails = {}
    rules = {}
    # purpose of this is to map the original filenames with the "safe" version ones used for processing so they can actually be moved 
    # or maybe dont need this because we need to delete all files in the uploaded folder and upload the new ones to their respective places anyway?
    original_names = {} 
    for uid in users:
        user = get_user_details(uid)
        if user is None: continue 
        userDetails[uid] = user
        
        userRules = user.get("rules")
        if userRules is not None: rules[uid] = userRules

        original_names = download_images(uid)

    print(original_names)
    unsorted_images = []

    # so now we have the images downloaded into backend/photos/{uid}/uploaded and ../photos/{uid}/portrait
    # we can now filter the images based on the rules 
    for uid in users:
        for image in os.listdir(f'photos/{uid}/uploaded'): 
            image_path = f'photos/{uid}/uploaded/{image}'
            face_filenames = cut_faces_from_image_dnn(image_path, uid)
            if not face_filenames:
                unsorted_images.append(image_path)
                continue

            # portrait_filenames = [f'photos/{uid}/portrait/portrait.{ext}' for ext in ['jpg', 'jpeg', 'png', 'gif', 'bmp']]
            # matches = check_faces_against_portraits(face_filenames, portrait_filenames)
            # print(matches)
            # break
    print(unsorted_images)
    return None