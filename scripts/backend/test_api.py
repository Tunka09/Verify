#!/usr/bin/env python3
"""
Face Matching API тест скрипт
Хоёр зургийг API руу илгээж, үр дүнг харуулна
"""

import requests
import sys
from pathlib import Path


def test_face_match(id_card_path: str, face_photo_path: str, tolerance: float = 0.6):
    """
    Face matching API-г тест хийх
    
    Args:
        id_card_path: Иргэний үнэмлэхний зургийн зам
        face_photo_path: Нүүрний зургийн зам
        tolerance: Таарах хязгаар
    """
    api_url = "http://localhost:8000/api/face-match"
    
    print("=" * 70)
    print("🧪 FACE MATCHING API ТЕСТ")
    print("=" * 70)
    
    # Файлууд байгаа эсэхийг шалгах
    id_card_file = Path(id_card_path)
    face_photo_file = Path(face_photo_path)
    
    if not id_card_file.exists():
        print(f"❌ Иргэний үнэмлэхний зураг олдсонгүй: {id_card_path}")
        return
    
    if not face_photo_file.exists():
        print(f"❌ Нүүрний зураг олдсонгүй: {face_photo_path}")
        return
    
    print(f"\n📄 Иргэний үнэмлэх: {id_card_file.name}")
    print(f"📸 Нүүрний зураг: {face_photo_file.name}")
    print(f"🎯 Tolerance: {tolerance}")
    
    try:
        # Файлуудыг бэлтгэх
        files = {
            'id_card': (id_card_file.name, open(id_card_file, 'rb'), 'image/jpeg'),
            'face_photo': (face_photo_file.name, open(face_photo_file, 'rb'), 'image/jpeg')
        }
        
        data = {
            'tolerance': tolerance
        }
        
        print(f"\n🚀 API руу хүсэлт илгээж байна...")
        print(f"   URL: {api_url}")
        
        # API дуудах
        response = requests.post(api_url, files=files, data=data)
        
        # Файлууд хаах
        files['id_card'][1].close()
        files['face_photo'][1].close()
        
        # Хариу шалгах
        if response.status_code == 200:
            result = response.json()
            
            print("\n" + "=" * 70)
            print("✅ АМЖИЛТТАЙ - ҮР ДҮН")
            print("=" * 70)
            print(f"Таарах эсэх:        {'✅ Тийм' if result['is_match'] else '❌ Үгүй'}")
            print(f"Таарах хувь:        {result['match_percentage']:.2f}%")
            print(f"Face Distance:      {result['face_distance']:.4f}")
            print(f"Tolerance:          {result['tolerance']:.4f}")
            print(f"Мессеж:             {result['message']}")
            print("=" * 70)
            
            # Match percentage-д үндэслэн үнэлгээ өгөх
            if result['match_percentage'] >= 85:
                print("\n🌟 Маш сайн таарч байна!")
            elif result['match_percentage'] >= 70:
                print("\n👍 Сайн таарч байна")
            elif result['match_percentage'] >= 50:
                print("\n⚠️  Хангалттай таарч байна")
            else:
                print("\n❌ Таарахгүй байна")
                
        else:
            print(f"\n❌ АЛДАА - Status Code: {response.status_code}")
            try:
                error = response.json()
                print(f"Дэлгэрэнгүй: {error.get('detail', 'Тодорхойгүй алдаа')}")
            except:
                print(f"Хариу: {response.text}")
                
    except requests.exceptions.ConnectionError:
        print("\n❌ API руу холбогдож чадсангүй!")
        print("   API ажиллаж байгаа эсэхийг шалгана уу:")
        print("   ./start.sh эсвэл uvicorn app.main:app --reload --port 8000")
    except Exception as e:
        print(f"\n❌ Алдаа гарлаа: {str(e)}")


def main():
    """Командын мөрийн аргументуудыг боловсруулах"""
    if len(sys.argv) < 3:
        print("\n🎯 Face Matching API Тест")
        print("\nХэрэглээ:")
        print("  python test_api.py <id_card_image> <face_photo_image> [tolerance]")
        print("\nЖишээ:")
        print("  python test_api.py id_card.jpg face.jpg")
        print("  python test_api.py id_card.jpg face.jpg 0.6")
        print("\nTolerance:")
        print("  0.4 - Маш хатуу шаардлага")
        print("  0.6 - Стандарт (default)")
        print("  0.8 - Зөөлөн шаардлага")
        sys.exit(1)
    
    id_card_path = sys.argv[1]
    face_photo_path = sys.argv[2]
    tolerance = float(sys.argv[3]) if len(sys.argv) > 3 else 0.6
    
    test_face_match(id_card_path, face_photo_path, tolerance)


if __name__ == "__main__":
    main()
