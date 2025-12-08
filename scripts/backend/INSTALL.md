# 🔧 Суулгалтын заавар

## Асуудал: onnxruntime Python 3.13-тай тохирохгүй

Хэрэв `onnxruntime==1.18.1` суулгахад алдаа гарвал:

### Шийдэл 1: Python 3.11 эсвэл 3.12 ашиглах (зөвлөмж)

```bash
# Python 3.12 ашиглан virtual environment үүсгэх
python3.12 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
```

### Шийдэл 2: insightface-г суулгахгүй байх

`requirements.txt` файл дахь insightface болон onnxruntime-ийг comment хийсэн байна:

```txt
# insightface==0.7.3
# onnxruntime>=1.20.0
```

Энэ тохиолдолд face_recognition сан л ашиглагдана (энэ нь хангалттай).

## Хурдан суулгалт

```bash
cd scripts/backend

# Virtual environment үүсгэх
python3 -m venv .venv
source .venv/bin/activate

# Dependencies суулгах
pip install -r requirements.txt

# API эхлүүлэх
uvicorn app.main:app --reload --port 8000
```

## macOS дээр dlib алдаа гарвал

```bash
# CMake суулгах
brew install cmake

# dlib суулгах
pip install dlib

# face-recognition суулгах
pip install face-recognition

# Бусад dependencies
pip install -r requirements.txt
```

## Амжилттай суусан эсэхийг шалгах

```bash
python -c "import face_recognition; print('✅ face_recognition ажиллаж байна')"
python -c "import fastapi; print('✅ FastAPI ажиллаж байна')"
```

## API ажиллуулах

```bash
# Арга 1
./start.sh

# Арга 2
uvicorn app.main:app --reload --port 8000
```

Амжилттай ажиллавал:
```
INFO:     Uvicorn running on http://127.0.0.1:8000
INFO:     Application startup complete.
```

Дараа нь: http://localhost:8000/docs
