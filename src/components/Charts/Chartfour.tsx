"use client";

import React, { useEffect, useState, useMemo } from "react";
import dynamic from "next/dynamic";
import { ApexOptions } from "apexcharts";

// Dynamic import
const ReactApexChart = dynamic(() => import("react-apexcharts"), { ssr: false });

// Interfaces
interface Pdca { _id: string; status?: string; year?: string; date?: string; }
interface Resource { _id: string; name?: string; year?: string; date?: string; }
interface DevDepartment { _id: string; name?: string; year?: string; date?: string; }
interface Academic { _id: string; name?: string; year?: string; date?: string; }

interface TargetData {
    pdca: number;
    resources: number;
    devDepartments: number;
    academics: number;
}

const Chartfour: React.FC = () => {
    const [pdcas, setPdcas] = useState<Pdca[]>([]);
    const [resources, setResources] = useState<Resource[]>([]);
    const [devDepartments, setDevDepartments] = useState<DevDepartment[]>([]);
    const [academics, setAcademics] = useState<Academic[]>([]);
    const [loading, setLoading] = useState(true);

    // const [period, setPeriod] = useState<"Day" | "Week" | "Month">("Month");

    // Target จำนวนทั้งหมดต่อฝ่าย
    const target: TargetData = {
        pdca: 50,
        resources: 40,
        devDepartments: 30,
        academics: 60,
    };

    // Fetch data
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

    if (loading) return <div>Loading...</div>;

    // Group data by year
    const allYears = Array.from(new Set([
        ...pdcas.map(d => d.year),
        ...resources.map(d => d.year),
        ...devDepartments.map(d => d.year),
        ...academics.map(d => d.year),
    ].filter(Boolean))) as string[];

    const countByYear = (items: { year?: string }[]) => {
        return allYears.map(year => items.filter(i => i.year === year).length);
    };

    // Remaining calculation per year
    const remainingByYear = (items: { year?: string }[], total: number) => {
        return allYears.map((year, i) => {
            const count = items.filter(d => d.year === year).length;
            return count < total ? total - count : 0;
        });
    };

    // Series stacked bar per year
    const series = [
        {
            name: "มีข้อมูล", data: [
                ...countByYear(pdcas),
                ...countByYear(resources),
                ...countByYear(devDepartments),
                ...countByYear(academics)
            ].slice(0, allYears.length)
        },
        {
            name: "เหลือ", data: [
                ...remainingByYear(pdcas, target.pdca),
                ...remainingByYear(resources, target.resources),
                ...remainingByYear(devDepartments, target.devDepartments),
                ...remainingByYear(academics, target.academics)
            ].slice(0, allYears.length)
        },
    ];

    // const options: ApexOptions = {
    //     chart: {
    //         type: "bar",
    //         stacked: true,
    //         toolbar: { show: true },
    //         zoom: { enabled: false }
    //     },
    //     plotOptions: { bar: { horizontal: false, columnWidth: "100%" } },
    //     dataLabels: { enabled: false },
    //     xaxis: { categories: allYears },
    //     yaxis: { min: 0 },
    //     colors: ["#3C50E0", "#FF6B6B", "#80CAEE", "#FF9F43", "#2ED573", "#FF6B81", "#A29BFE", "#FFCA3A"],
    //     legend: { show: true, position: "top", horizontalAlign: "left" },
    //     responsive: [
    //         {
    //             breakpoint: 1024,
    //             options: {
    //                 plotOptions: { bar: { columnWidth: "60%" } },
    //                 legend: { position: "bottom" },
    //             },
    //         },
    //         {
    //             breakpoint: 640,
    //             options: {
    //                 plotOptions: { bar: { columnWidth: "80%" } },
    //                 legend: { position: "bottom", fontSize: "10px" },
    //             },
    //         },
    //     ],
    // };

    return (
        <div className=" ">
            {/* <div className=" mt-6">
                <table className="min-w-[800px] border border-gray-300 dark:border-gray-600 text-sm"></table> */}
            <div className="inline-block min-w-[600px] border border-gray-300 dark:border-gray-600 rounded-lg shadow-md">
                <table className="w-full text-center text-sm md:text-base">
                    <thead>
                        <tr className="bg-gray-100 dark:bg-gray-700">
                            <th className="px-4 py-3 border-b">ฝ่าย</th>
                            <th className="px-4 py-3 border-b">จำนวนทั้งหมด</th>
                            <th className="px-4 py-3 border-b">จำนวนที่มี</th>
                            <th className="px-4 py-3 border-b">เหลือ</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr className="even:bg-gray-50 dark:even:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700">
                            <td className="px-4 py-2 border-b">ฝ่ายแผนงานและความร่วมมือ</td>
                            <td className="px-4 py-2 border-b">{target.pdca}</td>
                            <td className="px-4 py-2 border-b">{pdcas.length}</td>
                            <td className="px-4 py-2 border-b">{target.pdca - pdcas.length}</td>
                        </tr>
                        <tr className="even:bg-gray-50 dark:even:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700">
                            <td className="px-4 py-2 border-b">ฝ่ายบริหารทรัพยากร</td>
                            <td className="px-4 py-2 border-b">{target.resources}</td>
                            <td className="px-4 py-2 border-b">{resources.length}</td>
                            <td className="px-4 py-2 border-b">{target.resources - resources.length}</td>
                        </tr>
                        <tr className="even:bg-gray-50 dark:even:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700">
                            <td className="px-4 py-2 border-b">ฝ่ายพัฒนากิจการนักเรียน</td>
                            <td className="px-4 py-2 border-b">{target.devDepartments}</td>
                            <td className="px-4 py-2 border-b">{devDepartments.length}</td>
                            <td className="px-4 py-2 border-b">{target.devDepartments - devDepartments.length}</td>
                        </tr>
                        <tr className="even:bg-gray-50 dark:even:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700">
                            <td className="px-4 py-2 border-b">ฝ่ายวิชาการ</td>
                            <td className="px-4 py-2 border-b">{target.academics}</td>
                            <td className="px-4 py-2 border-b">{academics.length}</td>
                            <td className="px-4 py-2 border-b">{target.academics - academics.length}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>

    );
};

export default Chartfour;
