"use client";

import DeleteDevdepartment from "./DeleteDevdepartment";
import Link from "next/link";

const DevdepartmentCard = ({
  devdepartment,
  editing = false,
  onEditChange,
}) => {
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

  const createdDateTime = formatThaiDate(devdepartment.createdAt);

  return (
    <div className="relative w-full max-w-3xl overflow-y-auto rounded-xl bg-white p-6 shadow-md transition-shadow duration-300 hover:shadow-xl">
      {/* Action buttons */}
      <div className="absolute right-4 top-4 flex gap-3">
        <Link
          href={`/DevdepartmentPage/${devdepartment._id}`}
          className="text-blue-500 transition-colors hover:text-blue-700"
        >
          ✏️ แก้ไข
        </Link>
        <DeleteDevdepartment id={devdepartment._id} />
      </div>

      {/* Header */}
      <div className="mb-4 pt-8">
        <h2 className="text-lg font-semibold text-gray-800">
          {devdepartment.nameproject}
        </h2>
        <p className="text-sm text-gray-500">{devdepartment.namework}</p>
      </div>

      <div className="mb-4 flex gap-2">
        <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-800">
          ปีงบประมาณ: {devdepartment.year}
        </span>
      </div>

      <hr className="my-4 border-gray-200" />

      <div>
        {Array.from({ length: 20 }, (_, i) => {
          const key = `id${i + 1}`;
          const value = devdepartment[key];

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

export default DevdepartmentCard;
