"use client";

import React, { useEffect, useState, useMemo } from "react";
import dynamic from "next/dynamic";
import { ApexOptions } from "apexcharts";

const ReactApexChart = dynamic(() => import("react-apexcharts"), { ssr: false });

// Types
interface Pdca { _id: string; date?: string; }
interface Resource { _id: string; date?: string; }
interface DevDepartment { _id: string; date?: string; }
interface Academic { _id: string; date?: string; }

const ChartThree: React.FC = () => {
  const [pdcas, setPdcas] = useState<Pdca[]>([]);
  const [resources, setResources] = useState<Resource[]>([]);
  const [devDepartments, setDevDepartments] = useState<DevDepartment[]>([]);
  const [academics, setAcademics] = useState<Academic[]>([]);
  const [loading, setLoading] = useState(true);

  const [period, setPeriod] = useState<"Monthly" | "Yearly">("Monthly");

  // Fetch data
  useEffect(() => {
    const fetchData = async () => {
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

    fetchData();
  }, []);

  // ฟังก์ชันนับจำนวนตาม period
  const countByPeriod = (items: { date?: string }[]) => {
    if (!items.length) return 0;

    if (period === "Yearly") {
      // นับจำนวนทั้งหมดในปี
      return items.length;
    } else {
      // Monthly
      return items.length;
    }
  };

  const series = useMemo(() => [
    countByPeriod(pdcas),
    countByPeriod(resources),
    countByPeriod(devDepartments),
    countByPeriod(academics),
  ], [pdcas, resources, devDepartments, academics, period]);

  const total = series.reduce((a, b) => a + b, 0);
  const percentages = useMemo(() => series.map(n => total ? ((n / total) * 100).toFixed(1) : "0"), [series, total]);

  // สีแต่ละฝ่ายไม่ซ้ำกัน
  const colors = ["#1f77b4", "#ff7f0e", "#2ca02c", "#d62728"];

  const options: ApexOptions = {
    chart: { type: "donut", fontFamily: "Satoshi, sans-serif" },
    colors,
    labels: [
      "ฝ่ายแผนงานและความร่วมมือ",
      "ฝ่ายบริหารทรัพยากร",
      "ฝ่ายพัฒนากิจการนักเรียน",
      "ฝ่ายวิชาการ",
    ],
    legend: { show: false },
    plotOptions: { pie: { donut: { size: "65%", background: "transparent" } } },
    dataLabels: { enabled: false },
    responsive: [
      { breakpoint: 2600, options: { chart: { width: 380 } } },
      { breakpoint: 640, options: { chart: { width: 200 } } },
    ],
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="col-span-12 rounded-sm border border-stroke bg-white px-5 pb-5 pt-7.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:col-span-5">
      {/* Header + Period Selector */}

      {/* Chart */}
      <div className="mb-2 flex justify-center">
        <ReactApexChart options={options} series={series} type="donut" />
      </div>

      {/* Legend + Percent */}
      <div className="-mx-8 flex flex-wrap items-center justify-center gap-y-3">
        {options.labels?.map((label, idx) => (
          <div key={idx} className="w-full px-8 sm:w-1/2">
            <div className="flex w-full items-center">
              <span
                className="mr-2 block h-3 w-full max-w-3 rounded-full"
                style={{ backgroundColor: colors[idx] }}
              ></span>
              <div className="flex w-full justify-between text-sm font-medium text-black dark:text-white">
                <span>{label}</span>
                <span>{percentages[idx]}%</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ChartThree;
