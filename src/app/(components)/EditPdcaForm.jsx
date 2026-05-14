"use client";
import { useRouter } from "next/navigation";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";

const EditPdcaForm = ({ pdca }) => {
  const EDITMODE = pdca && pdca._id !== "new";
  const router = useRouter();

  const [departments, setDepartments] = useState([
    "ฝ่ายแผนงานและความร่วมมือ",
    "ฝ่ายพัฒนากิจการนักเรียน",
    "ฝ่ายวิชาการ",
    "ฝ่ายบริหารทรัพยากร",
  ]);
  const [fiscalYears, setFiscalYears] = useState(["2567", "2568", "2569", "2570"]);
  const [pdcaItems, setPdcaItems] = useState([]);
  const [loadingConfig, setLoadingConfig] = useState(true);

  const [formData, setFormData] = useState({
    year: "2567",
    department: departments[0],
    namework: "",
    nameproject: "",
    pdcaLink: "",
    id1: "", id2: "", id3: "", id4: "", id5: "",
    id6: "", id7: "", id8: "", id9: "", id10: "",
    id11: "", id12: "", id13: "", id14: "", id15: "",
    id16: "", id17: "", id18: "", id19: "", id20: "",
  });

  const [selectedFiles, setSelectedFiles] = useState([]);
  const [existingAttachments, setExistingAttachments] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchConfig = async () => {
      try {
        const res = await fetch("/api/FormConfig");
        const data = await res.json();
        if (data.departments) setDepartments(data.departments);
        if (data.pdcaItems) setPdcaItems(data.pdcaItems);
        if (data.fiscalYears) setFiscalYears(data.fiscalYears);
        
        if (!EDITMODE) {
           setFormData(prev => ({ 
             ...prev, 
             department: data.departments?.length > 0 ? data.departments[0] : prev.department,
             year: data.fiscalYears?.length > 0 ? data.fiscalYears[data.fiscalYears.length - 1] : prev.year
           }));
        }
      } catch (err) {
        console.error("Failed to fetch form config:", err);
      } finally {
        setLoadingConfig(false);
      }
    };
    fetchConfig();
  }, [EDITMODE]);

  if (EDITMODE && formData.nameproject === "") {
    // Dynamically load all checklist states from the database
    const checklistData = {};
    Object.keys(pdca).forEach((key) => {
      if (key.startsWith("id") && typeof pdca[key] === "string") {
        checklistData[key] = pdca[key];
      }
    });

    setFormData(prev => ({
       ...prev,
       year: pdca.year || "2567",
       department: pdca.department || departments[0],
       namework: pdca.namework || "",
       nameproject: pdca.nameproject || "",
       pdcaLink: pdca.pdcaLink || "",
       ...checklistData
    }));

    // Load existing attachments correctly
    if (pdca.attachments && pdca.attachments.length > 0) {
      setExistingAttachments(pdca.attachments);
    } else if (pdca.fileUrl) {
      setExistingAttachments([{ fileUrl: pdca.fileUrl, originalFileName: pdca.originalFileName }]);
    }
  }

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? (checked ? value : "") : value,
    }));
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    const validFiles = [];
    
    files.forEach(file => {
      if (file.type !== "application/pdf") {
        setError("มีไฟล์ที่ไม่ใช่ PDF ถูกข้ามไป (กรุณาเลือกเฉพาะไฟล์ PDF)");
      } else {
        validFiles.push(file);
      }
    });

    if (validFiles.length > 0) {
       setError(null);
       setSelectedFiles(prev => [...prev, ...validFiles]);
    }
    
    // Clear input so same file can be selected again if needed
    e.target.value = "";
  };

  const handleSelectAll = (e) => {
    e.preventDefault();
    const newFormData = { ...formData };
    
    // Toggle logic: if all items are currently checked, deselect all. Otherwise, select all.
    const allSelected = pdcaItems.length > 0 && pdcaItems.every(item => !!formData[`id${item.id}`]);
    
    if (allSelected) {
      // Deselect all
      pdcaItems.forEach(item => {
        newFormData[`id${item.id}`] = "";
      });
    } else {
      // Select all
      pdcaItems.forEach((item, index) => {
        newFormData[`id${item.id}`] = `${index + 1}. ${item.label} ✅`;
      });
    }
    
    setFormData(newFormData);
  };

  const handleRemoveSelectedFile = (index) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleRemoveExistingAttachment = (index) => {
    setExistingAttachments(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const formToSend = new FormData();
      formToSend.append("year", formData.year);
      formToSend.append("department", formData.department);
      formToSend.append("namework", formData.namework);
      formToSend.append("nameproject", formData.nameproject);
      formToSend.append("pdcaLink", formData.pdcaLink || "");

      selectedFiles.forEach((file, index) => {
        formToSend.append(`filepdf_${index}`, file);
      });
      
      formToSend.append("existingAttachments", JSON.stringify(existingAttachments));

      // Map dynamic checklist items instead of hardcoding 1-20
      pdcaItems.forEach(item => {
        const key = `id${item.id}`;
        // If the item is checked, it will have a value, otherwise send empty string to clear it
        formToSend.append(key, formData[key] || "");
      });

      const url = EDITMODE ? `/api/Pdcas/${pdca._id}` : "/api/Pdcas";
      const method = EDITMODE ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        body: formToSend,
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || "Failed to save data");
      }

      router.refresh();
      router.push("/pdca");
    } catch (err) {
      console.error("Submit error:", err);
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <DefaultLayout>
      <Breadcrumb pageName={EDITMODE ? "จัดการข้อมูล PDCA" : "ลงทะเบียนโครงการใหม่"} />

      <div className="mx-auto max-w-5xl px-2">
        <form onSubmit={handleSubmit} className="space-y-10">
          {/* Main Info Card */}
          <div className="overflow-hidden rounded-3xl md:rounded-[2.5rem] border border-stroke bg-white shadow-2xl shadow-primary/5 dark:border-strokedark dark:bg-boxdark relative">
            
            <div className="relative bg-white px-6 md:px-12 py-8 md:py-12 dark:bg-boxdark overflow-hidden">
              <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-primary/10 blur-[80px]"></div>
              <div className="absolute -left-20 -bottom-20 h-64 w-64 rounded-full bg-blue-500/10 blur-[80px]"></div>
              
              <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-8 border-b border-stroke pb-8 dark:border-strokedark">
                <div className="space-y-4">
                  <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 border border-primary/20">
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                    </span>
                    <span className="text-[10px] font-black uppercase tracking-widest text-primary">Registration Form</span>
                  </div>
                  <h2 className="text-3xl md:text-4xl font-black text-black dark:text-white tracking-tight">
                    {EDITMODE ? "แก้ไขข้อมูล" : "แบบฟอร์มบันทึก"} <span className="text-primary">PDCA</span>
                  </h2>
                  <p className="text-sm font-medium text-gray-500 max-w-lg leading-relaxed">
                    กรอกข้อมูลรายละเอียดโครงการและแนบไฟล์เอกสารที่เกี่ยวข้องให้ครบถ้วน ข้อมูลจะถูกบันทึกเข้าระบบเพื่อติดตามประเมินผล
                  </p>
                </div>
                <div className="hidden md:flex h-20 w-20 items-center justify-center rounded-3xl bg-gradient-to-br from-primary/10 to-blue-500/10 text-4xl shadow-inner border border-primary/20 backdrop-blur-md">
                   📝
                </div>
              </div>

              {error && (
                <div className="mb-8 flex items-center gap-3 rounded-2xl bg-danger/10 p-5 text-danger border border-danger/20 animate-shake">
                  <span className="text-xl">⚠️</span>
                  <p className="font-bold">{error}</p>
                </div>
              )}

              <div className="relative z-10 pt-10">
                <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
                  {/* Year Selection */}
                  <div className="space-y-3 group">
                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 group-focus-within:text-primary transition-colors">ปีงบประมาณ</label>
                    <div className="relative">
                      <select
                        name="year"
                        value={formData.year}
                        onChange={handleChange}
                        className="w-full appearance-none rounded-2xl border-2 border-stroke bg-gray-50 px-4 md:px-6 py-3 md:py-4 text-base md:text-lg font-bold text-black outline-none transition focus:border-primary focus:bg-white dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                      >
                        {fiscalYears.map((y) => (
                          <option key={y} value={y}>{y}</option>
                        ))}
                      </select>
                      <span className="pointer-events-none absolute right-6 top-1/2 -translate-y-1/2 text-gray-400">▼</span>
                    </div>
                  </div>

                  {/* Department Selection */}
                  <div className="space-y-3 group">
                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 group-focus-within:text-primary transition-colors">ฝ่ายที่รับผิดชอบ</label>
                    <div className="relative">
                      <select
                        name="department"
                        value={formData.department}
                        onChange={handleChange}
                        className="w-full appearance-none rounded-2xl border-2 border-stroke bg-gray-50 px-4 md:px-6 py-3 md:py-4 text-base md:text-lg font-bold text-black outline-none transition focus:border-primary focus:bg-white dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                      >
                        {departments.map((dept) => (
                          <option key={dept} value={dept}>{dept}</option>
                        ))}
                      </select>
                      <span className="pointer-events-none absolute right-6 top-1/2 -translate-y-1/2 text-gray-400">▼</span>
                    </div>
                  </div>

                  {/* Work Name */}
                  <div className="space-y-3 group md:col-span-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 group-focus-within:text-primary transition-colors">ชื่อสายงาน / งาน</label>
                    <input
                      name="namework"
                      type="text"
                      placeholder="ระบุชื่องาน..."
                      value={formData.namework}
                      onChange={handleChange}
                      required
                      className="w-full rounded-2xl border-2 border-stroke bg-gray-50 px-4 md:px-6 py-3 md:py-4 text-base md:text-lg font-bold text-black outline-none transition focus:border-primary focus:bg-white dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                    />
                  </div>

                  {/* Project Name */}
                  <div className="space-y-3 group md:col-span-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 group-focus-within:text-primary transition-colors">ชื่อโครงการ</label>
                    <input
                      name="nameproject"
                      type="text"
                      placeholder="ระบุชื่อโครงการ..."
                      value={formData.nameproject}
                      onChange={handleChange}
                      required
                      className="w-full rounded-2xl border-2 border-stroke bg-gray-50 px-4 md:px-6 py-3 md:py-4 text-base md:text-lg font-bold text-black outline-none transition focus:border-primary focus:bg-white dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Link Section */}
            <div className="border-t border-stroke bg-white p-6 md:p-12 dark:border-strokedark dark:bg-boxdark relative z-20">
              <div className="mb-2">
                <label className="mb-3 flex items-center gap-2 text-sm font-black text-black dark:text-white uppercase tracking-widest">
                  <span className="text-xl">🔗</span> ลิงก์เอกสารอ้างอิงภายนอก (ถ้ามี)
                </label>
                <div className="relative group">
                  <input
                    name="pdcaLink"
                    type="url"
                    placeholder="เช่น ลิงก์ Google Drive, SharePoint หรือโฟลเดอร์ผลงาน..."
                    value={formData.pdcaLink || ""}
                    onChange={handleChange}
                    className="w-full rounded-2xl border-2 border-stroke bg-gray-50 px-6 py-4 text-sm font-bold text-black outline-none transition group-hover:border-primary/50 focus:border-primary focus:bg-white focus:shadow-md dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                  />
                </div>
                <p className="mt-3 pl-2 text-xs font-bold text-gray-500">
                  * เคล็ดลับ: คุณสามารถแนบลิงก์ไฟล์ หรือโฟลเดอร์ Google Drive แทนการอัปโหลดไฟล์ขนาดใหญ่ได้ เพื่อลดพื้นที่จัดเก็บของระบบ
                </p>
              </div>
            </div>

            {/* File Upload Section */}
            <div className="border-t border-stroke bg-gray-50/50 p-6 md:p-12 dark:border-strokedark dark:bg-meta-4/20 relative z-10">
               <div className="flex flex-col items-center justify-center rounded-3xl md:rounded-[2.5rem] border-2 border-dashed border-primary/30 bg-white/60 p-8 md:p-12 text-center dark:border-primary/20 dark:bg-boxdark/60 transition-all duration-300 hover:border-primary hover:bg-primary/5 hover:shadow-xl group backdrop-blur-md">
                  <div className="mb-6 flex h-16 w-16 md:h-24 md:w-24 items-center justify-center rounded-full bg-primary/10 text-primary group-hover:scale-110 group-hover:bg-primary group-hover:text-white transition-all duration-300 shadow-inner">
                    <svg className="w-8 h-8 md:w-10 md:h-10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="12" y1="18" x2="12" y2="12"></line><line x1="9" y1="15" x2="15" y2="15"></line></svg>
                  </div>
                  <h4 className="mb-2 text-xl md:text-2xl font-black text-black dark:text-white">อัปโหลดไฟล์รายงาน (PDF)</h4>
                  <p className="mb-8 text-sm font-medium text-gray-500 max-w-md">รองรับการอัปโหลดเอกสาร PDF หลายไฟล์พร้อมกันเพื่อใช้เป็นหลักฐานอ้างอิงของโครงการ</p>
                  
                  <div className="relative w-full max-w-md mx-auto">
                    <input
                      id="filepdf"
                      type="file"
                      accept="application/pdf"
                      multiple
                      onChange={handleFileChange}
                      className="absolute inset-0 z-10 h-full w-full cursor-pointer opacity-0"
                    />
                    <div className="rounded-2xl bg-primary px-6 md:px-8 py-3 md:py-4 text-sm md:text-base font-black text-white shadow-lg shadow-primary/30 transition-all duration-300 group-hover:bg-opacity-90 group-hover:-translate-y-1">
                       เลือกไฟล์จากเครื่องคอมพิวเตอร์
                    </div>
                  </div>

                  {(selectedFiles.length > 0 || existingAttachments.length > 0) && (
                    <div className="mt-8 flex w-full max-w-md flex-col gap-3 text-left">
                       {/* Existing Attachments */}
                       {existingAttachments.map((attachment, idx) => (
                         <div key={`exist-${idx}`} className="flex items-center justify-between rounded-xl bg-gray-100 px-4 py-3 border border-stroke dark:bg-meta-4 dark:border-strokedark">
                            <div className="flex items-center gap-3 overflow-hidden">
                               <span className="text-primary font-black">✓</span>
                               <span className="text-sm font-bold text-black dark:text-white truncate">
                                  {attachment.originalFileName}
                               </span>
                            </div>
                            <button
                              type="button"
                              onClick={() => handleRemoveExistingAttachment(idx)}
                              className="text-gray-400 hover:text-danger ml-2"
                              title="ลบไฟล์นี้"
                            >
                              ✕
                            </button>
                         </div>
                       ))}
                       
                       {/* New Selected Files */}
                       {selectedFiles.map((file, idx) => (
                         <div key={`new-${idx}`} className="flex items-center justify-between rounded-xl bg-success/10 px-4 py-3 border border-success/20">
                            <div className="flex items-center gap-3 overflow-hidden">
                               <span className="text-success font-black">+</span>
                               <span className="text-sm font-bold text-black dark:text-white truncate">
                                  {file.name}
                               </span>
                            </div>
                            <button
                              type="button"
                              onClick={() => handleRemoveSelectedFile(idx)}
                              className="text-gray-400 hover:text-danger ml-2"
                              title="ลบไฟล์นี้"
                            >
                              ✕
                            </button>
                         </div>
                       ))}
                    </div>
                  )}
               </div>
            </div>
          </div>

          {/* Checklist Card */}
          <div className="overflow-hidden rounded-3xl md:rounded-[2.5rem] border border-stroke bg-white shadow-2xl shadow-success/5 dark:border-strokedark dark:bg-boxdark">
             <div className="bg-gray-50 px-6 md:px-8 py-6 md:py-8 border-b border-stroke dark:bg-meta-4/30 dark:border-strokedark flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                  <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-success/10 px-3 py-1 border border-success/20">
                    <span className="h-2 w-2 rounded-full bg-success"></span>
                    <span className="text-[10px] font-black uppercase tracking-widest text-success">Progress Tracking</span>
                  </div>
                  <h3 className="text-2xl md:text-3xl font-black text-black dark:text-white tracking-tight leading-tight">รายการตรวจสอบความคืบหน้า</h3>
                  <p className="mt-2 text-xs md:text-sm font-medium text-gray-500 max-w-lg mb-4">คลิกเลือกรายการที่ได้ดำเนินการเสร็จสิ้นเรียบร้อยแล้ว ระบบจะบันทึกสถานะโครงการตามรายการที่ท่านเลือก</p>
                  
                  <button 
                    onClick={handleSelectAll} 
                    type="button"
                    className="inline-flex items-center gap-2 rounded-xl bg-white px-4 py-2 text-sm font-bold text-success border-2 border-success/30 shadow-sm transition-all hover:bg-success hover:text-white hover:border-success dark:bg-boxdark dark:hover:bg-success"
                  >
                    {pdcaItems.length > 0 && pdcaItems.every(item => !!formData[`id${item.id}`]) 
                      ? "ยกเลิกการเลือกทั้งหมด" 
                      : "✅ เลือกรายการทั้งหมด"}
                  </button>
                </div>
                <div className="hidden lg:block text-right bg-white p-4 rounded-2xl shadow-sm border border-stroke dark:bg-boxdark dark:border-strokedark">
                   <div className="text-4xl font-black text-success">
                     {pdcaItems.filter(item => formData[`id${item.id}`]).length} <span className="text-xl text-gray-300 dark:text-gray-600">/ {pdcaItems.length}</span>
                   </div>
                   <div className="text-[10px] font-black uppercase tracking-widest text-gray-400 mt-1">Completed Items</div>
                </div>
             </div>

             <div className="p-6 md:p-10">
               <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
                  {pdcaItems.map((item, index) => {
                    const id = `id${item.id}`;
                    const valueWithCheck = `${index + 1}. ${item.label} ✅`;
                    const isChecked = !!formData[id];
                    
                    return (
                      <label 
                        key={id} 
                        className={`group relative flex cursor-pointer items-start gap-5 rounded-2xl border-2 p-6 transition-all duration-300 overflow-hidden ${
                          isChecked 
                          ? "border-success bg-success/5 shadow-md shadow-success/10" 
                          : "border-stroke bg-white hover:border-success/50 hover:bg-gray-50 dark:border-strokedark dark:bg-boxdark dark:hover:bg-meta-4/50"
                        }`}
                      >
                        {isChecked && <div className="absolute top-0 left-0 w-1.5 h-full bg-success"></div>}
                        
                        <div className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-xl border-2 transition-all duration-300 shadow-sm ${
                          isChecked ? "bg-success border-success text-white scale-110" : "border-gray-300 bg-white dark:border-gray-600 dark:bg-meta-4 group-hover:border-success/50"
                        }`}>
                          {isChecked && <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>}
                        </div>
                        
                        <div className="flex-1">
                          <input
                            id={id}
                            name={id}
                            type="checkbox"
                            value={valueWithCheck}
                            checked={isChecked}
                            onChange={handleChange}
                            className="hidden"
                          />
                          <div className={`text-base md:text-lg font-bold transition-colors leading-tight ${isChecked ? "text-success dark:text-success" : "text-black dark:text-white group-hover:text-success"}`}>
                            {item.label}
                          </div>
                          <div className="mt-2 text-[10px] font-black uppercase tracking-widest text-gray-400">
                            STEP {(index + 1).toString().padStart(2, "0")}
                          </div>
                        </div>
                      </label>
                    );
                  })}
               </div>
             </div>
          </div>

          {/* Form Actions */}
          <div className="flex flex-col gap-4 md:gap-6 pt-4 sm:flex-row sm:items-center">
            <button
              type="submit"
              disabled={isSubmitting}
              className="group relative flex h-14 md:h-16 flex-1 items-center justify-center overflow-hidden rounded-2xl md:rounded-[1.5rem] bg-primary font-black text-white shadow-xl md:shadow-2xl shadow-primary/30 transition-all hover:scale-[1.02] active:scale-[0.98] disabled:bg-opacity-50"
            >
              <span className="absolute inset-0 bg-white/20 opacity-0 transition-opacity group-hover:opacity-100"></span>
              {isSubmitting ? "กำลังประมวลผล..." : EDITMODE ? "อัปเดตข้อมูลทั้งหมด" : "บันทึกข้อมูลโครงการ"}
            </button>
            <Link
              href="/pdca"
              className="flex h-14 md:h-16 flex-1 items-center justify-center rounded-2xl md:rounded-[1.5rem] border-2 border-stroke bg-white font-black text-black transition-all hover:bg-gray-50 dark:border-strokedark dark:bg-meta-4 dark:text-white sm:max-w-xs"
            >
              ยกเลิก
            </Link>
          </div>
        </form>
      </div>
    </DefaultLayout>
  );
};

export default EditPdcaForm;
