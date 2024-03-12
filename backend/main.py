from fastapi import FastAPI
from pydantic import BaseModel
from ai.filtering import filter_images
from firebase import get_uids, delete_photos
import time

app = FastAPI()

class SortData(BaseModel):
    uid: str
    familyName: str

@app.get("/")
def root():
    return {"message": "Hello World"}

@app.post("/api/sort")
def sort(data: SortData):
    start_time = time.time()
    filter_images(data.familyName)
    print("--- %s seconds ---" % (time.time() - start_time))
    return {"uid": data.uid, "familyName": data.familyName}

@app.get("/api/delete")
def delete():
    uids = get_uids("Waters2172")
    for uid in uids:
        delete_photos(uid, "sorted")
        delete_photos(uid, "unsorted")
    return {"message": "Delete"}