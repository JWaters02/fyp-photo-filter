import time
import shutil
import os
from collections import defaultdict
from firebase import *
from ai.image_cutout import *
from ai.recognition import run_deepface
from ai.recognition_facenet import run_facenet

def filter_images(familyName: str):
    all_users = get_uids(familyName)
    if all_users is None: return None
    users = {uid: role for uid, role in all_users.items() if role != 'admin'}
    
    userDetails = {}
    rules = {}
    portrait_filenames = []
    for uid in users:
        user = get_user_details(uid)
        if user is None: continue 
        userDetails[uid] = user
        
        userRules = user.get("rules")
        if userRules is not None: rules[uid] = userRules

        download_images(uid)

        # TODO: Improve this so that it can handle multiple extensions
        # for ext in ['jpg', 'jpeg', 'png', 'gif', 'bmp']
        portrait_filenames.append(f'photos/{uid}/portrait/portrait.jpg')
        for portrait in portrait_filenames:
            if not os.path.exists(portrait):
                portrait_filenames.remove(portrait)
    
    # run the facial recognition on the images to figure out who is who
    unsorted_images = []
    all_matches = {}
    total_images = 0
    deepface_success_counter = 0
    start_time = time.time()
    for uid in users:
        print(f"Processing images for {uid}")
        for image in os.listdir(f'photos/{uid}/uploaded'): 
            total_images += 1
            image_path = f'photos/{uid}/uploaded/{image}'
            print(f"Processing image {image_path}")
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
    # print(unsorted_images)
    # print(all_matches)
    print(f"Total images: {total_images}")
    print(f"DeepFace success: {deepface_success_counter}")

    # TEMP
    # all_matches = {'photos/PnKqc9B3hjV5cxmhYztxCzARkdJ3/cutouts/IMG-20240224-WA0011/IMG-20240224-WA0011_1.jpg': 'photos/VYmXtICASbPnaNTAHswCeb9hk692/portrait/portrait.jpg', 'photos/PnKqc9B3hjV5cxmhYztxCzARkdJ3/cutouts/IMG-20240224-WA0011/IMG-20240224-WA0011_2.jpg': 'photos/PnKqc9B3hjV5cxmhYztxCzARkdJ3/portrait/portrait.jpg', 'photos/PnKqc9B3hjV5cxmhYztxCzARkdJ3/cutouts/IMG-20240224-WA0014/IMG-20240224-WA0014_1.jpg': 'photos/PnKqc9B3hjV5cxmhYztxCzARkdJ3/portrait/portrait.jpg', 'photos/PnKqc9B3hjV5cxmhYztxCzARkdJ3/cutouts/IMG-20240224-WA0016/IMG-20240224-WA0016_1.jpg': 'photos/VrDESpVst4Vw5NBfCWDnac053ze2/portrait/portrait.jpg', 'photos/PnKqc9B3hjV5cxmhYztxCzARkdJ3/cutouts/IMG-20240224-WA0017/IMG-20240224-WA0017_1.jpg': 'photos/VYmXtICASbPnaNTAHswCeb9hk692/portrait/portrait.jpg', 'photos/PnKqc9B3hjV5cxmhYztxCzARkdJ3/cutouts/IMG-20240224-WA0017/IMG-20240224-WA0017_2.jpg': 'photos/cPVXNlJbTCT0VkcgXrCz0bvQQHC3/portrait/portrait.jpg', 'photos/PnKqc9B3hjV5cxmhYztxCzARkdJ3/cutouts/IMG-20240224-WA0018/IMG-20240224-WA0018_1.jpg': 'photos/PnKqc9B3hjV5cxmhYztxCzARkdJ3/portrait/portrait.jpg', 'photos/PnKqc9B3hjV5cxmhYztxCzARkdJ3/cutouts/IMG-20240224-WA0018/IMG-20240224-WA0018_2.jpg': 'photos/VYmXtICASbPnaNTAHswCeb9hk692/portrait/portrait.jpg', 'photos/PnKqc9B3hjV5cxmhYztxCzARkdJ3/cutouts/IMG-20240224-WA0019/IMG-20240224-WA0019_1.jpg': 'photos/VrDESpVst4Vw5NBfCWDnac053ze2/portrait/portrait.jpg', 'photos/PnKqc9B3hjV5cxmhYztxCzARkdJ3/cutouts/IMG-20240224-WA0019/IMG-20240224-WA0019_2.jpg': 'photos/VYmXtICASbPnaNTAHswCeb9hk692/portrait/portrait.jpg', 'photos/PnKqc9B3hjV5cxmhYztxCzARkdJ3/cutouts/IMG-20240224-WA0019/IMG-20240224-WA0019_3.jpg': 'photos/PnKqc9B3hjV5cxmhYztxCzARkdJ3/portrait/portrait.jpg', 'photos/PnKqc9B3hjV5cxmhYztxCzARkdJ3/cutouts/IMG-20240224-WA0020/IMG-20240224-WA0020_1.jpg': 'photos/VYmXtICASbPnaNTAHswCeb9hk692/portrait/portrait.jpg', 'photos/PnKqc9B3hjV5cxmhYztxCzARkdJ3/cutouts/IMG-20240224-WA0023/IMG-20240224-WA0023_1.jpg': 'photos/VrDESpVst4Vw5NBfCWDnac053ze2/portrait/portrait.jpg', 'photos/PnKqc9B3hjV5cxmhYztxCzARkdJ3/cutouts/IMG-20240224-WA0024/IMG-20240224-WA0024_1.jpg': 'photos/VYmXtICASbPnaNTAHswCeb9hk692/portrait/portrait.jpg', 'photos/PnKqc9B3hjV5cxmhYztxCzARkdJ3/cutouts/IMG-20240224-WA0025/IMG-20240224-WA0025_1.jpg': 'photos/VrDESpVst4Vw5NBfCWDnac053ze2/portrait/portrait.jpg', 'photos/PnKqc9B3hjV5cxmhYztxCzARkdJ3/cutouts/IMG-20240224-WA0026/IMG-20240224-WA0026_1.jpg': 'photos/cPVXNlJbTCT0VkcgXrCz0bvQQHC3/portrait/portrait.jpg', 'photos/PnKqc9B3hjV5cxmhYztxCzARkdJ3/cutouts/IMG-20240224-WA0028/IMG-20240224-WA0028_1.jpg': 'photos/VYmXtICASbPnaNTAHswCeb9hk692/portrait/portrait.jpg', 'photos/PnKqc9B3hjV5cxmhYztxCzARkdJ3/cutouts/IMG-20240224-WA0030/IMG-20240224-WA0030_1.jpg': 'photos/VYmXtICASbPnaNTAHswCeb9hk692/portrait/portrait.jpg', 'photos/PnKqc9B3hjV5cxmhYztxCzARkdJ3/cutouts/IMG-20240224-WA0031/IMG-20240224-WA0031_1.jpg': 'photos/VYmXtICASbPnaNTAHswCeb9hk692/portrait/portrait.jpg', 'photos/PnKqc9B3hjV5cxmhYztxCzARkdJ3/cutouts/IMG-20240224-WA0031/IMG-20240224-WA0031_2.jpg': 'photos/VrDESpVst4Vw5NBfCWDnac053ze2/portrait/portrait.jpg'}

    # now we have the matches, we can apply the rules to the images
    all_paths_to_upload, non_visible_images = apply_rules_and_sort_images(all_matches, rules, users)
    unsorted_images.extend(non_visible_images)

    # put unsorted_images into unsorted folders for each user
    unsorted_paths = {uid: [] for uid in users}
    for image in unsorted_images:
        uploader_uid = image.split('/')[1]
        new_path = f'photos/{uploader_uid}/unsorted/{image.split("/")[-1]}'
        if not os.path.exists(new_path):
            os.makedirs(new_path)
        shutil.copy(image, new_path)
        unsorted_paths[uploader_uid].append(new_path)
    
    # if unsorted_paths is not empty, add it to all_paths_to_upload
    for uid, paths in unsorted_paths.items():
        all_paths_to_upload[uid].extend(paths)

    # now we have the images sorted into the appropriate folders, we can upload them to firebase
    for uid, paths in all_paths_to_upload.items():
        upload_photos(uid, paths)

    # delete the entire photos folder local to this machine
    # for uid in users:
    #     if os.path.exists(f'photos/{uid}'):
    #         shutil.rmtree(f'photos/{uid}')

    # # delete the photos from the storage bucket
    # for uid in users:
    #     delete_photos(uid)

    return None

def apply_rules_and_sort_images(all_matches, rules, users):
    visible_images_for_user = {uid: [] for uid in users}
    visible_for_noone = []

    # Use collect_excluded_users function to get a mapping of original images to excluded users
    excluded_users_per_original = collect_excluded_users(all_matches, rules)

    # Now apply the collected rules
    for original_image_path, excluded_users in excluded_users_per_original.items():
        # Determine the name of the original image
        uploader_uid = original_image_path.split('/')[1]
        original_image_name = original_image_path.split('/')[-1]

        # Check if no one can see the image
        if len(excluded_users) == len(users):
            visible_for_noone.append(original_image_path)
            continue

        # Construct the path to the full original image
        full_original_image_path = f'photos/{uploader_uid}/uploaded/{original_image_name}'

        # Add the image to the visible list for each user, excluding those specified by the rules
        for uid in users:
            if uid not in excluded_users:
                new_path = f'photos/{uid}/sorted/{original_image_name}'
                visible_images_for_user[uid].append(new_path)
                
                destination_dir = os.path.dirname(new_path)
                if not os.path.exists(destination_dir):
                    os.makedirs(destination_dir)
                
                # Copy the image to the new path for the user
                shutil.copy(full_original_image_path, new_path)

    return visible_images_for_user, visible_for_noone

def collect_excluded_users(all_matches, rules):
    # Group face cutouts by the original image path
    original_to_cutouts = defaultdict(list)
    for face, _ in all_matches.items():
        ext = face.split('.')[-1]
        # TODO: There might be an edge case here if the cutout image has _10 or more in the name
        original_image_path = f'photos/{face.split("/")[1]}/uploaded/{face.split("/")[-2]}.{ext}'
        original_to_cutouts[original_image_path].append(face)

    # Collect excluded users for each original image
    excluded_users_per_original = {original: set() for original in original_to_cutouts.keys()}
    
    for original, cutouts in original_to_cutouts.items():
        for face in cutouts:
            uploader_uid = face.split('/')[1]
            uploader_rules = rules.get(uploader_uid, {})

            # First add the uploader to the excluded users
            excluded_users_per_original[original].add(uploader_uid)
            
            # Add users excluded by uploader's 'hideAllPhotosUploadedByMeFrom' rule
            excluded_by_uploader = uploader_rules.get('hideAllPhotosUploadedByMeFrom', {}).keys()
            excluded_users_per_original[original].update(excluded_by_uploader)
            
            # Add users excluded by subject's 'hideMyPhotosContainingMeFrom' rule
            subject_uid = all_matches[face].split('/')[1]
            subject_rules = rules.get(subject_uid, {})
            excluded_by_subject = subject_rules.get('hideMyPhotosContainingMeFrom', {}).keys()
            excluded_users_per_original[original].update(excluded_by_subject)

    return excluded_users_per_original