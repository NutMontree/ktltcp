"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import Link from "next/link";

// Define only the 2 required items
const internalPdcaItems = [
  {
    id: 1,
    label: "1. แบบฟอร์มขออนุมัติโครงการ",
    file: "3.แบบฟอร์มขออนุมัติโครงการ",
  },
  {
    id: 3,
    label: "2. แบบฟอร์มขออนุญาตดำเนินโครงการ",
    file: "4.แบบฟอร์มขออนุญาตดำเนินโครงการ",
  },
];

const EditInternalPdcaForm = ({
  pdca = {},
  departments = [],
  fiscalYears = [],
}) => {
  const router = useRouter();
  const pdcaId = pdca?._id;
  const EDITMODE = pdcaId && pdcaId !== "new";
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const [formData, setFormData] = useState({
    year: pdca.year || "2567",
    department: pdca.department || departments[0] || "",
    namework: pdca.namework || "",
    nameproject: pdca.nameproject || "",
    pdcaLink: pdca.pdcaLink || "",
  });

  const [selectedFiles, setSelectedFiles] = useState([]);
  const [existingAttachments, setExistingAttachments] = useState([]);

  useEffect(() => {
    if (EDITMODE) {
      const initialFormData = { ...formData };
      internalPdcaItems.forEach((item) => {
        initialFormData[`id${item.id}`] = pdca[`id${item.id}`] || "";
      });
      setFormData(initialFormData);

      if (pdca.fileUrl && Array.isArray(pdca.fileUrl)) {
        const attachments = pdca.fileUrl.map((url, i) => ({
          fileUrl: url,
          originalFileName: pdca.originalFileName?.[i] || "Unknown File",
        }));
        setExistingAttachments(attachments);
      }
    }
  }, [pdca]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (type === "checkbox") {
      setFormData((prev) => ({ ...prev, [name]: checked ? value : "" }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleExportPDF = () => {
    const printWindow = window.open("", "_blank");
    const completedItemsCount = internalPdcaItems.filter(
      (item) => !!formData[`id${item.id}`],
    ).length;
    const progressPercent = Math.round(
      (completedItemsCount / internalPdcaItems.length) * 100,
    );

    const renderItems = (items) =>
      items
        .map(
          (item) => `
      <div style="display: flex; align-items: flex-start; margin-bottom: 8px;">
        <div style="width: 20px; height: 20px; border: 1px solid #000; margin-right: 10px; display: flex; align-items: center; justify-content: center; font-family: 'TH Sarabun New', sans-serif;">
          ${formData[`id${item.id}`] ? "✓" : ""}
        </div>
        <div style="flex: 1;">${item.label}</div>
      </div>
    `,
        )
        .join("");

    printWindow.document.write(`
      <html>
        <head>
          <title>รายงาน PDCA - ${formData.nameproject}</title>
          <style>
            @font-face {
              font-family: 'TH Sarabun New';
              src: url('https://cdn.jsdelivr.net/gh/Sarabun-New/font@master/fonts/THSarabunNew.ttf') format('truetype');
            }
            body { font-family: 'TH Sarabun New', sans-serif; font-size: 16pt; line-height: 1.5; padding: 1in; }
            .header { text-align: center; margin-bottom: 30px; position: relative; }
            .logo { width: 60px; height: auto; position: absolute; left: 0; top: 0; }
            .title { font-size: 20pt; font-weight: bold; }
            .section-title { font-size: 18pt; font-weight: bold; margin-top: 20px; margin-bottom: 10px; border-bottom: 1px solid #000; }
            .info { margin-bottom: 20px; background: #f9f9f9; padding: 15px; border-radius: 5px; }
          </style>
        </head>
        <body>
          <div class="header">
            <img src="/images/logo/logo.svg" class="logo" onerror="this.style.display='none'">
            <div class="title">รายงานสรุปผลการดำเนินงาน PDCA (เอกสารภายใน)</div>
            <div>วิทยาลัยเทคนิคกันทรลักษ์</div>
          </div>
          <div class="info">
            <strong>โครงการ:</strong> ${formData.nameproject}<br/>
            <strong>ฝ่าย:</strong> ${formData.department}<br/>
            <strong>งาน/สายงาน:</strong> ${formData.namework}<br/>
            <strong>ปีงบประมาณ:</strong> ${formData.year}<br/>
            <strong>ความสำเร็จ:</strong> ${progressPercent}%
          </div>
          <div class="section-title">รายการตรวจสอบ (Checklist)</div>
          ${renderItems(internalPdcaItems)}
          <script>window.onload = () => { window.print(); }</script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const formToSend = new FormData();
      Object.keys(formData).forEach((key) =>
        formToSend.append(key, formData[key]),
      );
      selectedFiles.forEach((file, i) =>
        formToSend.append(`filepdf_${i}`, file),
      );
      formToSend.append(
        "existingAttachments",
        JSON.stringify(existingAttachments),
      );

      const url = EDITMODE
        ? `/api/InternalPdcas/${pdcaId}`
        : "/api/InternalPdcas";
      const method = EDITMODE ? "PUT" : "POST";

      const res = await fetch(url, { method, body: formToSend });
      if (!res.ok) throw new Error("บันทึกข้อมูลไม่สำเร็จ");

      const savedData = await res.json();

      alert("บันทึกข้อมูลเรียบร้อยแล้ว");
      router.push("/InternalPdcaPage");
      router.refresh();
    } catch (err) {
      setError(err.message);
      alert(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <DefaultLayout>
      <Breadcrumb
        pageName={EDITMODE ? "แก้ไขเอกสารภายใน" : "ลงทะเบียนเอกสารภายใน"}
      />
      <div className="mx-auto max-w-5xl rounded-xl bg-white p-4 shadow-lg dark:bg-boxdark">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="flex items-center justify-between border-b pb-4">
            <h2 className="text-2xl font-bold">ข้อมูลเอกสาร</h2>
            <div className="flex gap-2">
              {EDITMODE && (
                <button
                  type="button"
                  onClick={handleExportPDF}
                  className="rounded-lg bg-success px-4 py-2 font-bold text-white"
                >
                  PDF รายงาน
                </button>
              )}
              <Link
                href="/InternalPdcaPage"
                className="rounded-lg bg-gray-200 px-4 py-2 font-bold"
              >
                กลับ
              </Link>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <label className="mb-2 block font-bold">ปีงบประมาณ</label>
              <select
                name="year"
                value={formData.year}
                onChange={handleChange}
                className="w-full rounded-xl border bg-gray-50 p-3 dark:bg-meta-4"
              >
                {fiscalYears.map((y) => (
                  <option key={y} value={y}>
                    {y}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="mb-2 block font-bold">ฝ่ายที่รับผิดชอบ</label>
              <select
                name="department"
                value={formData.department}
                onChange={handleChange}
                className="w-full rounded-xl border bg-gray-50 p-3 dark:bg-meta-4"
              >
                {departments.map((d) => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
              </select>
            </div>
            <div className="md:col-span-2">
              <label className="mb-2 block font-bold">งาน / สายงาน</label>
              <input
                name="namework"
                value={formData.namework}
                onChange={handleChange}
                required
                className="w-full rounded-xl border bg-gray-50 p-3 dark:bg-meta-4"
                placeholder="เช่น งานวางแผนและงบประมาณ"
              />
            </div>
            <div className="md:col-span-2">
              <label className="mb-2 block font-bold">ชื่อโครงการ</label>
              <input
                name="nameproject"
                value={formData.nameproject}
                onChange={handleChange}
                required
                className="w-full rounded-xl border bg-gray-50 p-3 dark:bg-meta-4"
              />
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between border-b pb-2">
              <h3 className="text-xl font-bold text-primary">รายการตรวจสอบ</h3>
              <span className="text-xs font-bold text-gray-400">
                * คลิกที่ชื่อเพื่อดาวน์โหลดเทมเพลต (.doc)
              </span>
            </div>

            {!EDITMODE && (
              <div className="rounded-xl border border-yellow-200 bg-yellow-50 p-4 text-sm font-bold text-yellow-800">
                ⚠️ กรุณาบันทึกข้อมูลโครงการเบื้องต้นก่อน
                เพื่อเริ่มกรอกแบบฟอร์มบันทึกข้อความและแบบฟอร์มขออนุมัติ
              </div>
            )}

            <div className="grid grid-cols-1 gap-4">
              {internalPdcaItems.map((item) => {
                const fieldId = `id${item.id}`;
                const isChecked = !!formData[fieldId];
                return (
                  <div
                    key={item.id}
                    className={`flex items-center justify-between rounded-2xl border p-5 transition-all ${isChecked ? "border-success bg-success/5 shadow-inner" : "border-stroke bg-gray-50 shadow-sm"}`}
                  >
                    <label className="flex flex-1 cursor-pointer items-center gap-4">
                      <input
                        type="checkbox"
                        name={fieldId}
                        value={`${item.label} ✅`}
                        checked={isChecked}
                        onChange={handleChange}
                        className="h-6 w-6 rounded-lg border-gray-300 text-primary focus:ring-primary"
                      />
                      <div className="flex flex-col">
                        <span
                          className={`text-lg font-bold ${isChecked ? "text-success" : "text-black dark:text-white"}`}
                        >
                          {item.label}
                        </span>
                        {item.file && (
                          <a
                            href={`/pdf/pdca/${item.file}`}
                            download
                            className="mt-1 flex items-center gap-1 text-xs text-blue-500 hover:underline"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <svg
                              width="12"
                              height="12"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2.5"
                            >
                              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                              <polyline points="7 10 12 15 17 10" />
                              <line x1="12" y1="15" x2="12" y2="3" />
                            </svg>
                            ดาวน์โหลดเทมเพลต: {item.file}
                          </a>
                        )}
                      </div>
                    </label>

                    {EDITMODE && (
                      <div className="flex gap-2">
                        {item.id === 1 && (
                          <Link
                            href={`/InternalPdcaPage/${pdcaId}/step1`}
                            className="flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2 text-sm font-bold text-white shadow-md transition-all hover:bg-blue-700"
                          >
                            ✍️ กรอกข้อมูล (แบบฟอร์ม 1)
                          </Link>
                        )}
                        {item.id === 3 && (
                          <Link
                            href={`/InternalPdcaPage/${pdcaId}/step2`}
                            className="flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2 text-sm font-bold text-white shadow-md transition-all hover:bg-blue-700"
                          >
                            ✍️ กรอกข้อมูล (แบบฟอร์ม 2)
                          </Link>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full rounded-2xl bg-primary py-4 text-xl font-bold text-white shadow-lg transition-all hover:bg-opacity-90"
          >
            {isSubmitting ? "กำลังบันทึก..." : "บันทึกข้อมูลหลัก"}
          </button>
        </form>
      </div>
    </DefaultLayout>
  );
};

export default EditInternalPdcaForm;
