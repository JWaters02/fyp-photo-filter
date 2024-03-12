import os
import firebase_admin
from firebase_admin import credentials, storage, db
from google.cloud import storage as gcs
from google.cloud.storage.blob import Blob

cred = credentials.Certificate("creds.json")
firebase_admin.initialize_app(cred, {
    'storageBucket': 'photo-filter-7d89e.appspot.com',
    'databaseURL': "https://photo-filter-7d89e-default-rtdb.europe-west1.firebasedatabase.app"
})

# get all uids from the familyName from the realtime database
def get_uids(familyName: str):
    ref = db.reference(familyName)
    return ref.get()

# get all the user details for each uid (except where role is admin)
def get_user_details(uid: str):
    ref = db.reference(uid)
    user = ref.get()
    if user["role"] == "admin":
        return None
    return user

# download the images from the storage bucket, for each uid:
# at paths /photos/{uid}/uploaded/ and /photos/{uid}/portrait/portrait.* (can be any extension)
# store these in the backend at the same paths for processing
def download_images(uid: str):
    bucket = storage.bucket()
    
    # create dirs
    os.makedirs(f"photos/{uid}/uploaded", exist_ok=True)
    os.makedirs(f"photos/{uid}/portrait", exist_ok=True)
    
    # get all files in folder for uid
    blobs = bucket.list_blobs(prefix=f"photos/{uid}/uploaded/")
    for blob in blobs:
        filename = blob.name.split('/')[-1]
        name, extension = os.path.splitext(filename)
        safe_name = name.replace(' ', '-').replace('.', '-') + extension
        local_file_path = f"photos/{uid}/uploaded/{safe_name}"
        
        if not os.path.exists(local_file_path):
            blob.download_to_filename(local_file_path)

    # get portrait image extension
    portrait_blob = bucket.list_blobs(prefix=f"photos/{uid}/portrait/")
    for blob in portrait_blob:
        if os.path.exists(f"photos/{uid}/portrait/{blob.name.split('/')[-1]}"): continue
        blob.download_to_filename(f"{blob.name}")

def upload_photos(uid: str, photo_paths: list, type: str):
    bucket = storage.bucket()
    for photo in photo_paths:
        blob = bucket.blob(f"photos/{uid}/{type}/{photo.split('/')[-1]}")
        blob.upload_from_filename(photo)

def delete_photos(uid: str, type: str):
    bucket = storage.bucket()
    blobs = bucket.list_blobs(prefix=f"photos/{uid}/{type}/")
    for blob in blobs:
        blob.delete()