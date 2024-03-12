from firebase import *
from ai.image_cutout import *
from ai.recognition import run_deepface
from ai.recognition_facenet import run_facenet
import time

def filter_images(familyName: str):
    users = get_uids(familyName)
    if users is None: return None
    users = {uid: role for uid, role in users.items() if role != 'admin'}
    
    userDetails = {}
    rules = {}
    portrait_filenames = []
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

        # TODO: Improve this so that it can handle multiple extensions
        # for ext in ['jpg', 'jpeg', 'png', 'gif', 'bmp']
        portrait_filenames.append(f'photos/{uid}/portrait/portrait.jpg')
        for portrait in portrait_filenames:
            if not os.path.exists(portrait):
                portrait_filenames.remove(portrait)

    # print(original_names)
    start_time = time.time()

    # so now we have the images downloaded into backend/photos/{uid}/uploaded and ../photos/{uid}/portrait
    # we can now run the facial recognition on the images to figure out who is who
    unsorted_images = []
    all_matches = {}
    deepface_success_counter = 0
    i = 0
    for uid in users:
        if i == 1: break
        i += 1
        for image in os.listdir(f'photos/{uid}/uploaded'): 
            image_path = f'photos/{uid}/uploaded/{image}'
            face_filenames = cut_faces_from_image_dnn(image_path, uid)
            if not face_filenames:
                unsorted_images.append(image_path)
                continue

            # print(face_filenames, portrait_filenames)
            # now run facial attribute analysis to figure out who is who
            matches, failures = run_facenet(face_filenames, portrait_filenames)
            if len(failures) > 0:
                # run the backup method on the failures
                new_matches, failures = run_deepface(failures, portrait_filenames)
                for face, portrait in new_matches.items():
                    if face not in matches:
                        matches[face] = portrait
                        deepface_success_counter += 1

                if len(failures) > 0:
                    for failure in failures:
                        unsorted_images.append(failure)
                    continue

            all_matches.update(matches)
    
    end_time = time.time()
    print(f"Time taken: {end_time - start_time}")
    print(unsorted_images)
    print(all_matches)
    print(deepface_success_counter)
    return None