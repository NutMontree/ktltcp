"use client";

import { useEffect, useState, useMemo } from "react";
import DevdepartmentCard from "@/app/(components)/DevdepartmentCard";

const DevdepartmentDashboard = () => {
  const [devdepartments, setDevdepartments] = useState([]);
  const [filterYear, setFilterYear] = useState(null);
  const [filterWork, setFilterWork] = useState(null);
  const [filterDept, setFilterDept] = useState(null);
  const [selectedDevdepartment, setSelectedDevdepartment] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDevdepartments = async () => {
      try {
        const res = await fetch("/api/Devdepartments", { cache: "no-store" });
        const data = await res.json();
        setDevdepartments(data.devdepartments);
      } catch (error) {
        console.error("Failed to fetch PDCA:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchDevdepartments();
  }, []);

  const filteredDevdepartments = useMemo(
    () =>
      devdepartments.filter(
        (p) =>
          (!filterYear || p.year === filterYear) &&
          (!filterWork || p.namework === filterWork) &&
          (!filterDept || p.department === filterDept),
      ),
    [devdepartments, filterYear, filterWork, filterDept],
  );

  const years = Array.from(new Set(devdepartments.map((p) => p.year)));
  const works = Array.from(new Set(devdepartments.map((p) => p.namework)));
  const depts = Array.from(new Set(devdepartments.map((p) => p.department)));

  return (
    <div className="space-y-6 p-6">
      <h1 className="text-3xl font-bold text-gray-800">PDCA Dashboard</h1>

      {/* Filter Buttons (โค้ดส่วนนี้ไม่เปลี่ยนแปลง) */}
      <div className="flex flex-wrap items-center gap-2">
        <span className="font-semibold text-gray-700">Year:</span>
        {years.map((y) => (
          <button
            key={y}
            onClick={() => setFilterYear(filterYear === y ? null : y)}
            className={`rounded-full px-4 py-1 font-medium transition ${
              filterYear === y
                ? "bg-blue-600 text-white"
                : "bg-gray-200 hover:bg-gray-300"
            }`}
          >
            {y}
          </button>
        ))}
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <span className="font-semibold text-gray-700">Work:</span>
        {works.map((w) => (
          <button
            key={w}
            onClick={() => setFilterWork(filterWork === w ? null : w)}
            className={`rounded-full px-4 py-1 font-medium transition ${
              filterWork === w
                ? "bg-green-600 text-white"
                : "bg-gray-200 hover:bg-gray-300"
            }`}
          >
            {w}
          </button>
        ))}
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <span className="font-semibold text-gray-700">Department:</span>
        {depts.map((d) => (
          <button
            key={d}
            onClick={() => setFilterDept(filterDept === d ? null : d)}
            className={`rounded-full px-4 py-1 font-medium transition ${
              filterDept === d
                ? "bg-purple-600 text-white"
                : "bg-gray-200 hover:bg-gray-300"
            }`}
          >
            {d}
          </button>
        ))}
      </div>

      <button
        onClick={() => {
          setFilterYear(null);
          setFilterWork(null);
          setFilterDept(null);
        }}
        className="rounded-full bg-red-500 px-4 py-1 font-medium text-white transition hover:bg-red-600"
      >
        Reset Filters
      </button>

      {/* Loading / Empty State */}
      {loading ? (
        <p className="mt-6 text-center text-gray-500">
          Loading PDCA records...
        </p>
      ) : filteredDevdepartments.length === 0 ? (
        <p className="mt-6 text-center italic text-gray-500">
          ไม่มี PDCA ตามเงื่อนไขที่เลือก
        </p>
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filteredDevdepartments.map((devdepartment) => (
            <div
              key={devdepartment._id}
              onClick={() => setSelectedDevdepartment(devdepartment)}
              className="transform cursor-pointer rounded-xl bg-gradient-to-r from-white to-gray-50 p-4 shadow-md transition hover:scale-105 hover:shadow-xl"
            >
              <h2 className="mb-2 text-lg font-semibold text-gray-800">
                {devdepartment.nameproject}
              </h2>
              <p className="text-sm text-gray-600">
                Work: {devdepartment.namework}
              </p>
              <p className="text-sm text-gray-600">
                Dept: {devdepartment.department}
              </p>
              <p className="text-sm text-gray-600">
                Year: {devdepartment.year}
              </p>
            </div>
          ))}
        </div>
      )}

      {/* ⭐️⭐️ Modal Component (แก้ไข Positioning และ Scroll) ⭐️⭐️ */}
      {selectedDevdepartment && (
        <div // Overlay
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 backdrop-blur-sm" // ใช้ Flexbox เพื่อจัดกึ่งกลาง
          onClick={() => setSelectedDevdepartment(null)}
        >
          {/* Content Box: ใช้ m-4 เพื่อให้มี margin รอบ ๆ และ max-h เพื่อให้ scroll ภายในกล่องได้ */}
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative m-4 max-h-[90vh] w-full max-w-4xl overflow-y-auto rounded-xl bg-white p-6 shadow-2xl transition-all duration-300 sm:p-8 lg:max-w-6xl"
          >
            {/* ปุ่มปิด */}
            <button
              className="absolute right-6 top-6 z-10 pt-4 text-3xl font-light text-red-500 hover:text-red-700"
              onClick={() => setSelectedDevdepartment(null)}
            >
              ✕
            </button>
            <h2 className="mb-6 pt-12 text-3xl font-bold text-gray-900">
              รายละเอียด PDCA: {selectedDevdepartment.nameproject}
            </h2>
            {/* ปุ่มดาวน์โหลดไฟล์ PDF */}
            {selectedDevdepartment.fileUrl && (
              <a
                href={selectedDevdepartment.fileUrl}
                download={selectedDevdepartment.fileUrl || "download.pdf"}
                target="_blank"
                rel="noopener noreferrer"
                className="mb-6 inline-block rounded-lg bg-blue-600 px-6 py-2 font-medium text-white transition hover:bg-blue-700"
              >
                📥 Download PDF
              </a>
            )}
            {/* แสดง DevdepartmentCard (เป็นเนื้อหาที่อาจต้อง Scroll) */}
            <div className="mt-4 border-t border-gray-200 pt-6">
              <DevdepartmentCard devdepartment={selectedDevdepartment} />
            </div>
            {/* ส่วนแสดงผล PDF (เป็นเนื้อหาที่อาจต้อง Scroll) */}
            <div className="mt-8 border-t border-gray-200 pt-6">
              {selectedDevdepartment.fileUrl ? (
                <div>
                  <h3 className="mb-3 text-xl font-semibold text-gray-700">
                    PDF Preview:
                  </h3>
                  <div className="h-[600px] w-full">
                    <iframe
                      src={selectedDevdepartment.fileUrl}
                      width="100%"
                      height="100%"
                      className="rounded-md border border-gray-300"
                      title={`PDF Preview for ${selectedDevdepartment.nameproject}`}
                    >
                      Your browser does not support iframes. Please download the
                      PDF to view it.
                    </iframe>
                  </div>
                </div>
              ) : (
                <p className="mt-6 text-center italic text-gray-500">
                  (ไม่มีไฟล์ PDF แนบ)
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DevdepartmentDashboard;
