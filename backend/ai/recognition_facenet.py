import torch
from facenet_pytorch import MTCNN, InceptionResnetV1
from PIL import Image

def run_facenet(face_filenames, portrait_filenames):
    mtcnn = MTCNN(image_size=160, margin=0, keep_all=True)
    resnet = InceptionResnetV1(pretrained='vggface2').eval()

    matches = check_faces_against_portraits(face_filenames, portrait_filenames, mtcnn, resnet)
    failures = [face for face in face_filenames if face not in matches]
    return matches, failures

def check_faces_against_portraits(face_filenames, portrait_filenames, mtcnn, resnet, threshold=1.0):
    matches = {}
    for face in face_filenames:
        face_embedding = get_embedding(face, mtcnn, resnet)
        for portrait in portrait_filenames:
            portrait_embedding = get_embedding(portrait, mtcnn, resnet)
            if face_embedding is None or portrait_embedding is None:
                continue
            dist = torch.dist(face_embedding, portrait_embedding, 2).item()
            if dist < threshold:
                matches[face] = portrait
                break
    return matches

def get_embedding(image_path, mtcnn, resnet):
    img = Image.open(image_path)
    img_cropped_list = mtcnn(img)
    if img_cropped_list is not None:
        img_cropped = img_cropped_list[0]
        if img_cropped.dim() == 3:
            img_cropped = img_cropped.unsqueeze(0)  # Shape: [1, channels, height, width]
        if img_cropped.shape[1] == 1:
            img_cropped = img_cropped.repeat(1, 3, 1, 1)
        if img_cropped.shape[2] == 3:
            img_cropped = img_cropped.permute(0, 2, 1, 3) 
        embedding = resnet(img_cropped)
        return embedding.squeeze()
    return None

if __name__ == "__main__":
    face_filenames = ["backend\photos\PnKqc9B3hjV5cxmhYztxCzARkdJ3\cutouts\IMG-20240224-WA0018\IMG-20240224-WA0018_1.jpg", "backend\photos\PnKqc9B3hjV5cxmhYztxCzARkdJ3\cutouts\IMG-20240224-WA0018\IMG-20240224-WA0018_2.jpg"]
    portrait_filenames = ["backend\photos\PnKqc9B3hjV5cxmhYztxCzARkdJ3\portrait\portrait.jpg", "backend\photos\VYmXtICASbPnaNTAHswCeb9hk692\portrait\portrait.jpg"]
    print(run_facenet(face_filenames, portrait_filenames))
