"use client";

import DeletePdca from "./DeletePdca";
import Link from "next/link";
// นำเข้าไอคอนที่จำเป็น (สมมติว่าคุณใช้ Heroicons หรืออื่น ๆ แต่ในตัวอย่างนี้ใช้ Emoji แทน)

const PdcaCard = ({ pdca, editing = false, onEditChange }) => {
  function formatThaiDate(timestamp) {
    if (!timestamp) return "-";
    // ใช้ 'short' สำหรับชั่วโมง/นาที เพื่อให้ข้อความไม่ยาวเกินไป
    const options = {
      year: "numeric",
      month: "long",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    };
    return new Date(timestamp).toLocaleString("th-TH", options);
  }

  const createdDateTime = formatThaiDate(pdca.createdAt);

  return (
    // 🎨 Container หลัก: ดูดีขึ้นด้วยเงาและขอบมน
    <div className="relative rounded-xl bg-white p-6 shadow-xl transition-all duration-300 hover:shadow-2xl dark:bg-gray-800">
      {/* 🌟 Action buttons - จัดตำแหน่งให้มองเห็นง่ายและทันสมัย */}
      <div className="absolute right-4 top-4 flex gap-2">
        <Link
          href={`/PdcaPage/${pdca._id}`}
          // ใช้ปุ่มสไตล์ไอคอน/ลิงก์
          className="rounded-full bg-blue-100 p-2 text-blue-600 transition hover:bg-blue-200 dark:bg-blue-900 dark:text-blue-300"
          title="แก้ไข"
        >
          <span className="text-lg">⚙️ แก้ไข</span>
        </Link>
        <DeletePdca id={pdca._id} />{" "}
        {/* อย่าลืมปรับ DeletePdca ให้เข้ากับธีมนี้ด้วย */}
      </div>

      {/* ⭐️ Header - เน้นชื่อโครงการให้ชัดเจน */}
      <div className="mb-4 pr-16 pt-4">
        <h2 className="line-clamp-2 text-xl font-bold text-gray-900 dark:text-white">
          {pdca.nameproject}
        </h2>
        <p className="mt-1 text-sm font-medium text-purple-600 dark:text-purple-400">
          📁 งาน: {pdca.namework}
        </p>
      </div>

      <hr className="my-4 border-gray-100 dark:border-gray-700" />

      {/* 🏷️ Tags & Info - ข้อมูลสำคัญจัดให้อยู่ในแถวเดียวกัน */}
      <div className="mb-4 flex flex-wrap items-center gap-2">
        {/* Tag ปีงบประมาณ - ใช้สีเขียวเพื่อสื่อถึงความสำเร็จ/งบประมาณ */}
        <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-800 dark:bg-green-900 dark:text-green-300">
          🗓️ ปี: {pdca.year}
        </span>
        {/* Tag แผนก/ฝ่าย */}
        <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-semibold text-gray-700 dark:bg-gray-700 dark:text-gray-300">
          🏢 ฝ่าย: {pdca.department || "ไม่ระบุ"}
        </span>
      </div>

      {/* 📋 รายการ ID / สถานะความคืบหน้า */}
      <div className="mt-4 space-y-2">
        <p className="text-md font-semibold text-gray-800 dark:text-gray-200">
          📊 สถานะความคืบหน้า (PDCA Items):
        </p>

        {/* Grid สำหรับแสดงสถานะ 20 รายการ */}
        <div className="grid grid-cols-1 gap-3 rounded-lg border border-gray-200 bg-gray-50 p-3 px-6 py-6 dark:border-gray-600 dark:bg-gray-700 lg:grid-cols-2">
          {Array.from({ length: 20 }, (_, i) => {
            const key = `id${i + 1}`;
            const value = pdca[key];
            const isCompleted = !!value; // ตรวจสอบว่าเป็น true/มีค่า

            if (editing && onEditChange) {
              // ✏️ โหมดแก้ไข: แสดง Checkbox
              return (
                <div key={key} className="flex items-center gap-1">
                  <input
                    type="checkbox"
                    checked={isCompleted}
                    onChange={(e) => onEditChange(key, e.target.checked)}
                    className="h-4 w-4 rounded text-blue-600 focus:ring-blue-500"
                  />
                  <label className="text-xs text-gray-700 dark:text-gray-300">
                    {key.toUpperCase()}
                  </label>
                </div>
              );
            }

            // 👁️ โหมดแสดงผล: แสดงสถานะเป็นไอคอน
            return (
              <div key={key} className="pt-1">
                {value}
              </div>
            );
          })}
        </div>

        {/* ❌ โหมดแสดงผลดั้งเดิม (ถูกซ่อนในโค้ดใหม่ แต่เก็บไว้หากคุณต้องการแสดงข้อความ) */}
        {/* {!editing && Array.from({ length: 20 }, (_, i) => {
            const key = `id${i + 1}`;
            return pdca[key] ? (
              <div key={key} className="pt-1 text-sm text-gray-700">
                {pdca[key]} 
              </div>
            ) : null;
        })} 
        */}
      </div>

      {/* 🕒 Footer - ข้อมูลวันที่/เวลา */}
      <div className="mt-6 border-t border-gray-100 pt-3 text-right text-xs text-gray-500 dark:border-gray-700 dark:text-gray-400">
        <p>สร้างเมื่อ: **{createdDateTime}**</p>
      </div>
    </div>
  );
};

export default PdcaCard;
