#!/bin/bash

# Face Matching API эхлүүлэх скрипт

echo "🚀 Face Matching API эхлүүлж байна..."
echo ""

# Virtual environment идэвхжүүлэх
if [ -d ".venv" ]; then
    echo "✅ Virtual environment идэвхжүүлж байна..."
    source .venv/bin/activate
else
    echo "❌ Virtual environment олдсонгүй!"
    echo "   Эхлээд суулгана уу: python3 -m venv .venv"
    exit 1
fi

# Dependencies шалгах
echo "📦 Dependencies шалгаж байна..."
pip list | grep -q fastapi
if [ $? -ne 0 ]; then
    echo "⚠️  Dependencies суусангүй. Суулгаж байна..."
    pip install -r requirements.txt
fi

echo ""
echo "✨ API ажиллаж байна:"
echo "   📍 http://localhost:8000"
echo "   📚 API Docs: http://localhost:8000/docs"
echo "   🏥 Health: http://localhost:8000/health"
echo ""
echo "⏹  Зогсоох: Ctrl+C"
echo ""

# API эхлүүлэх
uvicorn app.main:app --reload --port 8000
