"use client";

import { useEffect, useState, useMemo } from "react";
import AcademicCard from "@/app/(components)/AcademicCard"; // ✅ เพิ่มบรรทัดนี้

const AcademicDashboard = () => {
  const [academics, setAcademics] = useState([]);
  const [filterYear, setFilterYear] = useState(null);
  const [filterWork, setFilterWork] = useState(null);
  const [filterDept, setFilterDept] = useState(null);
  const [selectedAcademic, setSelectedAcademic] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAcademics = async () => {
      try {
        const res = await fetch("/api/Academics", { cache: "no-store" });
        const data = await res.json();
        setAcademics(data.academics);
      } catch (error) {
        console.error("Failed to fetch PDCA:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchAcademics();
  }, []);

  const filteredAcademics = useMemo(
    () =>
      academics.filter(
        (p) =>
          (!filterYear || p.year === filterYear) &&
          (!filterWork || p.namework === filterWork) &&
          (!filterDept || p.department === filterDept),
      ),
    [academics, filterYear, filterWork, filterDept],
  );

  const years = Array.from(new Set(academics.map((p) => p.year)));
  const works = Array.from(new Set(academics.map((p) => p.namework)));
  const depts = Array.from(new Set(academics.map((p) => p.department)));

  return (
    <div className="space-y-6 p-6">
      <h1 className="text-3xl font-bold text-gray-800">PDCA Dashboard</h1>

      {/* Filter Buttons */}
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
      ) : filteredAcademics.length === 0 ? (
        <p className="mt-6 text-center italic text-gray-500">
          ไม่มี PDCA ตามเงื่อนไขที่เลือก
        </p>
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
          {filteredAcademics.map((academic) => (
            <div
              key={academic._id}
              onClick={() => setSelectedAcademic(academic)}
              className="transform cursor-pointer rounded-xl bg-gradient-to-r from-white to-gray-50 p-4 shadow-md transition hover:scale-105 hover:shadow-xl"
            >
              <h2 className="mb-2 text-lg font-semibold text-gray-800">
                {academic.nameproject}
              </h2>
              <p className="text-sm text-gray-600">Work: {academic.namework}</p>
              <p className="text-sm text-gray-600">
                Dept: {academic.department}
              </p>
              <p className="text-sm text-gray-600">Year: {academic.year}</p>
            </div>
          ))}
        </div>
      )}

      {/* ใน AcademicDashboard */}
      {selectedAcademic && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
          onClick={() => setSelectedAcademic(null)}
        >
          <div
            className="relative max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-xl bg-white p-6 px-8 py-8 shadow-lg"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="absolute right-4 top-4 z-10 pt-4 text-2xl font-bold text-red-500 hover:text-red-700"
              onClick={() => setSelectedAcademic(null)}
            >
              ✕
            </button>

            <AcademicCard academic={selectedAcademic} />
          </div>
        </div>
      )}
    </div>
  );
};

export default AcademicDashboard;
