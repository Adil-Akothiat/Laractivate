#!/bin/bash

# 1. نسخ ملفات الـ .env تلقائياً إذا لم تكن موجودة في السيرفر والكلينت
if [ ! -f server/.env ]; then
    echo "Creating server/.env..."
    cp server/.env.example server/.env
fi

if [ ! -f client/.env ]; then
    echo "Creating client/.env..."
    cp client/.env.example client/.env
fi

# 2. تشغيل الحاويات مباشرة
docker compose up --build