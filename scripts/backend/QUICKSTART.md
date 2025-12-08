# 🚀 Хурдан эхлэл - Face Matching API

## 1️⃣ Суулгалт (5 минут)

```bash
# Backend folder руу очих
cd scripts/backend

# Virtual environment үүсгэх
python3 -m venv .venv

# Идэвхжүүлэх
source .venv/bin/activate  # Windows: .venv\Scripts\activate

# Dependencies суулгах
pip install -r requirements.txt
```

### ⚠️ macOS дээр dlib алдаа гарвал:
```bash
brew install cmake
pip install dlib
pip install face-recognition
```

## 2️⃣ API ажиллуулах (1 минут)

### Арга 1: Start script ашиглах (хялбар)
```bash
./start.sh
```

### Арга 2: Шууд ажиллуулах
```bash
uvicorn app.main:app --reload --port 8000
```

✅ Ажиллаж эхэлсэн!
- API: http://localhost:8000
- Docs: http://localhost:8000/docs

## 3️⃣ Турших

### Арга 1: Swagger UI ашиглах
1. http://localhost:8000/docs хаяг руу орох
2. `/api/face-match` endpoint дээр дарах
3. "Try it out" дарах
4. Зургуудаа upload хийх
5. "Execute" дарах

### Арга 2: Test script ашиглах
```bash
python test_api.py id_card.jpg face_photo.jpg
```

### Арга 3: cURL ашиглах
```bash
curl -X POST "http://localhost:8000/api/face-match" \
  -F "id_card=@id_card.jpg" \
  -F "face_photo=@face_photo.jpg" \
  -F "tolerance=0.6"
```

### Арга 4: Python code
```python
import requests

files = {
    'id_card': open('id_card.jpg', 'rb'),
    'face_photo': open('face_photo.jpg', 'rb')
}

response = requests.post(
    'http://localhost:8000/api/face-match',
    files=files
)

print(response.json())
```

### Арга 5: JavaScript/TypeScript
```typescript
const formData = new FormData();
formData.append('id_card', idCardFile);
formData.append('face_photo', facePhotoFile);

const response = await fetch('http://localhost:8000/api/face-match', {
  method: 'POST',
  body: formData
});

const result = await response.json();
console.log('Match:', result.match_percentage + '%');
```

## 📊 Хариу жишээ

### Таарсан үед:
```json
{
  "success": true,
  "is_match": true,
  "match_percentage": 87.45,
  "face_distance": 0.1255,
  "tolerance": 0.6,
  "message": "Нүүрүүд таарч байна!"
}
```

### Таараагүй үед:
```json
{
  "success": true,
  "is_match": false,
  "match_percentage": 42.30,
  "face_distance": 0.5770,
  "tolerance": 0.6,
  "message": "Нүүрүүд таарахгүй байна!"
}
```

## 🎯 Tolerance тохиргоо

- `0.4` - Маш хатуу (99% итгэлтэй байх)
- `0.6` - Стандарт (зөвлөмж)
- `0.8` - Зөөлөн (илүү олон match)

## ❗ Түгээмэл алдаанууд

### 1. "Import face_recognition could not be resolved"
```bash
# Virtual environment идэвхжүүлсэн эсэхийг шалгах
source .venv/bin/activate

# Дахин суулгах
pip install face-recognition
```

### 2. "Connection refused"
```bash
# API ажиллаж байгаа эсэхийг шалгах
curl http://localhost:8000/health
```

### 3. "No face detected"
- Зураг тодорхой байгаа эсэхийг шалгах
- Нүүр харагдаж байгаа эсэхийг шалгах
- Зургийн format зөв эсэхийг шалгах (jpg, png)

## 🛑 Зогсоох

API-г зогсоох: `Ctrl + C`

## 📚 Дэлгэрэнгүй

Дэлгэрэнгүй мэдээлэл: [README.md](README.md)
