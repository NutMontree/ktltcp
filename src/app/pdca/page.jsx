// import React from "react";
// import PdcaCard from "@/app/(components)/PdcaCard";

// const getPdcas = async () => {
//   try {
//     const res = await fetch(`https://ktltcp.vercel.app/api/Pdcas`, {
//`http://localhost:3000
//       cache: "no-store",
//     });

//     if (!res.ok) {
//       throw new Error("Failed to fetch topics");
//     }

//     return res.json();
//   } catch (error) {
//     console.log("Error loading topics: ", error);
//   }
// };

// const Pdca = async () => {
//   const data = await getPdcas();

//   if (!data?.pdcas) {
//     return <div>No pdca.</div>;
//   }

//   const pdcas = data.pdcas;

//   const uniqueYears = [...new Set(pdcas?.map(({ year }) => year))];

//   return (
//     <>
//       <h1 className="text-xl font-bold text-black-2">
//         ฝ่ายแผนงานและความร่วมมือ
//       </h1>
//       <div className="bg-page text-default-text flex-grow overflow-y-auto p-5">
//         <div>
//           {pdcas &&
//             uniqueYears?.map((uniqueYear, yearIndex) => (
//               <div key={yearIndex} className="mb-4">
//                 <h2 className="text-black-2">{uniqueYear}</h2>
//                 <div className="grid-cols-2 lg:grid xl:grid-cols-3">
//                   {pdcas
//                     .filter((pdca) => pdca.year === uniqueYear)
//                     .map((filteredPdca, _index) => (
//                       <PdcaCard id={_index} key={_index} pdca={filteredPdca} />
//                     ))}
//                 </div>
//               </div>
//             ))}
//         </div>
//       </div>
//     </>
//   );
// };

// export default Pdca;
// import React from "react";
// import PdcaCard from "@/app/(components)/PdcaCard";

// const getPdcas = async () => {
//   try {
//     const res = await fetch(`https://ktltcp.vercel.app/api/Pdcas`, {
//`http://localhost:3000
//       cache: "no-store",
//     });

//     if (!res.ok) {
//       throw new Error("Failed to fetch topics");
//     }

//     return res.json();
//   } catch (error) {
//     console.log("Error loading topics: ", error);
//   }
// };

// const Pdca = async () => {
//   const data = await getPdcas();

//   if (!data?.pdcas) {
//     return <div>No pdca.</div>;
//   }

//   const pdcas = data.pdcas;

//   const uniqueYears = [...new Set(pdcas?.map(({ year }) => year))];

//   return (
//     <>
//       <h1 className="text-xl font-bold text-black-2">
//         ฝ่ายแผนงานและความร่วมมือ
//       </h1>
//       <div className="bg-page text-default-text flex-grow overflow-y-auto p-5">
//         <div>
//           {pdcas &&
//             uniqueYears?.map((uniqueYear, yearIndex) => (
//               <div key={yearIndex} className="mb-4">
//                 <h2 className="text-black-2">{uniqueYear}</h2>
//                 <div className="grid-cols-2 lg:grid xl:grid-cols-3">
//                   {pdcas
//                     .filter((pdca) => pdca.year === uniqueYear)
//                     .map((filteredPdca, _index) => (
//                       <PdcaCard id={_index} key={_index} pdca={filteredPdca} />
//                     ))}
//                 </div>
//               </div>
//             ))}
//         </div>
//       </div>
//     </>
//   );
// };

// export default Pdca;

"use client";

import { useEffect, useState, useMemo } from "react";
import PdcaCard from "@/app/(components)/PdcaCard"; // ✅ เพิ่มบรรทัดนี้

const PdcaDashboard = () => {
  const [pdcas, setPdcas] = useState([]);
  const [filterYear, setFilterYear] = useState(null);
  const [filterWork, setFilterWork] = useState(null);
  const [filterDept, setFilterDept] = useState(null);
  const [selectedPdca, setSelectedPdca] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPdcas = async () => {
      try {
        const res = await fetch("/api/Pdcas", { cache: "no-store" });
        const data = await res.json();
        setPdcas(data.pdcas);
      } catch (error) {
        console.error("Failed to fetch PDCA:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchPdcas();
  }, []);

  const filteredPdcas = useMemo(
    () =>
      pdcas.filter(
        (p) =>
          (!filterYear || p.year === filterYear) &&
          (!filterWork || p.namework === filterWork) &&
          (!filterDept || p.department === filterDept),
      ),
    [pdcas, filterYear, filterWork, filterDept],
  );

  const years = Array.from(new Set(pdcas.map((p) => p.year)));
  const works = Array.from(new Set(pdcas.map((p) => p.namework)));
  const depts = Array.from(new Set(pdcas.map((p) => p.department)));

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
      ) : filteredPdcas.length === 0 ? (
        <p className="mt-6 text-center italic text-gray-500">
          ไม่มี PDCA ตามเงื่อนไขที่เลือก
        </p>
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
          {filteredPdcas.map((pdca) => (
            <div
              key={pdca._id}
              onClick={() => setSelectedPdca(pdca)}
              className="transform cursor-pointer rounded-xl bg-gradient-to-r from-white to-gray-50 p-4 shadow-md transition hover:scale-105 hover:shadow-xl"
            >
              <h2 className="mb-2 text-lg font-semibold text-gray-800">
                {pdca.nameproject}
              </h2>
              <p className="text-sm text-gray-600">Work: {pdca.namework}</p>
              <p className="text-sm text-gray-600">Dept: {pdca.department}</p>
              <p className="text-sm text-gray-600">Year: {pdca.year}</p>
            </div>
          ))}
        </div>
      )}

      {/* ใน PdcaDashboard */}
      {selectedPdca && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
          onClick={() => setSelectedPdca(null)}
        >
          <div onClick={(e) => e.stopPropagation()}>
            <button
              className="absolute right-4 top-4 text-lg font-bold text-red-500 transition hover:text-red-700"
              onClick={() => setSelectedPdca(null)}
            >
              ✕
            </button>

            {/* PdcaCard แสดงข้อมูล แต่ไม่มี modal ซ้อน */}
            <PdcaCard pdca={selectedPdca} />
          </div>
        </div>
      )}
    </div>
  );
};

export default PdcaDashboard;
