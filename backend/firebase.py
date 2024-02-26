import firebase_admin
from firebase_admin import credentials, storage, db
from google.cloud import storage as gcs
from google.cloud.storage.blob import Blob

cred = credentials.Certificate("creds.json")
firebase_admin.initialize_app(cred, {
    'storageBucket': 'photo-filter-7d89e.appspot.com'
})

# first we need to get all uids from the familyName from the realtime database
def get_uids(familyName: str):
    ref = db.reference(familyName)
    return ref.get()

# now we need to get all the user details for each uid (except where role is admin)
def get_user_details(uid: str):
    ref = db.reference(uid)
    users = ref.get(False, True)
    if users["role"] == "admin":
        return None
    return users

def get_user_rules(uid: str):
    ref = db.reference(uid).child("rules")
    return ref.get()

# next we need to download the images from the storage bucket, for each uid:
# at paths /photos/{uid}/uploaded/ and /photos/{uid}/portrait/portrait.* (can be any extension)
# store these in the backend at the same paths for processing
def download_images(uid: str):
    bucket = storage.bucket()
    
    # get all files in folder for uid
    blobs = bucket.list_blobs(prefix=f"photos/{uid}/uploaded/")
    for blob in blobs:
        blob.download_to_filename(f"photos/{uid}/uploaded/{blob.name}")

    # get portrait image extension
    portrait_blob = bucket.list_blobs(prefix=f"photos/{uid}/portrait/portrait.")
    for blob in portrait_blob:
        blob.download_to_filename(f"photos/{uid}/portrait/{blob.name}")







# if processing on an image is successful, move the image from uploaded to sorted
# if processing on an image is unsuccessful, move the image from uploaded to unsorted

# then, delete the temporary files in the backend photos/