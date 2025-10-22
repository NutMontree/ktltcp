"use client";

import { useEffect, useState } from "react";
import CardDataStats from "@/components/CardDataStats";

// Types
interface Pdca { _id: string; status?: string; year?: string; }
interface Resource { _id: string; name?: string; year?: string; }
interface DevDepartment { _id: string; name?: string; year?: string; }
interface Academic { _id: string; name?: string; year?: string; }

export default function DashboardCards() {
  const [pdcas, setPdcas] = useState<Pdca[]>([]);
  const [resources, setResources] = useState<Resource[]>([]);
  const [devDepartments, setDevDepartments] = useState<DevDepartment[]>([]);
  const [academics, setAcademics] = useState<Academic[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedYear, setSelectedYear] = useState<string>("");

  // ดึงข้อมูล
  useEffect(() => {
    const fetchAllData = async () => {
      try {
        const [pdcaRes, resourceRes, devDeptRes, academicRes] = await Promise.all([
          fetch("/api/Pdcas", { cache: "no-store" }),
          fetch("/api/Resources", { cache: "no-store" }),
          fetch("/api/Devdepartments", { cache: "no-store" }),
          fetch("/api/Academics", { cache: "no-store" }),
        ]);

        const [pdcaData, resourceData, devDeptData, academicData] = await Promise.all([
          pdcaRes.json(),
          resourceRes.json(),
          devDeptRes.json(),
          academicRes.json(),
        ]);

        setPdcas(Array.isArray(pdcaData.pdcas) ? pdcaData.pdcas : []);
        setResources(Array.isArray(resourceData.resources) ? resourceData.resources : []);
        setDevDepartments(Array.isArray(devDeptData.devdepartments) ? devDeptData.devdepartments : []);
        setAcademics(Array.isArray(academicData.academics) ? academicData.academics : []);
      } catch (err) {
        console.error("Error fetching data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAllData();
  }, []);

  // ดึงปีทั้งหมดจากข้อมูล
  const allYears = Array.from(new Set([
    ...pdcas.map((d) => d.year),
    ...resources.map((r) => r.year),
    ...devDepartments.map((d) => d.year),
    ...academics.map((a) => a.year),
  ].filter(Boolean))) as string[];

  // ฟังก์ชันกรองตามปี
  const filterByYear = <T extends { year?: string }>(items: T[]) =>
    selectedYear ? items.filter((item) => item.year === selectedYear) : items;

  return (
    <div>
      {/* Dropdown เลือกปี */}
      <div className="mb-6 flex items-center gap-4">
        <label htmlFor="yearSelect" className="text-gray-700 dark:text-gray-300 font-semibold">
          เลือกปี:
        </label>

        <div className="relative w-40">
          <select
            id="yearSelect"
            value={selectedYear}
            onChange={(e) => setSelectedYear(e.target.value)}
            className="
        block w-full appearance-none rounded-lg border border-gray-300 
        bg-white dark:bg-gray-800 dark:border-gray-700
        px-4 py-2 pr-10 text-gray-900 dark:text-gray-100
        shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500
        focus:border-blue-500
        hover:border-gray-400
        transition-all duration-200
      "
          >
            <option value="">ทั้งหมด</option>
            {allYears.map((year) => (
              <option key={year} value={year}>{year}</option>
            ))}
          </select>

          {/* ไอคอนลูกศรลง */}
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
            <svg className="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>
      </div>

      {/* Cards */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4 2xl:gap-7.5">
        <CardDataStats
          title="ฝ่ายแผนงานและความร่วมมือ"
          total={loading ? "..." : filterByYear(pdcas).length.toString()}
          rate=""
          levelUp
          children={undefined}
        />
        <CardDataStats
          title="ฝ่ายบริหารทรัพยากร"
          total={loading ? "..." : filterByYear(resources).length.toString()}
          rate=""
          levelUp
          children={undefined}
        />
        <CardDataStats
          title="ฝ่ายพัฒนากิจการนักเรียน"
          total={loading ? "..." : filterByYear(devDepartments).length.toString()}
          rate=""
          levelUp
          children={undefined}
        />
        <CardDataStats
          title="ฝ่ายวิชาการ"
          total={loading ? "..." : filterByYear(academics).length.toString()}
          rate=""
          levelUp
          children={undefined}
        />
      </div>
    </div>
  );
}
