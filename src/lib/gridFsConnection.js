// // lib/gridFsConnection.js (หรือในไฟล์ model/connection ของคุณ)

// import mongoose from "mongoose";
// import { GridFSBucket } from "mongodb";

// let gfs;
// // ตรวจสอบสถานะการเชื่อมต่อ และสร้าง GridFSBucket
// const setupGridFS = () => {
//     if (mongoose.connection.readyState !== 1) {
//         console.error("MongoDB not connected yet.");
//         // คุณควรให้แน่ใจว่าได้เรียก connectMongoDB() ก่อน
//         return null;
//     }
//     if (!gfs) {
//         gfs = new GridFSBucket(mongoose.connection.db, {
//             bucketName: "pdca_files", // กำหนดชื่อ Bucket
//         });
//         console.log("GridFSBucket initialized.");
//     }
//     return gfs;
// };

// // ฟังก์ชันสำหรับบันทึก Buffer ลง GridFS
// export const uploadBufferToGridFS = (buffer, filename, mimetype) => {
//     const bucket = setupGridFS();
//     if (!bucket) {
//         throw new Error("GridFS not initialized. MongoDB connection failed.");
//     }

//     return new Promise((resolve, reject) => {
//         // 1. สร้าง writable stream ไปยัง GridFS
//         const uploadStream = bucket.openUploadStream(filename, {
//             contentType: mimetype,
//         });

//         // 2. เมื่อการเขียนเสร็จสิ้น
//         uploadStream.on("finish", (file) => {
//             // file คือเอกสารที่บันทึกใน fs.files
//             resolve(file._id); // ส่ง ObjectId ของไฟล์กลับไป
//         });

//         // 3. จัดการข้อผิดพลาด
//         uploadStream.on("error", (err) => {
//             console.error("GridFS Upload Error:", err);
//             reject(err);
//         });

//         // 4. เขียน Buffer เข้าสู่ Stream
//         uploadStream.end(buffer);
//     });
// };