"use client";
import React, { useEffect, useState } from "react";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import { useRouter } from "next/navigation";

const SettingsPage = () => {
  const [pdcaItems, setPdcaItems] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await fetch("/api/Settings");
        const data = await res.json();
        setPdcaItems(data.pdcaItems || []);
        setDepartments(data.departments || []);
      } catch (error) {
        console.error("Failed to fetch settings:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchSettings();
  }, []);

  const handleItemChange = (id, newLabel) => {
    setPdcaItems(prev => prev.map(item => item.id === id ? { ...item, label: newLabel } : item));
  };

  const handleDeptChange = (index, newDept) => {
    setDepartments(prev => {
      const newDepts = [...prev];
      newDepts[index] = newDept;
      return newDepts;
    });
  };

  const handleSave = async () => {
    setSaving(true);
    setMessage(null);
    try {
      const res = await fetch("/api/Settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pdcaItems, departments }),
      });
      if (!res.ok) throw new Error("Failed to update settings");
      setMessage({ type: "success", text: "บันทึกการตั้งค่าเรียบร้อยแล้ว!" });
      setTimeout(() => setMessage(null), 3000);
      router.refresh();
    } catch (error) {
      setMessage({ type: "error", text: error.message });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <DefaultLayout>
        <div className="flex h-screen items-center justify-center">
          <div className="h-16 w-16 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
        </div>
      </DefaultLayout>
    );
  }

  return (
    <DefaultLayout>
      <Breadcrumb pageName="ตั้งค่าโครงสร้างระบบ (Form Editor)" />

      <div className="mx-auto max-w-5xl space-y-10">
        <div className="flex items-center justify-between">
           <div>
              <h2 className="text-3xl font-black text-black dark:text-white">เครื่องมือจัดการฟอร์ม</h2>
              <p className="text-gray-500">ปรับแต่งรายการเอกสารและหน่วยงานที่ใช้ในระบบ</p>
           </div>
           <button
             onClick={handleSave}
             disabled={saving}
             className="flex h-14 items-center justify-center rounded-2xl bg-primary px-10 font-black text-white shadow-xl shadow-primary/30 transition-all hover:scale-105 active:scale-95 disabled:bg-opacity-50"
           >
             {saving ? "กำลังบันทึก..." : "💾 บันทึกค่าทั้งหมด"}
           </button>
        </div>

        {message && (
          <div className={`rounded-2xl p-5 font-bold ${message.type === 'success' ? 'bg-success/10 text-success border border-success/20' : 'bg-danger/10 text-danger border border-danger/20'}`}>
            {message.type === 'success' ? '✅ ' : '❌ '} {message.text}
          </div>
        )}

        <div className="grid grid-cols-1 gap-10 lg:grid-cols-12">
           {/* Checklist Editor */}
           <div className="lg:col-span-8 space-y-6">
              <div className="rounded-[2.5rem] border border-stroke bg-white p-10 shadow-xl dark:border-strokedark dark:bg-boxdark">
                 <div className="mb-8 flex items-center gap-4 border-b border-stroke pb-6 dark:border-strokedark">
                    <span className="text-4xl">📝</span>
                    <div>
                       <h3 className="text-xl font-black text-black dark:text-white uppercase tracking-wider">รายการเอกสาร PDCA (20 รายการ)</h3>
                       <p className="text-sm text-gray-400">แก้ไขชื่อรายการที่จะไปแสดงในหน้าฟอร์มเพิ่มข้อมูล</p>
                    </div>
                 </div>
                 
                 <div className="space-y-4">
                    {pdcaItems.map((item) => (
                      <div key={item.id} className="flex items-center gap-4 group">
                         <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gray-50 font-black text-gray-400 dark:bg-meta-4">{item.id}</span>
                         <input
                           type="text"
                           value={item.label}
                           onChange={(e) => handleItemChange(item.id, e.target.value)}
                           placeholder={`รายการที่ ${item.id}`}
                           className="flex-1 rounded-xl border-2 border-transparent bg-gray-50 px-5 py-3 font-bold text-black outline-none transition focus:border-primary focus:bg-white dark:bg-meta-4 dark:text-white dark:focus:bg-boxdark"
                         />
                      </div>
                    ))}
                 </div>
              </div>
           </div>

           {/* Department Editor */}
           <div className="lg:col-span-4 space-y-6">
              <div className="rounded-[2.5rem] border border-stroke bg-white p-10 shadow-xl dark:border-strokedark dark:bg-boxdark sticky top-25">
                 <div className="mb-8 flex items-center gap-4 border-b border-stroke pb-6 dark:border-strokedark">
                    <span className="text-4xl">🏢</span>
                    <div>
                       <h3 className="text-xl font-black text-black dark:text-white uppercase tracking-wider">จัดการฝ่าย</h3>
                       <p className="text-sm text-gray-400">แก้ไขชื่อฝ่ายที่แสดงในตัวเลือก</p>
                    </div>
                 </div>

                 <div className="space-y-4">
                    {departments.map((dept, index) => (
                      <div key={index} className="space-y-2">
                         <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">ฝ่ายที่ {index + 1}</label>
                         <input
                           type="text"
                           value={dept}
                           onChange={(e) => handleDeptChange(index, e.target.value)}
                           className="w-full rounded-xl border-2 border-transparent bg-gray-50 px-5 py-3 font-bold text-black outline-none transition focus:border-primary focus:bg-white dark:bg-meta-4 dark:text-white dark:focus:bg-boxdark"
                         />
                      </div>
                    ))}
                 </div>

                 <div className="mt-10 rounded-2xl bg-warning/10 p-5 text-warning border border-warning/20">
                    <p className="text-xs font-bold leading-relaxed">
                       ⚠️ การเปลี่ยนชื่อฝ่ายอาจส่งผลต่อการค้นหาโครงการเก่าที่บันทึกไว้ด้วยชื่อเดิม
                    </p>
                 </div>
              </div>
           </div>
        </div>
      </div>
    </DefaultLayout>
  );
};

export default SettingsPage;
