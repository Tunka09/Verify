# NeuroVerify - AI Identity Verification System

**NeuroVerify** нь хиймэл оюун ухаанд суурилсан хүний царай таних болон бичиг баримт баталгаажуулах цогц систем юм. Энэхүү төсөл нь орчин үеийн вэб технологи болон компьютерийн харааны (computer vision) дэвшилтэт аргуудыг хослуулан бүтээгдсэн.

## 🚀 Гол Боломжууд

*   **Биометрийн Баталгаажуулалт (Face Match):** Хэрэглэгчийн селфи зургийг бичиг баримт дээрх зурагтай харьцуулж, ижил хүн мөн эсэхийг өндөр нарийвчлалтайгаар тогтооно. (55%-иас дээш бол амжилттай гэж үзнэ).
*   **Бичиг Баримт Таних (ID Extraction):** Иргэний үнэмлэх эсвэл паспортын зургийг OCR технологиор уншиж, түүн дээрх мэдээллийг (нэр, гэх мэт) автоматаар ялгаж авна.
*   **Монгол Хэлний Интерфэйс:** Хэрэглэгчийн бүх интерфэйс бүрэн Монгол хэл дээр хийгдсэн.

## 🛠 Технологийн Стек

### Frontend (Хэрэглэгчийн хэсэг)
*   **Framework:** [Next.js 15](https://nextjs.org/) (App Router)
*   **Language:** TypeScript
*   **Styling:** Tailwind CSS v4
*   **Animations:** Framer Motion
*   **Icons:** Lucide React
*   **UI Components:** Neobrutalism design system

### Backend (Сервер хэсэг)
*   **Framework:** [FastAPI](https://fastapi.tiangolo.com/)
*   **Language:** Python 3.11+
*   **AI/ML Libraries:**
    *   `face_recognition` (dlib суурьтай)
    *   `opencv-python-headless`
    *   `numpy`
    *   `Pillow`

### Гадаад үйлчилгээ
*   **OCR.space API** — баримтаас текст ялгах

## 📦 Суулгах заавар

Төслийг өөрийн компьютер дээр ажиллуулахын тулд дараах алхмуудыг дагана уу.

### Шаардлагатай зүйлс
*   Node.js (v20+)
*   Python (v3.10+)
*   CMake (dlib санг суулгахад шаардлагатай)

### 1. Backend (Python) тохиргоо

Backend код нь `scripts/backend` хавтсанд байрлана.

```bash
# Backend хавтас руу шилжих
cd scripts/backend

# Виртуал орчин үүсгэх
python3 -m venv venv

# Виртуал орчинг идэвхжүүлэх
# macOS/Linux:
source venv/bin/activate
# Windows:
# .\venv\Scripts\activate

# Шаардлагатай сангуудыг суулгах
pip install -r requirements.txt

# Серверийг асаах
./start.sh
# Эсвэл шууд: uvicorn app.main:app --reload --port 8000
```
Backend сервер `http://localhost:8000` дээр ажиллана.

### 2. Frontend (Next.js) тохиргоо

Төслийн үндсэн хавтас дээр ажиллана.

```bash
# Төслийн үндсэн хавтас руу буцах (хэрэв backend хавтас дотор байгаа бол)
cd ../..

# Сангуудыг суулгах
npm install

# Хөгжүүлэлтийн серверийг асаах
npm run dev
```
Frontend вэб сайт `http://localhost:3000` дээр ажиллана.

## 🖥 Ашиглах заавар

1.  Backend болон Frontend серверүүдийг зэрэг асаана.
2.  Вэб хөтөч дээрээ `http://localhost:3000` хаягаар орно.
3.  **"Баталгаажуулах"** товчийг дарж баталгаажуулалтын процессыг эхлүүлнэ.
4.  **Алхам 1:** Бичиг баримтын зургаа оруулна (урд болон ар тал).
5.  **Алхам 2:** Селфи зураг авч, бичиг баримттайгаа тулгана.
6.  Систем 55%-иас дээш таарсан тохиолдолд амжилттай гэж үзнэ.

## 📂 Төслийн бүтэц

```
.
├── app/                    # Next.js хуудас болон route-үүд
│   ├── verify/             # Баталгаажуулалтын хуудас
│   └── api/                # Next.js API routes (proxy)
├── components/             # React бүрэлдэхүүн хэсгүүд
│   ├── verification/       # Баталгаажуулалтын компонентууд
│   └── ui/                 # UI элементүүд (Button гэх мэт)
├── lib/                    # Туслах функцууд болон API дуудлагууд
├── public/                 # Зураг болон статик файлууд
├── scripts/
│   └── backend/            # Python FastAPI backend код
│       ├── app/            # API логик
│       └── requirements.txt
└── types/                  # TypeScript төрлүүд
```

## 🤝 Лиценз

Энэхүү төсөл нь сургалтын зориулалттай.
