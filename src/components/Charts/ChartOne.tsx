"use client";

import React, { useEffect, useState, useMemo } from "react";
import dynamic from "next/dynamic";
import { ApexOptions } from "apexcharts";

const ReactApexChart = dynamic(() => import("react-apexcharts"), { ssr: false });

// Types
interface Pdca { _id: string; status?: string; year?: string; date?: string; }
interface Resource { _id: string; name?: string; date?: string; }
interface DevDepartment { _id: string; name?: string; date?: string; }
interface Academic { _id: string; name?: string; date?: string; }

const ChartOne: React.FC = () => {
  const [pdcas, setPdcas] = useState<Pdca[]>([]);
  const [resources, setResources] = useState<Resource[]>([]);
  const [devDepartments, setDevDepartments] = useState<DevDepartment[]>([]);
  const [academics, setAcademics] = useState<Academic[]>([]);
  const [loading, setLoading] = useState(true);

  const [period, setPeriod] = useState<"Day" | "Week" | "Month">("Month");

  // Fetch all data
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

  // Generate x-axis categories
  const categories = period === "Day"
    ? Array.from({ length: 30 }, (_, i) => `Day ${i + 1}`)
    : period === "Week"
      ? ["Week 1", "Week 2", "Week 3", "Week 4"]
      : ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

  // Count items per period
  const countPerPeriod = (items: { date?: string }[]) => {
    if (period === "Day") return Array.from({ length: 30 }, () => 0);
    if (period === "Week") return [0, 0, 0, 0];
    return Array.from({ length: 12 }, () => 0);
  };

  // Series data
  const series = useMemo(() => [
    { name: "ฝ่ายแผนงานและความร่วมมือ", data: [pdcas.length] },
    { name: "ฝ่ายบริหารทรัพยากร", data: [resources.length] },
    { name: "ฝ่ายพัฒนากิจการนักเรียน", data: [devDepartments.length] },
    { name: "ฝ่ายวิชาการ", data: [academics.length] },
  ], [pdcas, resources, devDepartments, academics]);

  const options: ApexOptions = {
    chart: { type: "bar", height: 350, toolbar: { show: false } },
    plotOptions: { bar: { horizontal: false, columnWidth: "50%" } },
    dataLabels: { enabled: false },
    xaxis: { categories },
    yaxis: { min: 0 },
    colors: ["#3C50E0", "#80CAEE", "#FF6B6B", "#FFC300"],
    legend: { show: true, position: "top", horizontalAlign: "left" },
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="col-span-12 rounded-sm border border-stroke bg-white px-5 pb-5 pt-7.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:col-span-8">
      {/* Header + Period Selector */}
      <div className="flex flex-wrap items-start justify-between gap-3 sm:flex-nowrap mb-4">
        <div className="flex gap-3">
          {["Day", "Week", "Month"].map((p) => (
            <button
              key={p}
              onClick={() => setPeriod(p as "Day" | "Week" | "Month")}
              className={`rounded px-3 py-1 text-xs font-medium ${period === p
                ? "bg-primary text-white"
                : "bg-gray-200 text-black dark:bg-boxdark dark:text-white"
                }`}
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      {/* Chart */}
      <ReactApexChart options={options} series={series} type="bar" height={350} />

      {/* Table */}
      <table className="min-w-full mt-6 border border-gray-300 dark:border-gray-600 text-sm">
        <thead>
          <tr className="bg-gray-100 dark:bg-gray-700">
            <th className="p-2 border-b">ฝ่าย</th>
            <th className="p-2 border-b">จำนวนทั้งหมด</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className="p-2 border-b">ฝ่ายแผนงานและความร่วมมือ</td>
            <td className="p-2 border-b">{pdcas.length}</td>
          </tr>
          <tr>
            <td className="p-2 border-b">ฝ่ายบริหารทรัพยากร</td>
            <td className="p-2 border-b">{resources.length}</td>
          </tr>
          <tr>
            <td className="p-2 border-b">ฝ่ายพัฒนากิจการนักเรียน</td>
            <td className="p-2 border-b">{devDepartments.length}</td>
          </tr>
          <tr>
            <td className="p-2 border-b">ฝ่ายวิชาการ</td>
            <td className="p-2 border-b">{academics.length}</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default ChartOne;
