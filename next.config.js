// next.config.js

/** @type {import('next').NextConfig} */
const nextConfig = {
    // การตั้งค่าอื่นๆ ของ Next.js
    // ...

    // ⭐️ เพิ่มการตั้งค่านี้เพื่อเพิ่มขนาด Body Limit (100MB)
    experimental: {
        serverComponentsExternalPackages: ["mongoose"],
    },

    // สำหรับการตั้งค่าขนาดของ API (ใช้ได้ทั้ง Page และ App Router ในบางกรณี)
    // แม้ว่าจะใช้กับ App Router ได้ไม่สมบูรณ์เท่า Page Router 
    // แต่เป็นวิธีที่ถูกต้องในการตั้งค่า Body Size Limit ใน Next.js
    api: {
        bodyParser: {
            sizeLimit: '100mb',
        },
    },
};

module.exports = nextConfig;