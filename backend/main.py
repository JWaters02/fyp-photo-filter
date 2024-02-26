from fastapi import FastAPI
from pydantic import BaseModel
from ai.filtering import filter_images

app = FastAPI()

class SortData(BaseModel):
    uid: str
    familyName: str

@app.get("/")
def root():
    return {"message": "Hello World"}

@app.post("/api/sort")
def sort(data: SortData):
    return {"uid": data.uid, "familyName": data.familyName}