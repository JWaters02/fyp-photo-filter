import firebase_admin
from firebase_admin import credentials, storage
from google.cloud import storage as gcs

cred = credentials.Certificate("creds.json")
firebase_admin.initialize_app(cred, {
    'storageBucket': 'photo-filter-7d89e.appspot.com'
})

