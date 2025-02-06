"use client";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import Link from "next/link";

const EditPdcaForm = ({ pdca }) => {
  const EDITMODE = pdca._id === "new" ? false : true;
  const router = useRouter();
  const startingPdcaData = {
    department: "",
    namework: "",
    nameproject: "",
    id1: "",
    id2: "",
    id3: "",
    id4: "",
    id5: "",
    id6: "",
    id7: "",
    id8: "",
    id9: "",
    id10: "",
    id11: "",
    id12: "",
    id13: "",
    id14: "",
    id15: "",
    id16: "",
    id17: "",
    id18: "",
    id19: "",
    id20: "",
  };

  if (EDITMODE) {
    startingPdcaData["department"] = pdca.department;
    startingPdcaData["namework"] = pdca.namework;
    startingPdcaData["nameproject"] = pdca.nameproject;
    startingPdcaData["id1"] = pdca.id1;
    startingPdcaData["id2"] = pdca.id2;
    startingPdcaData["id3"] = pdca.id3;
    startingPdcaData["id4"] = pdca.id4;
    startingPdcaData["id5"] = pdca.id5;
    startingPdcaData["id6"] = pdca.id6;
    startingPdcaData["id7"] = pdca.id7;
    startingPdcaData["id8"] = pdca.id8;
    startingPdcaData["id9"] = pdca.id9;
    startingPdcaData["id10"] = pdca.id10;
    startingPdcaData["id11"] = pdca.id11;
    startingPdcaData["id12"] = pdca.id12;
    startingPdcaData["id13"] = pdca.id13;
    startingPdcaData["id14"] = pdca.id14;
    startingPdcaData["id15"] = pdca.id15;
    startingPdcaData["id16"] = pdca.id16;
    startingPdcaData["id17"] = pdca.id17;
    startingPdcaData["id18"] = pdca.id18;
    startingPdcaData["id19"] = pdca.id19;
    startingPdcaData["id20"] = pdca.id20;
  }

  const [formData, setFormData] = useState(startingPdcaData);

  const handleChange = (e) => {
    const value = e.target.value;
    const name = e.target.name;

    setFormData((preState) => ({
      ...preState,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (EDITMODE) {
      const res = await fetch(`/api/Pdcas/${pdca._id}`, {
        method: "PUT",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify({ formData }),
      });
      if (!res.ok) {
        throw new Error("Failed to updated");
      }
    } else {
      const res = await fetch("/api/Pdcas", {
        method: "POST",
        body: JSON.stringify({ formData }),

        "Content-Type": "application/json",
      });
      if (!res.ok) {
        throw new Error("Failed to created");
      }
    }

    router.refresh();
    router.push("/");
  };

  const departments = [
    "ฝ่ายบริหารทรัพยากร",
    "ฝ่ายแผนงานและความร่วมมือ",
    "ฝ่ายพัฒนากิจการนักเรียน นักศึกษา",
    "ฝ่ายวิชาการ",
  ];

  return (
    <>
      <div className="flex justify-center py-8">
        <form
          onSubmit={handleSubmit}
          method="post"
          className="flex flex-col w-full px-8 lg:w-2/3" // xl:w-2/3
        >
          <h3 className="text-center pt-4 pb-2 text-xl">
            {EDITMODE ? "อัพเดทรายการ" : "สร้างรายการใหม่"}
          </h3>

          <label className="pt-8 pb-2">ชื่อฝ่าย</label>
          <select
            name="department"
            value={formData.department}
            onChange={handleChange}
            className=" rounded-full px-2 py-2 text-slate-500 bg-[#f1f5f0]"
          >
            {departments?.map((department, _index) => (
              <option key={_index} value={department}>
                {department}
              </option>
            ))}
          </select>

          <label className="pt-4">ชื่องาน</label>
          <input
            id="namework"
            name="namework"
            placeholder="กรุณากรอกข้อมูล"
            type="text"
            onChange={handleChange}
            required={true}
            value={formData.namework}
            className=" rounded-full px-4 py-2 text-slate-500 bg-[#f1f5f0]"
          />

          <label className="pt-4">ชื่อโครงการ</label>
          <input
            id="nameproject"
            name="nameproject"
            type="text"
            placeholder="กรุณากรอกข้อมูล"
            onChange={handleChange}
            required={true}
            value={formData.nameproject}
            className=" rounded-full px-4 py-2 text-slate-500 bg-[#f1f5f0]"
          />

          <div className="pt-4 form-check">
            <input
              id="id1"
              name="id1"
              type="checkbox"
              className="form-check-input"
              onChange={handleChange}
              value="1. บันทึกข้อความขออนุมัติโครงการ ✅"
              default={formData.id1}
            />
            <label className="form-check-label pt-4 pl-2" htmlFor="id1">
              1. บันทึกข้อความขออนุมัติโครงการ
            </label>
          </div>

          <div className="pt-4 form-check">
            <input
              id="id2"
              name="id2"
              type="checkbox"
              className="form-check-input"
              onChange={handleChange}
              value="2. บันทึกข้อความขออนุญาติดำเนินโครงการ ✅"
              default={formData.id2}
            />
            <label className="pt-4 pl-2" htmlFor="id2">
              2. บันทึกข้อความขออนุญาติดำเนินโครงการ
            </label>
          </div>

          <div className="pt-4 form-check">
            <input
              id="id3"
              name="id3"
              type="checkbox"
              className="form-check-input"
              onChange={handleChange}
              value="3. โครงการ ที่ผู้บริหารลงนามแล้ว ✅"
              default={formData.id3}
            />
            <label className="pt-4 pl-2" htmlFor="id3">
              3. โครงการ ที่ผู้บริหารลงนามแล้ว
            </label>
          </div>

          <div className="pt-4 form-check">
            <input
              id="id4"
              name="id4"
              type="checkbox"
              className="form-check-input"
              onChange={handleChange}
              value="4. บันทึกขออนุมัติคำสั่ง ✅"
              default={formData.id4}
            />
            <label className="pt-4 pl-2" htmlFor="id4">
              4. บันทึกขออนุมัติคำสั่ง
            </label>
          </div>
          <div className="pt-4 form-check">
            <input
              id="id5"
              name="id5"
              type="checkbox"
              className="form-check-input"
              onChange={handleChange}
              value="5. คำสั่งแต่งตั้งคณะกรรมการดำเนินงาน ✅"
              default={formData.id5}
            />
            <label className="pt-4 pl-2" htmlFor="id5">
              5. คำสั่งแต่งตั้งคณะกรรมการดำเนินงาน
            </label>
          </div>
          <div className="pt-4 form-check">
            <input
              id="id6"
              name="id6"
              type="checkbox"
              className="form-check-input"
              onChange={handleChange}
              value="6. บันทึกข้อความขออนุญาตประชุม ✅"
              default={formData.id6}
            />
            <label className="pt-4 pl-2" htmlFor="id6">
              6. บันทึกข้อความขออนุญาตประชุม
            </label>
          </div>
          <div className="pt-4 form-check">
            <input
              id="id7"
              name="id7"
              type="checkbox"
              className="form-check-input"
              onChange={handleChange}
              value="7. บันทึกข้อความขอเชิญประชุม ✅"
              default={formData.id7}
            />
            <label className="pt-4 pl-2" htmlFor="id7">
              7. บันทึกข้อความขอเชิญประชุม
            </label>
          </div>
          <div className="pt-4 form-check">
            <input
              id="id8"
              name="id8"
              type="checkbox"
              className="form-check-input"
              onChange={handleChange}
              value="8. บันทึกข้อความขอรายงานการประชุม ✅"
              default={formData.id8}
            />
            <label className="pt-4 pl-2" htmlFor="id8">
              8. บันทึกข้อความขอรายงานการประชุม
            </label>
          </div>
          <div className="pt-4 form-check">
            <input
              id="id9"
              name="id9"
              type="checkbox"
              className="form-check-input"
              onChange={handleChange}
              value="9. บันทึกข้อความขอความอนุเคราะห์ประชาสัมพันธ์โครงการ ✅"
              default={formData.id9}
            />
            <label className="pt-4 pl-2" htmlFor="id9">
              9. บันทึกข้อความขอความอนุเคราะห์ประชาสัมพันธ์โครงการ
            </label>
          </div>
          <div className="pt-4 form-check">
            <input
              id="id10"
              name="id10"
              type="checkbox"
              className="form-check-input"
              onChange={handleChange}
              value="10. บันทึกข้อความรายงานการประชาสัมพันธ์โครงการ ✅"
              default={formData.id10}
            />
            <label className="pt-4 pl-2" htmlFor="id10">
              10. บันทึกข้อความรายงานการประชาสัมพันธ์โครงการ
            </label>
          </div>
          <div className="pt-4 form-check">
            <input
              id="id11"
              name="id11"
              type="checkbox"
              className="form-check-input"
              onChange={handleChange}
              value="11. กำหนดการจัดกิจกรรม ✅"
              default={formData.id11}
            />
            <label className="pt-4 pl-2" htmlFor="id11">
              11. กำหนดการจัดกิจกรรม
            </label>
          </div>
          <div className="pt-4 form-check">
            <input
              id="id12"
              name="id12"
              type="checkbox"
              className="form-check-input"
              onChange={handleChange}
              value="12. หนังสือเชิญเป็นวิทยากร/หนังสือตอบรับเป็นวิทยากร/หนังสือขอบคุณวิทยากร ✅"
              default={formData.id12}
            />
            <label className="pt-4 pl-2" htmlFor="id12">
              12.
              หนังสือเชิญเป็นวิทยากร/หนังสือตอบรับเป็นวิทยากร/หนังสือขอบคุณวิทยากร
            </label>
          </div>
          <div className="pt-4 form-check">
            <input
              id="id13"
              name="id13"
              type="checkbox"
              className="form-check-input"
              onChange={handleChange}
              value="13. ลายมือชื่อผู้เข้าร่วมโครงการ ✅"
              default={formData.id13}
            />
            <label className="pt-4 pl-2" htmlFor="id13">
              13. ลายมือชื่อผู้เข้าร่วมโครงการ
            </label>
          </div>
          <div className="pt-4 form-check">
            <input
              id="id14"
              name="id14"
              type="checkbox"
              className="form-check-input"
              onChange={handleChange}
              value="14. รูปภาพการดำเนินงานโครงการ ✅"
              default={formData.id14}
            />
            <label className="pt-4 pl-2" htmlFor="id14">
              14. รูปภาพการดำเนินงานโครงการ
            </label>
          </div>
          <div className="pt-4 form-check">
            <input
              id="id15"
              name="id15"
              type="checkbox"
              className="form-check-input"
              onChange={handleChange}
              value="15. บันทึกข้อความรายงานสรุปการใช้งบประมาณ ✅"
              default={formData.id15}
            />
            <label className="pt-4 pl-2" htmlFor="id15">
              15. บันทึกข้อความรายงานสรุปการใช้งบประมาณ
            </label>
          </div>
          <div className="pt-4 form-check">
            <input
              id="เอกสารชุดเบิกโครงการ"
              name="id16"
              type="checkbox"
              className="form-check-input"
              onChange={handleChange}
              value="16. เอกสารชุดเบิกโครงการ ✅"
              default={formData.id16}
            />
            <label className="pt-4 pl-2" htmlFor="เอกสารชุดเบิกโครงการ">
              16. เอกสารชุดเบิกโครงการ
            </label>
          </div>
          <div className="pt-4 form-check">
            <input
              id="id17"
              name="id17"
              type="checkbox"
              className="form-check-input"
              onChange={handleChange}
              value="17. แบบสอบถามประเมินความพึงพอใจผู้เข้าร่วมโครงการ Google from / QR Code ✅"
              default={formData.id17}
            />
            <label className="pt-4 pl-2" htmlFor="id17">
              17. แบบสอบถามประเมินความพึงพอใจผู้เข้าร่วมโครงการ Google from / QR
              Code
            </label>
          </div>
          <div className="pt-4 form-check">
            <input
              id="id18"
              name="id18"
              type="checkbox"
              className="form-check-input"
              onChange={handleChange}
              value="18. บันทึกข้อความรายงานสรุปผลการวิเคราะห์ข้อมูลการดำเนินโครงการ ✅"
              default={formData.id18}
            />
            <label className="pt-4 pl-2" htmlFor="id18">
              18. บันทึกข้อความรายงานสรุปผลการวิเคราะห์ข้อมูลการดำเนินโครงการ
            </label>
          </div>
          <div className="pt-4 form-check">
            <input
              id="id19"
              name="id19"
              type="checkbox"
              className="form-check-input"
              onChange={handleChange}
              value="19. ผลการวิเคราะห์ข้อมูล ✅"
              default={formData.id19}
            />
            <label className="pt-4 pl-2" htmlFor="id19">
              19. ผลการวิเคราะห์ข้อมูล
            </label>
          </div>
          <div className="pt-4 form-check">
            <input
              id="id20"
              name="id20"
              type="checkbox"
              className="form-check-input"
              onChange={handleChange}
              value="20. บันทึกกข้อความรายงานสรุปผลการดำเนินโครงการ ✅"
              default={formData.id20}
            />
            <label className="pt-4 pl-2" htmlFor="id20">
              20. บันทึกกข้อความรายงานสรุปผลการดำเนินโครงการ
            </label>
          </div>
          <div className="pt-4 flex justify-center">
            <input
              type="submit"
              className="btn max-w-xs bg-[#3db68a] text-white py-4 rounded-full px-24"
              value={EDITMODE ? "Updated" : "Created"}
            />
          </div>
          <div className="pt-4 flex justify-center">
            <Link
              href="/"
              className="btn max-w-xs border-2 py-4 rounded-full px-24"
            >
              Close
            </Link>
          </div>
        </form>
      </div>
    </>
  );
};

export default EditPdcaForm;
