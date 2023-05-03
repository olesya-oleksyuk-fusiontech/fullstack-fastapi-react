import random
import shutil
import string

from fastapi import UploadFile, File, APIRouter

router = APIRouter(
    prefix='/upload',
    tags=['uploads']
)


@router.post("/img")
async def upload_image(image: UploadFile = File(...)):
    letters = string.ascii_letters
    rand_str = ''.join(random.choice(letters) for i in range(6))
    new = f'_{rand_str}.'
    filename = new.join(image.filename.rsplit('.', 1))
    path = f'images/{filename}'

    with open(path, "w+b") as buffer:
        shutil.copyfileobj(image.file, buffer)

    return {'filename': path}
