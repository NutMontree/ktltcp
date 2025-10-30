// next.config.js

/** @type {import('next').NextConfig} */
const nextConfig = {
    // ... การตั้งค่าอื่น ๆ ของคุณ

    // 🚀 เพิ่มการตั้งค่าสำหรับ API Route
    experimental: {
        serverComponentsExternalPackages: ['mongoose', '@vercel/blob'], // หรือ packages อื่น ๆ
    },

    // ✅ เพิ่มการตั้งค่าเพื่อเพิ่มขนาด Body Limit
    // กำหนดขนาดสูงสุดของ Body ที่จะยอมรับ เช่น 50MB
    api: {
        bodyParser: {
            sizeLimit: '50mb', // คุณสามารถปรับเป็น '10mb' หรือ '25mb' ตามความเหมาะสม
        },
    },

};

module.exports = nextConfig;