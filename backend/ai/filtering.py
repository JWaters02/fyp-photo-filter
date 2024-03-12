import time
import shutil
import os
from firebase import *
from ai.image_cutout import *
from ai.recognition import run_deepface
from ai.recognition_facenet import run_facenet

def apply_rules_and_sort_images(all_matches, rules, users, original_names):
    visible_images_for_user = {uid: [] for uid in users}
    visible_for_noone = []

    for face_filename, portrait_filename in all_matches.items():
        uploader_uid = face_filename.split('/')[1]
        subject_uid = portrait_filename.split('/')[1]

        # Default: image is visible to everyone except the uploader
        excluded_users = set()

        # Apply 'hideAllPhotosUploadedByMeFrom' rule
        uploader_rules = rules.get(uploader_uid, {})
        hide_all_from = uploader_rules.get('hideAllPhotosUploadedByMeFrom', {})
        excluded_users.update(hide_all_from.keys())

        # Apply 'hideMyPhotosContainingMeFrom' rule for the subject in the photo
        subject_rules = rules.get(subject_uid, {})
        hide_photos_containing_me_from = subject_rules.get('hideMyPhotosContainingMeFrom', {})
        excluded_users.update(hide_photos_containing_me_from.keys())

        # Determine the original image name from the face cutout path
        original_image_name = original_names[face_filename]

        # If the image is not visible to anyone, add it to the list of images that are not visible to anyone and continue to the next image
        if len(excluded_users) == len(users):
            visible_for_noone.append(original_image_name)
            continue

        # Add the image to the visible list for each user, excluding those specified by the rules
        for uid in users:
            if uid not in excluded_users:
                new_path = f'photos/{uid}/sorted/{original_image_name}'
                visible_images_for_user[uid].append(new_path)
                if not os.path.exists(new_path):
                    print(new_path)
                    # os.makedirs(new_path)
                # shutil.copy(face_filename, new_path)

    print(visible_images_for_user, visible_for_noone)
    return visible_images_for_user, visible_for_noone

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

    # now we have the matches, we can start to apply the rules to the images
    # the rules are used to determine who can see what images
    # a match is a dictionary of the form {face_filename: portrait_filename}
    # face_filename is the path to the face image, not the original image itself. however the original image itself's name is in the path
    # example:
    # {'photos/PnKqc9B3hjV5cxmhYztxCzARkdJ3/cutouts/IMG-20240224-WA0011/IMG-20240224-WA0011_1.jpg': 'photos/VYmXtICASbPnaNTAHswCeb9hk692/portrait/portrait.jpg', 'photos/PnKqc9B3hjV5cxmhYztxCzARkdJ3/cutouts/IMG-20240224-WA0011/IMG-20240224-WA0011_2.jpg': 'photos/PnKqc9B3hjV5cxmhYztxCzARkdJ3/portrait/portrait.jpg'}
    # example rules format:
    # rules: {
    # 'PnKqc9B3hjV5cxmhYztxCzARkdJ3': {'hideAllPhotosUploadedByMeFrom': {'yGIFu4hIFLUtGSTl3yHyxdC8inC2': 'Paul Waters'}, 'hideMyPhotosContainingMeFrom': {'VrDESpVst4Vw5NBfCWDnac053ze2': 'Ben Waters'}}
    # 'VYmXtICASbPnaNTAHswCeb9hk692': {'hideMyPhotosContainingMeFrom': {'cPVXNlJbTCT0VkcgXrCz0bvQQHC3': 'Bobby Waters'}}
    # }
    # remember we have the users dictionary which maps the uid to their name
    # so we can use this to figure out who is who in the rules
    # hideAllPhotosUploadedByMeFrom means that the user wants to hide all photos they uploaded from another user
    # hideMyPhotosContainingMeFrom means that the user wants to hide all photos containing them from another user
    # the rules are applied in the order they are listed in the rules dictionary
    # so if a user has both rules, the first rule will be applied first
    # once the rule has been applied, we know which users to NOT show the image to, so then we know all the uids that we can show the image to
    # so the path for the image can be moved to the appropriate folder for each user that can see the image
    # so let's say we're sorting the image photos/PnKqc9B3hjV5cxmhYztxCzARkdJ3/cutouts/IMG-20240224-WA0011.jpg (the original image from the two cutout matches from example above)
    # PnKqc9B3hjV5cxmhYztxCzARkdJ3 uploaded the image and they have the rule hideAllPhotosUploadedByMeFrom: yGIFu4hIFLUtGSTl3yHyxdC8inC2
    # so we know that we can't show the image to yGIFu4hIFLUtGSTl3yHyxdC8inC2
    # so we can show the image to all the other users
    # so now construct the list of new output paths, one for each user. the path will be photos/{uid}/sorted/{original_image_name}
    # then move the image to the new path
    visible_images, non_visible_images = apply_rules_and_sort_images(all_matches, rules, users, original_names)
    unsorted_images.extend(non_visible_images)

    # now we have the images sorted into the appropriate folders, we can upload them to firebase
    

    return None