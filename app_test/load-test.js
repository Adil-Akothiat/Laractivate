import http from 'k6/http';
import { check } from 'k6';

export const options = {
    stages: [
        { duration: '30s', target: 100 }, // رفع الحمل سريعاً إلى 100 مستخدم
        { duration: '30s', target: 200 }, // ثم إلى 200 مستخدم
        { duration: '30s', target: 500 }, // ثم قفزة عنيفة إلى 500 مستخدم متزامن!
        { duration: '30s', target: 500 }, // الثبات عند القمة لمعرفة نقطة الانهيار
        { duration: '20s', target: 0 },   // التخفيف والعودة للصفر
    ],
    thresholds: {
        // نراقب فقط، لن نضع قيوداً صارمة لأننا نتوقع الفشل في هذا الاختبار
        http_req_failed: ['rate<0.05'], // نتوقع ألا تتعدى الأخطاء 5% في أسوأ الحروف
    },
};

export default function () {
    const url = 'http://localhost:8000/api/billing/pricing';
    
    const params = {
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
        },
    };

    const res = http.get(url, params);

    // التحقق من أن السيرفر لا يزال حياً ويرد بـ 200
    check(res, {
        'status is 200': (r) => r.status === 200,
    });
}
