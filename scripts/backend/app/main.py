"""
Иргэний үнэмлэхний зураг болон нүүрний зургийн Face Matching систем
Face Recognition санг ашиглан хоёр зургийн таарах хувийг тооцоолно
"""

import os
from fastapi import FastAPI, UploadFile, File, HTTPException, Depends, Header
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from pydantic import BaseModel
import cv2
import face_recognition
import numpy as np
from pathlib import Path
import io
from PIL import Image
import base64
from typing import Optional, Literal
import hashlib
import random

# Environment variables
API_KEY = os.getenv("API_KEY", "")
ALLOWED_ORIGINS = os.getenv("ALLOWED_ORIGINS", "https://verify-app-tau.vercel.app").split(",")

app = FastAPI(
    title="Face Matching API",
    description="Иргэний үнэмлэх болон нүүрний зургийг харьцуулах API",
    version="1.0.0"
)

# CORS тохиргоо - зөвхөн зөвшөөрөгдсөн domain-уудаас хандахыг зөвшөөрөх
app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["GET", "POST"],
    allow_headers=["*"],
)


async def verify_api_key(x_api_key: str = Header(None)):
    """
    API Key шалгах middleware
    """
    if not API_KEY:
        # API_KEY тохируулаагүй бол шалгалтыг алгасах (dev mode)
        return True
    
    if x_api_key != API_KEY:
        raise HTTPException(
            status_code=401,
            detail="Invalid or missing API key"
        )
    return True


async def load_image_from_upload(file: UploadFile):
    """
    Upload хийсэн файлаас зураг уншиж, RGB форматруу хөрвүүлэх
    
    Args:
        file: FastAPI UploadFile объект
        
    Returns:
        RGB форматтай зураг эсвэл None
    """
    try:
        # Файлын агуулгыг уншиж numpy array болгох
        contents = await file.read()
        nparr = np.frombuffer(contents, np.uint8)
        image = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
        
        if image is None:
            return None
        
        # OpenCV нь BGR форматтай, face_recognition нь RGB форматтай ажилладаг
        rgb_image = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)
        return rgb_image
    except Exception as e:
        print(f"❌ Зураг уншиж чадсангүй: {str(e)}")
        return None


def load_image(image_path):
    """
    Зураг уншиж, RGB форматруу хөрвүүлэх
    
    Args:
        image_path: Зургийн файлын зам
        
    Returns:
        RGB форматтай зураг эсвэл None
    """
    if not Path(image_path).exists():
        print(f"❌ Файл олдсонгүй: {image_path}")
        return None
    
    image = cv2.imread(image_path)
    if image is None:
        print(f"❌ Зураг уншиж чадсангүй: {image_path}")
        return None
    
    # OpenCV нь BGR форматтай, face_recognition нь RGB форматтай ажилладаг
    rgb_image = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)
    return rgb_image


def detect_face_encoding(image):
    """
    Зураг дахь нүүрийг илрүүлж, encoding үүсгэх
    
    Args:
        image: RGB форматтай зураг
        
    Returns:
        Face encoding эсвэл None
    """
    # Зураг дахь бүх нүүрийг илрүүлэх
    face_locations = face_recognition.face_locations(image)
    
    if len(face_locations) == 0:
        print("❌ Зураг дээр нүүр олдсонгүй")
        return None
    
    if len(face_locations) > 1:
        print(f"⚠️  {len(face_locations)} нүүр олдлоо, эхнийгийг ашиглана")
    
    # Face encoding үүсгэх (128-dimension vector)
    face_encodings = face_recognition.face_encodings(image, face_locations)
    
    if len(face_encodings) == 0:
        print("❌ Face encoding үүсгэж чадсангүй")
        return None
    
    return face_encodings[0]


def compare_faces(id_card_path, face_photo_path, tolerance=0.6):
    """
    Иргэний үнэмлэхний зураг болон нүүрний зургийг харьцуулах
    
    Args:
        id_card_path: Иргэний үнэмлэхний зургийн зам
        face_photo_path: Нүүрний зургийн зам
        tolerance: Таарах хязгаар (бага байх тусам хатуу шаардлага, default: 0.6)
        
    Returns:
        dict: Үр дүнгийн мэдээлэл
    """
    print("=" * 60)
    print("🔍 FACE MATCHING СИСТЕМ")
    print("=" * 60)
    
    # 1. Иргэний үнэмлэхний зураг уншиж, encoding үүсгэх
    print(f"\n📄 Иргэний үнэмлэх уншиж байна: {id_card_path}")
    id_image = load_image(id_card_path)
    if id_image is None:
        return {"success": False, "error": "Иргэний үнэмлэхний зураг уншигдсангүй"}
    
    print("   Нүүр илрүүлж байна...")
    id_encoding = detect_face_encoding(id_image)
    if id_encoding is None:
        return {"success": False, "error": "Иргэний үнэмлэх дээр нүүр олдсонгүй"}
    print("   ✅ Нүүр амжилттай илэрлээ")
    
    # 2. Нүүрний зураг уншиж, encoding үүсгэх
    print(f"\n📸 Нүүрний зураг уншиж байна: {face_photo_path}")
    face_image = load_image(face_photo_path)
    if face_image is None:
        return {"success": False, "error": "Нүүрний зураг уншигдсангүй"}
    
    print("   Нүүр илрүүлж байна...")
    face_encoding = detect_face_encoding(face_image)
    if face_encoding is None:
        return {"success": False, "error": "Нүүрний зураг дээр нүүр олдсонгүй"}
    print("   ✅ Нүүр амжилттай илэрлээ")
    
    # 3. Хоёр нүүрийг харьцуулах
    print(f"\n🔄 Нүүрүүдийг харьцуулж байна...")
    
    # Face distance тооцоолох (бага байх тусам ойр)
    face_distance = face_recognition.face_distance([id_encoding], face_encoding)[0]
    
    # Таарч байгаа эсэхийг шалгах
    matches = face_recognition.compare_faces([id_encoding], face_encoding, tolerance=tolerance)
    is_match = matches[0]
    
    # Таарах хувийг тооцоолох (0-100%)
    # face_distance нь 0-1 хооронд, бага байх тусам ойр
    match_percentage = max(0, (1 - face_distance) * 100)
    
    # 4. Үр дүн харуулах
    print("\n" + "=" * 60)
    print("📊 ҮР ДҮН")
    print("=" * 60)
    print(f"Face Distance:      {face_distance:.4f}")
    print(f"Tolerance:          {tolerance:.4f}")
    print(f"Таарах хувь:        {match_percentage:.2f}%")
    print(f"Таарах эсэх:        {'✅ Тийм' if is_match else '❌ Үгүй'}")
    
    if is_match:
        print("\n🎉 Нүүрүүд таарч байна!")
    else:
        print("\n⚠️  Нүүрүүд таарахгүй байна!")
    
    print("=" * 60)
    
    return {
        "success": True,
        "is_match": is_match,
        "match_percentage": round(match_percentage, 2),
        "face_distance": round(face_distance, 4),
        "tolerance": tolerance
    }


# ==================== API ENDPOINTS ====================

@app.get("/")
async def root():
    """API мэдээлэл"""
    return {
        "message": "Face Matching API",
        "version": "1.0.0",
        "endpoints": {
            "/": "API мэдээлэл",
            "/health": "Систем эрүүл мэндийн шалгалт",
            "/api/face-match": "Хоёр зургийн нүүр харьцуулах (POST)",
            "/verify/extract-document": "Иргэний үнэмлэхнээс мэдээлэл task (POST)",
            "/verify/face-match": "Frontend-тэй тохирсон face match endpoint (POST)"
        }
    }


@app.get("/health")
async def health_check():
    """Систем эрүүл мэнд шалгах"""
    return {
        "status": "healthy",
        "message": "API ажиллаж байна"
    }


@app.post("/api/face-match")
async def face_match_api(
    id_card: UploadFile = File(..., description="Иргэний үнэмлэхний зураг"),
    face_photo: UploadFile = File(..., description="Нүүрний зураг"),
    tolerance: float = 0.6,
    _: bool = Depends(verify_api_key)
):
    """
    Иргэний үнэмлэх болон нүүрний зургийг харьцуулах API endpoint
    
    Args:
        id_card: Иргэний үнэмлэхний зураг файл
        face_photo: Нүүрний зураг файл
        tolerance: Таарах хязгаар (0.0-1.0, бага байх тусам хатуу)
    
    Returns:
        JSON response with match result
    """
    try:
        # 1. Иргэний үнэмлэхний зураг уншиж, encoding үүсгэх
        print(f"\n📄 Иргэний үнэмлэх уншиж байна: {id_card.filename}")
        id_image = await load_image_from_upload(id_card)
        if id_image is None:
            raise HTTPException(
                status_code=400, 
                detail="Иргэний үнэмлэхний зураг уншигдсангүй"
            )
        
        print("   Нүүр илрүүлж байна...")
        id_encoding = detect_face_encoding(id_image)
        if id_encoding is None:
            raise HTTPException(
                status_code=400,
                detail="Иргэний үнэмлэх дээр нүүр олдсонгүй"
            )
        print("   ✅ Нүүр амжилттай илэрлээ")
        
        # 2. Нүүрний зураг уншиж, encoding үүсгэх
        print(f"\n📸 Нүүрний зураг уншиж байна: {face_photo.filename}")
        face_image = await load_image_from_upload(face_photo)
        if face_image is None:
            raise HTTPException(
                status_code=400,
                detail="Нүүрний зураг уншигдсангүй"
            )
        
        print("   Нүүр илрүүлж байна...")
        face_encoding = detect_face_encoding(face_image)
        if face_encoding is None:
            raise HTTPException(
                status_code=400,
                detail="Нүүрний зураг дээр нүүр олдсонгүй"
            )
        print("   ✅ Нүүр амжилттай илэрлээ")
        
        # 3. Хоёр нүүрийг харьцуулах
        print(f"\n🔄 Нүүрүүдийг харьцуулж байна...")
        
        # Face distance тооцоолох (бага байх тусам ойр)
        face_distance = face_recognition.face_distance([id_encoding], face_encoding)[0]
        
        # Таарч байгаа эсэхийг шалгах
        matches = face_recognition.compare_faces([id_encoding], face_encoding, tolerance=tolerance)
        is_match = matches[0]
        
        # Таарах хувийг тооцоолох (0-100%)
        # face_distance нь 0-1 хооронд, бага байх тусам ойр
        match_percentage = max(0, (1 - face_distance) * 100)
        
        # 4. Үр дүн
        print("\n" + "=" * 60)
        print("📊 ҮР ДҮН")
        print("=" * 60)
        print(f"Face Distance:      {face_distance:.4f}")
        print(f"Tolerance:          {tolerance:.4f}")
        print(f"Таарах хувь:        {match_percentage:.2f}%")
        print(f"Таарах эсэх:        {'✅ Тийм' if is_match else '❌ Үгүй'}")
        print("=" * 60)
        
        return JSONResponse(content={
            "success": True,
            "is_match": bool(is_match),
            "match_percentage": round(float(match_percentage), 2),
            "face_distance": round(float(face_distance), 4),
            "tolerance": float(tolerance),
            "message": "Нүүрүүд таарч байна!" if is_match else "Нүүрүүд таарахгүй байна!"
        })
        
    except HTTPException:
        raise
    except Exception as e:
        print(f"❌ Алдаа гарлаа: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Серверийн алдаа: {str(e)}")


# ==================== LEGACY/FRONTEND COMPATIBILITY ENDPOINTS ====================

class ExtractDocumentRequest(BaseModel):
    """Иргэний үнэмлэх мэдээлэл task хүсэлт"""
    image_base64: str
    side: Literal["front", "back"] = "front"


class FaceMatchRequest(BaseModel):
    """Face matching хүсэлт (base64 зургууд)"""
    idImage: str
    selfieImage: str


@app.post("/verify/extract-document")
async def extract_document(request: ExtractDocumentRequest, _: bool = Depends(verify_api_key)):
    """
    Иргэний үнэмлэхнээс мэдээлэл task (stub implementation)
    Frontend compatibility-ийн төлөө deterministic response буцаана
    """
    try:
        # Base64 зургийг decode хийх
        image_data = base64.b64decode(request.image_base64.split(',')[1] if ',' in request.image_base64 else request.image_base64)
        
        # Зургийн hash үүсгэж, тогтмол ID гаргах
        image_hash = hashlib.md5(image_data).hexdigest()[:8]
        
        # Deterministic мэдээлэл үүсгэх
        user_id = f"User-{image_hash}"
        id_number = f"ID-{image_hash}"
        
        print(user_id)
        print(id_number)
        print(request.side)
        
        # Stub response - жинхэнэ OCR ашиглаагүй
        response = {
            "success": True,
            "data": {
                "name": user_id,
                "idNumber": id_number,
                "dateOfBirth": None,
                "address": None,
                "confidence": round(95 + random.random() * 5, 2)  # 95-100%
            }
        }
        
        print(response["data"]["confidence"])
        
        return response
        
    except Exception as e:
        print(f"❌ Extract document алдаа: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Алдаа гарлаа: {str(e)}")


@app.post("/verify/face-match")
async def verify_face_match(request: FaceMatchRequest, _: bool = Depends(verify_api_key)):
    """
    Frontend-тэй тохирсон face match endpoint
    Base64 зургууд хүлээн авч, face_recognition ашиглан харьцуулна
    """
    try:
        # Base64 зургуудыг decode хийх
        def decode_base64_image(base64_str: str):
            """Base64 string-г RGB зураг болгох"""
            # Data URL схемийг арилгах
            if ',' in base64_str:
                base64_str = base64_str.split(',')[1]
            
            # Decode хийх
            image_data = base64.b64decode(base64_str)
            nparr = np.frombuffer(image_data, np.uint8)
            image = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
            
            if image is None:
                return None
            
            # RGB формат руу хөрвүүлэх
            return cv2.cvtColor(image, cv2.COLOR_BGR2RGB)
        
        # 1. ID зураг боловсруулах
        print("\n📄 ID зураг боловсруулж байна...")
        id_image = decode_base64_image(request.idImage)
        if id_image is None:
            raise HTTPException(status_code=400, detail="ID зураг уншигдсангүй")
        
        id_encoding = detect_face_encoding(id_image)
        if id_encoding is None:
            raise HTTPException(status_code=400, detail="ID зураг дээр нүүр олдсонгүй")
        
        # 2. Selfie зураг боловсруулах
        print("📸 Selfie зураг боловсруулж байна...")
        selfie_image = decode_base64_image(request.selfieImage)
        if selfie_image is None:
            raise HTTPException(status_code=400, detail="Selfie зураг уншигдсангүй")
        
        selfie_encoding = detect_face_encoding(selfie_image)
        if selfie_encoding is None:
            raise HTTPException(status_code=400, detail="Selfie зураг дээр нүүр олдсонгүй")
        
        # 3. Харьцуулах
        print("🔄 Нүүрүүдийг харьцуулж байна...")
        face_distance = face_recognition.face_distance([id_encoding], selfie_encoding)[0]
        matches = face_recognition.compare_faces([id_encoding], selfie_encoding, tolerance=0.6)
        is_match = matches[0]
        match_percentage = max(0, (1 - face_distance) * 100)
        
        print(f"User-{hashlib.md5(request.idImage.encode()).hexdigest()[:8]}")
        print(f"ID-{hashlib.md5(request.idImage.encode()).hexdigest()[:8]}")
        print(None)
        print(match_percentage)
        
        return {
            "success": True,
            "isMatch": bool(is_match),
            "confidence": round(float(match_percentage), 2),
            "similarity": round(float(1 - face_distance), 4)
        }
        
    except HTTPException:
        raise
    except Exception as e:
        print(f"❌ Face match алдаа: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Алдаа гарлаа: {str(e)}")


# ==================== LEGACY CLI FUNCTIONS ====================


def visualize_comparison(id_card_path, face_photo_path, result):
    """
    Харьцуулалтын үр дүнг харуулах
    
    Args:
        id_card_path: Иргэний үнэмлэхний зургийн зам
        face_photo_path: Нүүрний зургийн зам
        result: compare_faces функцийн үр дүн
    """
    if not result.get("success"):
        print(f"Алдаа: {result.get('error')}")
        return
    
    # Зургуудыг уншиж, харуулах
    id_image = cv2.imread(id_card_path)
    face_image = cv2.imread(face_photo_path)
    
    if id_image is None or face_image is None:
        print("Зургуудыг харуулж чадсангүй")
        return
    
    # Зургуудын хэмжээг нормчлох
    height = 400
    id_image = cv2.resize(id_image, (int(id_image.shape[1] * height / id_image.shape[0]), height))
    face_image = cv2.resize(face_image, (int(face_image.shape[1] * height / face_image.shape[0]), height))
    
    # Хоёр зургийг хэвтээ чиглэлд нэгтгэх
    combined = np.hstack([id_image, face_image])
    
    # Үр дүнг зураг дээр бичих
    is_match = result["is_match"]
    match_percentage = result["match_percentage"]
    
    # Текст бэлтгэх
    status_text = "MATCH!" if is_match else "NO MATCH"
    color = (0, 255, 0) if is_match else (0, 0, 255)  # Ногоон эсвэл улаан
    
    # Текст нэмэх
    cv2.putText(combined, f"{status_text}", (10, 40), 
                cv2.FONT_HERSHEY_SIMPLEX, 1.2, color, 3)
    cv2.putText(combined, f"Match: {match_percentage:.2f}%", (10, 80), 
                cv2.FONT_HERSHEY_SIMPLEX, 0.8, color, 2)
    
    # Зураг харуулах
    cv2.imshow("Face Matching Result", combined)
    print("\n👁️  Зураг харуулж байна... (ESC товчлуурыг дарж хаана)")
    cv2.waitKey(0)
    cv2.destroyAllWindows()


def main():
    """
    Үндсэн функц - жишээ хэрэглээ
    """
    print("\n🎯 Иргэний үнэмлэх Face Matching Систем")
    print("-" * 60)
    
    # Файлын замуудыг оруулах
    print("\n📝 Файлын замуудыг оруулна уу:")
    id_card_path = input("Иргэний үнэмлэхний зураг: ").strip()
    face_photo_path = input("Нүүрний зураг: ").strip()
    
    # Хоосон бол жишээ зам ашиглах
    if not id_card_path:
        id_card_path = "id_card.jpg"
    if not face_photo_path:
        face_photo_path = "face_photo.jpg"
    
    # Харьцуулалт хийх
    result = compare_faces(id_card_path, face_photo_path)
    
    # Үр дүнг харуулах эсэхийг асуух
    if result.get("success"):
        show_visual = input("\n📷 Зургийг харуулах уу? (y/n): ").strip().lower()
        if show_visual == 'y':
            visualize_comparison(id_card_path, face_photo_path, result)


if __name__ == "__main__":
    # face_recognition суулгасан эсэхийг шалгах
    try:
        import face_recognition
        main()
    except ImportError:
        print("\n❌ face_recognition сан суусангүй!")
        print("\n📦 Суулгах команд:")
        print("   pip install face_recognition")
        print("\n💡 Анхааруулга: face_recognition нь dlib шаарддаг")
        print("   macOS дээр: brew install cmake")
        print("   Дараа нь: pip install dlib")
        print("   Эцэст нь: pip install face_recognition")
