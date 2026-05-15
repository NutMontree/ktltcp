"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

const Step3Form = ({ projectId, initialData = {} }) => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    title: initialData.title || "",
    rationale: initialData.rationale || "",
    objectives: initialData.objectives || [""],
    targets: {
      quantity: initialData.targets?.quantity || "",
      quality: initialData.targets?.quality || ""
    },
    steps: initialData.steps || [{ activity: "", period: "" }],
    budget: initialData.budget || [{ item: "", amount: 0 }],
    expectedOutcomes: initialData.expectedOutcomes || [""],
    responsiblePerson: initialData.responsiblePerson || ""
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleArrayChange = (index, field, value, arrayName) => {
    const newArray = [...formData[arrayName]];
    if (field) {
        newArray[index][field] = value;
    } else {
        newArray[index] = value;
    }
    setFormData(prev => ({ ...prev, [arrayName]: newArray }));
  };

  const addArrayItem = (arrayName, defaultValue) => {
    setFormData(prev => ({ ...prev, [arrayName]: [...prev[arrayName], defaultValue] }));
  };

  const removeArrayItem = (index, arrayName) => {
    const newArray = formData[arrayName].filter((_, i) => i !== index);
    setFormData(prev => ({ ...prev, [arrayName]: newArray }));
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/InternalPdcas/${projectId}/step3`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });
      if (!res.ok) throw new Error("Save failed");
      alert("บันทึกข้อมูลเรียบร้อยแล้ว");
    } catch (err) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleExportPDF = () => {
    const printWindow = window.open("", "_blank");
    printWindow.document.write(`
      <html>
        <head>
          <title>แบบฟอร์มขออนุมัติโครงการ</title>
          <style>
            @font-face {
              font-family: 'TH Sarabun New';
              src: url('https://cdn.jsdelivr.net/gh/Sarabun-New/font@master/fonts/THSarabunNew.ttf') format('truetype');
            }
            body { font-family: 'TH Sarabun New', sans-serif; font-size: 16pt; line-height: 1.5; padding: 1in; }
            .header { text-align: center; font-weight: bold; font-size: 20pt; margin-bottom: 20px; }
            .section { margin-bottom: 15px; }
            .bold { font-weight: bold; }
            table { width: 100%; border-collapse: collapse; margin-top: 10px; }
            table, th, td { border: 1px solid black; }
            th, td { padding: 8px; text-align: left; }
            .signature { margin-top: 50px; display: grid; grid-template-cols: 1fr 1fr; gap: 50px; }
          </style>
        </head>
        <body>
          <div class="header">แบบฟอร์มขออนุมัติโครงการ</div>
          <div class="section"><span class="bold">1. ชื่อโครงการ:</span> ${formData.title}</div>
          <div class="section"><span class="bold">2. หลักการและเหตุผล:</span><br/>${formData.rationale}</div>
          <div class="section"><span class="bold">3. วัตถุประสงค์:</span>
            <ul>${formData.objectives.map(o => `<li>${o}</li>`).join("")}</ul>
          </div>
          <div class="section"><span class="bold">4. เป้าหมาย:</span><br/>
            - เชิงปริมาณ: ${formData.targets.quantity}<br/>
            - เชิงคุณภาพ: ${formData.targets.quality}
          </div>
          <div class="section"><span class="bold">5. วิธีดำเนินงาน:</span>
            <table>
              <tr><th>กิจกรรมหลัก</th><th>ระยะเวลา</th></tr>
              ${formData.steps.map(s => `<tr><td>${s.activity}</td><td>${s.period}</td></tr>`).join("")}
            </table>
          </div>
          <div class="section"><span class="bold">6. งบประมาณ:</span>
            <table>
              <tr><th>รายการ</th><th>จำนวนเงิน (บาท)</th></tr>
              ${formData.budget.map(b => `<tr><td>${b.item}</td><td>${b.amount.toLocaleString()}</td></tr>`).join("")}
              <tr class="bold"><td>รวมทั้งสิ้น</td><td>${formData.budget.reduce((acc, b) => acc + Number(b.amount), 0).toLocaleString()}</td></tr>
            </table>
          </div>
          <div class="section"><span class="bold">7. ผลที่คาดว่าจะได้รับ:</span>
            <ul>${formData.expectedOutcomes.map(e => `<li>${e}</li>`).join("")}</ul>
          </div>
          <div class="signature">
             <div style="text-align: center;">
                <p>ลงชื่อ.........................................ผู้เสนอโครงการ</p>
                <p>(${formData.responsiblePerson || "........................................."})</p>
             </div>
             <div style="text-align: center;">
                <p>ลงชื่อ.........................................ผู้อนุมัติโครงการ</p>
                <p>(.........................................)</p>
                <p>ผู้อำนวยการวิทยาลัยเทคนิคกันทรลักษ์</p>
             </div>
          </div>
          <script>window.onload = () => { window.print(); }</script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  return (
    <div className="space-y-8 bg-white dark:bg-boxdark p-8 rounded-3xl shadow-xl border border-stroke">
      <div className="flex justify-between items-center border-b pb-6">
         <h2 className="text-3xl font-black text-black dark:text-white">แบบฟอร์มขออนุมัติโครงการ</h2>
         <div className="flex gap-3">
            <button onClick={handleSave} disabled={loading} className="bg-primary text-white px-6 py-2 rounded-xl font-bold">บันทึกข้อมูล</button>
            <button onClick={handleExportPDF} className="bg-success text-white px-6 py-2 rounded-xl font-bold">Export PDF</button>
         </div>
      </div>

      <div className="space-y-6">
        <div>
          <label className="block font-bold mb-2">1. ชื่อโครงการ</label>
          <input name="title" value={formData.title} onChange={handleChange} className="w-full p-4 border rounded-xl bg-gray-50 dark:bg-meta-4 outline-none focus:border-primary" />
        </div>

        <div>
          <label className="block font-bold mb-2">2. หลักการและเหตุผล</label>
          <textarea name="rationale" value={formData.rationale} onChange={handleChange} rows={4} className="w-full p-4 border rounded-xl bg-gray-50 dark:bg-meta-4 outline-none focus:border-primary" />
        </div>

        <div>
          <label className="flex justify-between items-center font-bold mb-2">
            3. วัตถุประสงค์
            <button onClick={() => addArrayItem("objectives", "")} className="text-primary text-sm">+ เพิ่ม</button>
          </label>
          {formData.objectives.map((obj, idx) => (
            <div key={idx} className="flex gap-2 mb-2">
              <input value={obj} onChange={(e) => handleArrayChange(idx, null, e.target.value, "objectives")} className="flex-1 p-3 border rounded-xl bg-gray-50 dark:bg-meta-4" />
              <button onClick={() => removeArrayItem(idx, "objectives")} className="text-red-500">ลบ</button>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block font-bold mb-2">4.1 เป้าหมาย (เชิงปริมาณ)</label>
            <input value={formData.targets.quantity} onChange={(e) => setFormData(prev => ({ ...prev, targets: { ...prev.targets, quantity: e.target.value } }))} className="w-full p-4 border rounded-xl bg-gray-50 dark:bg-meta-4" />
          </div>
          <div>
            <label className="block font-bold mb-2">4.2 เป้าหมาย (เชิงคุณภาพ)</label>
            <input value={formData.targets.quality} onChange={(e) => setFormData(prev => ({ ...prev, targets: { ...prev.targets, quality: e.target.value } }))} className="w-full p-4 border rounded-xl bg-gray-50 dark:bg-meta-4" />
          </div>
        </div>

        <div>
          <label className="flex justify-between items-center font-bold mb-2">
            5. วิธีดำเนินงาน/ขั้นตอนการดำเนินงาน
            <button onClick={() => addArrayItem("steps", { activity: "", period: "" })} className="text-primary text-sm">+ เพิ่มขั้นตอน</button>
          </label>
          {formData.steps.map((step, idx) => (
            <div key={idx} className="grid grid-cols-2 gap-4 mb-3">
              <input placeholder="กิจกรรม" value={step.activity} onChange={(e) => handleArrayChange(idx, "activity", e.target.value, "steps")} className="p-3 border rounded-xl bg-gray-50 dark:bg-meta-4" />
              <div className="flex gap-2">
                <input placeholder="ระยะเวลา" value={step.period} onChange={(e) => handleArrayChange(idx, "period", e.target.value, "steps")} className="flex-1 p-3 border rounded-xl bg-gray-50 dark:bg-meta-4" />
                <button onClick={() => removeArrayItem(idx, "steps")} className="text-red-500">ลบ</button>
              </div>
            </div>
          ))}
        </div>

        <div>
          <label className="flex justify-between items-center font-bold mb-2">
            6. งบประมาณ
            <button onClick={() => addArrayItem("budget", { item: "", amount: 0 })} className="text-primary text-sm">+ เพิ่มรายการ</button>
          </label>
          {formData.budget.map((b, idx) => (
            <div key={idx} className="grid grid-cols-2 gap-4 mb-3">
              <input placeholder="รายการ" value={b.item} onChange={(e) => handleArrayChange(idx, "item", e.target.value, "budget")} className="p-3 border rounded-xl bg-gray-50 dark:bg-meta-4" />
              <div className="flex gap-2">
                <input type="number" placeholder="จำนวนเงิน" value={b.amount} onChange={(e) => handleArrayChange(idx, "amount", e.target.value, "budget")} className="flex-1 p-3 border rounded-xl bg-gray-50 dark:bg-meta-4" />
                <button onClick={() => removeArrayItem(idx, "budget")} className="text-red-500">ลบ</button>
              </div>
            </div>
          ))}
          <div className="text-right font-bold text-xl p-4 bg-primary/5 rounded-xl">
             รวมเป็นเงินทั้งสิ้น: {formData.budget.reduce((acc, b) => acc + Number(b.amount), 0).toLocaleString()} บาท
          </div>
        </div>

        <div>
          <label className="flex justify-between items-center font-bold mb-2">
            7. ผลที่คาดว่าจะได้รับ
            <button onClick={() => addArrayItem("expectedOutcomes", "")} className="text-primary text-sm">+ เพิ่ม</button>
          </label>
          {formData.expectedOutcomes.map((outcome, idx) => (
            <div key={idx} className="flex gap-2 mb-2">
              <input value={outcome} onChange={(e) => handleArrayChange(idx, null, e.target.value, "expectedOutcomes")} className="flex-1 p-3 border rounded-xl bg-gray-50 dark:bg-meta-4" />
              <button onClick={() => removeArrayItem(idx, "expectedOutcomes")} className="text-red-500">ลบ</button>
            </div>
          ))}
        </div>

        <div>
          <label className="block font-bold mb-2">8. ผู้รับผิดชอบโครงการ (ลงชื่อ)</label>
          <input name="responsiblePerson" value={formData.responsiblePerson} onChange={handleChange} placeholder="ระบุชื่อ-นามสกุล" className="w-full p-4 border rounded-xl bg-gray-50 dark:bg-meta-4" />
        </div>
      </div>
    </div>
  );
};

export default Step3Form;
