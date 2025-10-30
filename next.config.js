/** @type {import('next').NextConfig} */
const nextConfig = {
    // ...การตั้งค่าอื่นๆ ของคุณอาจจะอยู่ที่นี่...

    // เพิ่มส่วนนี้เพื่อแก้ปัญหา 413
    api: {
        bodyParser: {
            sizeLimit: "100mb", // ตั้งค่าขนาดไฟล์สูงสุดที่คุณต้องการ (เช่น 10MB)
        },
    },
};

module.exports = nextConfig;
