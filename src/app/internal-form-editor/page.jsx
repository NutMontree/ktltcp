"use client";
import React, { useEffect, useState } from "react";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";

const InternalFormEditorPage = () => {
  const [pdcaItems, setPdcaItems] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [fiscalYears, setFiscalYears] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [pinInput, setPinInput] = useState("");
  const [pinError, setPinError] = useState("");

  const [editingDeptIdx, setEditingDeptIdx] = useState(null);
  const [editingDeptText, setEditingDeptText] = useState("");
  const [editingYearIdx, setEditingYearIdx] = useState(null);
  const [editingYearText, setEditingYearText] = useState("");

  useEffect(() => {
    const fetchConfig = async () => {
      try {
        const res = await fetch("/api/InternalFormConfig");
        const data = await res.json();
        setPdcaItems(data.pdcaItems || []);
        setDepartments(data.departments || []);
        setFiscalYears(data.fiscalYears || ["2567", "2568", "2569", "2570"]);
      } catch (error) {
        console.error("Failed to fetch config:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchConfig();
  }, []);

  const showMessage = (text, type = "success") => {
    setMessage({ type, text });
    setTimeout(() => setMessage(null), 3000);
  };

  const saveConfigToDB = async (newDepts = departments, newYears = fiscalYears) => {
    try {
      const res = await fetch("/api/InternalFormConfig", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pdcaItems, departments: newDepts, fiscalYears: newYears }),
      });
      if (!res.ok) throw new Error("Failed to save");
      showMessage("บันทึกข้อมูลเรียบร้อยแล้ว");
    } catch (error) {
      showMessage(error.message, "error");
    }
  };

  const handleAddYear = () => {
    const lastYear = parseInt(fiscalYears[fiscalYears.length - 1] || "2567");
    const newYear = (lastYear + 1).toString();
    const newYears = [...fiscalYears, newYear];
    setFiscalYears(newYears);
    saveConfigToDB(departments, newYears);
  };

  const handleRemoveYear = (index) => {
    if (!confirm("ยืนยันการลบปีงบประมาณนี้?")) return;
    const newYears = fiscalYears.filter((_, i) => i !== index);
    setFiscalYears(newYears);
    saveConfigToDB(departments, newYears);
  };

  const startEditYear = (idx, text) => {
    setEditingYearIdx(idx);
    setEditingYearText(text);
  };

  const saveEditYear = () => {
    if (!editingYearText.trim()) return showMessage("ปีงบประมาณห้ามว่างเปล่า", "error");
    const newYears = [...fiscalYears];
    newYears[editingYearIdx] = editingYearText;
    setFiscalYears(newYears);
    setEditingYearIdx(null);
    saveConfigToDB(departments, newYears);
  };

  const handleAddDept = () => {
    const newDepts = [...departments, "หน่วยงานใหม่"];
    setDepartments(newDepts);
    saveConfigToDB(newDepts, fiscalYears);
  };

  const handleRemoveDept = (index) => {
    if (!confirm("ยืนยันการลบฝ่ายนี้?")) return;
    const newDepts = departments.filter((_, i) => i !== index);
    setDepartments(newDepts);
    saveConfigToDB(newDepts, fiscalYears);
  };

  const startEditDept = (idx, text) => {
    setEditingDeptIdx(idx);
    setEditingDeptText(text);
  };

  const saveEditDept = () => {
    if (!editingDeptText.trim()) return showMessage("ชื่อฝ่ายห้ามว่างเปล่า", "error");
    const newDepts = [...departments];
    newDepts[editingDeptIdx] = editingDeptText;
    setDepartments(newDepts);
    setEditingDeptIdx(null);
    saveConfigToDB(newDepts, fiscalYears);
  };

  const handlePinSubmit = (e) => {
    e.preventDefault();
    if (pinInput === "29122539") {
      setIsAuthenticated(true);
      setPinError("");
    } else {
      setPinError("รหัส PIN ไม่ถูกต้อง");
      setPinInput("");
    }
  };

  if (!isAuthenticated) {
    return (
      <DefaultLayout>
        <div className="flex h-[80vh] items-center justify-center">
          <div className="w-full max-w-md rounded-3xl bg-white p-8 shadow-xl border border-stroke dark:bg-boxdark dark:border-strokedark">
            <h2 className="text-2xl font-bold mb-6 text-center">รหัสผ่านเพื่อตั้งค่าระบบภายใน</h2>
            <form onSubmit={handlePinSubmit} className="space-y-4">
              <input
                type="password"
                value={pinInput}
                onChange={(e) => setPinInput(e.target.value)}
                placeholder="••••••••"
                className="w-full rounded-xl border border-stroke bg-gray-50 px-5 py-3 text-center text-xl outline-none focus:border-primary dark:bg-meta-4"
                autoFocus
              />
              {pinError && <p className="text-sm text-danger text-center">{pinError}</p>}
              <button type="submit" className="w-full rounded-xl bg-primary py-3 font-bold text-white transition hover:bg-opacity-90">
                ยืนยัน
              </button>
            </form>
          </div>
        </div>
      </DefaultLayout>
    );
  }

  if (loading) return <DefaultLayout><div className="p-10 text-center">กำลังโหลด...</div></DefaultLayout>;

  return (
    <DefaultLayout>
      <Breadcrumb pageName="ตั้งค่าระบบเอกสารภายใน" />
      <div className="mx-auto max-w-4xl space-y-10 pb-20">
        
        {/* Years Section */}
        <div className="bg-white p-8 rounded-3xl border border-stroke dark:bg-boxdark dark:border-strokedark">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-bold">ปีงบประมาณ</h3>
            <button onClick={handleAddYear} className="bg-warning text-white px-4 py-2 rounded-lg font-bold">+ เพิ่มปี</button>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {fiscalYears.map((year, idx) => (
              <div key={idx} className="p-4 border rounded-2xl flex flex-col items-center gap-2 group">
                {editingYearIdx === idx ? (
                  <input value={editingYearText} onChange={(e) => setEditingYearText(e.target.value)} onBlur={saveEditYear} onKeyDown={(e) => e.key === "Enter" && saveEditYear()} autoFocus className="w-full text-center border-b-2 border-warning outline-none bg-transparent" />
                ) : (
                  <span className="text-xl font-bold">{year}</span>
                )}
                <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={() => startEditYear(idx, year)} className="text-xs text-blue-500">แก้ไข</button>
                  <button onClick={() => handleRemoveYear(idx)} className="text-xs text-red-500">ลบ</button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Departments Section */}
        <div className="bg-white p-8 rounded-3xl border border-stroke dark:bg-boxdark dark:border-strokedark">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-bold">ฝ่ายที่รับผิดชอบ</h3>
            <button onClick={handleAddDept} className="bg-success text-white px-4 py-2 rounded-lg font-bold">+ เพิ่มฝ่าย</button>
          </div>
          <div className="space-y-3">
            {departments.map((dept, idx) => (
              <div key={idx} className="p-4 border rounded-2xl flex justify-between items-center group">
                {editingDeptIdx === idx ? (
                  <input value={editingDeptText} onChange={(e) => setEditingDeptText(e.target.value)} onBlur={saveEditDept} onKeyDown={(e) => e.key === "Enter" && saveEditDept()} autoFocus className="flex-1 outline-none bg-transparent border-b-2 border-success" />
                ) : (
                  <span className="font-bold">{dept}</span>
                )}
                <div className="flex gap-4 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={() => startEditDept(idx, dept)} className="text-sm text-blue-500 font-bold">แก้ไข</button>
                  <button onClick={() => handleRemoveDept(idx)} className="text-sm text-red-500 font-bold">ลบ</button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {message && <div className="fixed bottom-10 right-10 bg-black text-white px-6 py-3 rounded-full shadow-2xl font-bold">{message.text}</div>}
      </div>
    </DefaultLayout>
  );
};

export default InternalFormEditorPage;
