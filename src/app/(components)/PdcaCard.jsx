// import DeletePdca from "./DeletePdca";
// import Link from "next/link";

// const PdcaCard = ({ pdca, editing = false, onEditChange }) => {
//   // ฟังก์ชันแปลงวันที่เป็นไทย
//   function formatThaiDate(timestamp) {
//     if (!timestamp) return "-";
//     const options = {
//       year: "numeric",
//       month: "long",
//       day: "2-digit",
//       hour: "2-digit",
//       minute: "2-digit",
//       second: "2-digit",
//     };
//     return new Date(timestamp).toLocaleString("th-TH", options);
//   }

//   const createdDateTime = formatThaiDate(pdca.createdAt);

//   return (
//     <div className="hover:bg-card-hover bg-card m-2 flex flex-col border border-stroke bg-white p-3 px-7.5 py-6 shadow-default dark:border-strokedark dark:bg-boxdark">
//       <div className="ml-auto flex gap-4">
//         <Link href={`/PdcaPage/${pdca._id}`}>✏️</Link>
//         <DeletePdca id={pdca._id} />
//       </div>

//       <hr className="bg-page mb-2 h-px border-0" />

//       <div className="pt-1">ปีงบประมาณ : {pdca.year}</div>
//       <div className="pt-1">ชื่องาน : {pdca.namework}</div>
//       <div className="pt-1">ชื่อโครงการ : {pdca.nameproject}</div>

//       {/* Render id1–id20 */}
//       {Array.from({ length: 20 }, (_, i) => {
//         const key = `id${i + 1}`;
//         const value = pdca[key];

//         if (editing && onEditChange) {
//           return (
//             <div key={key} className="flex items-center gap-2 pt-1">
//               <input
//                 type="checkbox"
//                 checked={!!value}
//                 onChange={(e) => onEditChange(key, e.target.checked)}
//                 className="h-4 w-4"
//               />
//               <label>{key}</label>
//             </div>
//           );
//         }

//         return (
//           <div key={key} className="pt-1">
//             {value}
//           </div>
//         );
//       })}

//       <div className="mt-2 flex flex-col">
//         <div className="my-1 text-xs">วันที่กรอกข้อมูล: {createdDateTime}</div>
//       </div>
//     </div>
//   );
// };

// export default PdcaCard;
"use client";

import DeletePdca from "./DeletePdca";
import Link from "next/link";

const PdcaCard = ({ pdca, editing = false, onEditChange }) => {
  function formatThaiDate(timestamp) {
    if (!timestamp) return "-";
    const options = {
      year: "numeric",
      month: "long",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    };
    return new Date(timestamp).toLocaleString("th-TH", options);
  }

  const createdDateTime = formatThaiDate(pdca.createdAt);

  return (
    <div className="">
      {/* Action buttons */}
      {/* <div className="absolute right-4 top-4 flex gap-3 pt-10">
        <Link
          href={`/PdcaPage/${pdca._id}`}
          className="text-blue-500 transition-colors hover:text-blue-700"
        >
          ✏️ แก้ไข
        </Link>
        <DeletePdca id={pdca._id} />
      </div> 

      {/* Header */}
      <div className="mb-4 pt-8">
        <h2 className="text-lg font-semibold text-gray-800">
          {pdca.nameproject}
        </h2>
        <p className="text-sm text-gray-500">{pdca.namework}</p>
      </div>

      <div className="mb-4 flex gap-2">
        <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-800">
          ปีงบประมาณ: {pdca.year}
        </span>
      </div>

      <hr className="my-4 border-gray-200" />

      <div>
        {Array.from({ length: 20 }, (_, i) => {
          const key = `id${i + 1}`;
          const value = pdca[key];

          if (editing && onEditChange) {
            return (
              <div key={key} className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  checked={!!value}
                  onChange={(e) => onEditChange(key, e.target.checked)}
                  className="h-4 w-4"
                />
                <label>{key}</label>
              </div>
            );
          }

          return (
            <div key={key} className="pt-1">
              {value}
            </div>
          );
        })}
      </div>

      <div className="mt-4 text-right text-xs text-gray-400">
        วันที่กรอกข้อมูล: {createdDateTime}
      </div>
    </div>
  );
};

export default PdcaCard;
