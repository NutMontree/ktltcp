"use client";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import Link from "next/link";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import Image from "next/image";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";

const EditResourceForm = ({ resource }) => {
  const EDITMODE = resource && resource._id !== "new";
  const router = useRouter();

  const startingResourceData = {
    year: "2567",
    department: "ฝ่ายแผนงานและความร่วมมือ",
    namework: "",
    nameproject: "",
    filepdf: null, // สำหรับเก็บ File Object ใหม่ที่เลือก
    fileUrl: null, // สำหรับเก็บ URL ไฟล์เดิมจาก DB
    originalFileName: null, // สำหรับเก็บชื่อไฟล์เดิมจาก DB
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
    startingResourceData["year"] = resource.year || startingResourceData.year;
    startingResourceData["department"] =
      resource.department || startingResourceData.department;
    startingResourceData["namework"] = resource.namework || "";
    startingResourceData["nameproject"] = resource.nameproject || "";
    startingResourceData["fileUrl"] = resource.fileUrl || null;
    startingResourceData["originalFileName"] =
      resource.originalFileName || null;
    startingResourceData["id1"] = resource.id1 || "";
    startingResourceData["id2"] = resource.id2 || "";
    startingResourceData["id3"] = resource.id3 || "";
    startingResourceData["id4"] = resource.id4 || "";
    startingResourceData["id5"] = resource.id5 || "";
    startingResourceData["id6"] = resource.id6 || "";
    startingResourceData["id7"] = resource.id7 || "";
    startingResourceData["id8"] = resource.id8 || "";
    startingResourceData["id9"] = resource.id9 || "";
    startingResourceData["id10"] = resource.id10 || "";
    startingResourceData["id11"] = resource.id11 || "";
    startingResourceData["id12"] = resource.id12 || "";
    startingResourceData["id13"] = resource.id13 || "";
    startingResourceData["id14"] = resource.id14 || "";
    startingResourceData["id15"] = resource.id15 || "";
    startingResourceData["id16"] = resource.id16 || "";
    startingResourceData["id17"] = resource.id17 || "";
    startingResourceData["id18"] = resource.id18 || "";
    startingResourceData["id19"] = resource.id19 || "";
    startingResourceData["id20"] = resource.id20 || "";
  }

  const [formData, setFormData] = useState(startingResourceData);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setFormData((prev) => ({
      ...prev,
      filepdf: file,
      fileUrl: null,
      originalFileName: null,
    }));
  };

  // ⭐️ การจัดการ Checkbox ที่ถูกต้อง
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFormData((preState) => ({
      ...preState,
      // ถ้าเป็น checkbox: ถ้าถูก check ให้ใช้ value, ถ้าไม่ให้เป็น string ว่าง ("")
      [name]: type === "checkbox" ? (checked ? value : "") : value,
    }));
  };

  const handleRemoveAttachment = () => {
    const fileInput = document.getElementById("filepdf");
    if (fileInput) fileInput.value = "";

    setFormData((prev) => ({
      ...prev,
      filepdf: null,
      fileUrl: null,
      originalFileName: null,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const formToSend = new FormData();
      formToSend.append("year", formData.year);
      formToSend.append("department", formData.department);
      formToSend.append("namework", formData.namework);
      formToSend.append("nameproject", formData.nameproject);

      // ใส่ Checkbox ทั้งหมดลงใน FormData
      for (let i = 1; i <= 20; i++) {
        // ส่งเฉพาะ idX ที่มีค่า (ถูก Check)
        if (formData[`id${i}`]) {
          formToSend.append(`id${i}`, formData[`id${i}`]);
        }
      }

      if (formData.filepdf) {
        // กรณี 1: มีการเลือกไฟล์ใหม่
        formToSend.append("filepdf", formData.filepdf);
        formToSend.append("originalFileName", formData.filepdf.name);
        formToSend.append("fileAction", "REPLACE");
      } else if (EDITMODE && formData.fileUrl && formData.originalFileName) {
        // กรณี 2: EDITMODE และไม่มีไฟล์ใหม่ แต่มีไฟล์เดิม (ต้องการเก็บไว้)
        formToSend.append("fileUrl", formData.fileUrl);
        formToSend.append("originalFileName", formData.originalFileName);
        formToSend.append("fileAction", "RETAIN");
      } else if (EDITMODE && resource.fileUrl && !formData.fileUrl) {
        // กรณี 3: EDITMODE และไฟล์เดิมถูกลบออกไปแล้ว
        formToSend.append("fileAction", "DELETE");
      } else {
        // กรณี 4: สร้างใหม่ ไม่มีไฟล์ หรือ EDITMODE ไม่มีไฟล์เดิมและไม่เลือกไฟล์ใหม่
        formToSend.append("fileAction", "NONE");
      }

      let res;

      if (EDITMODE) {
        res = await fetch(`/api/Resources/${resource._id}`, {
          method: "PUT",
          body: formToSend,
        });
      } else {
        res = await fetch("/api/Resources", {
          method: "POST",
          body: formToSend,
        });
      }

      if (!res.ok) {
        throw new Error("Failed to create/update PDCA");
      }

      router.refresh();
      router.push("/");
    } catch (err) {
      console.error("❌ Error submitting PDCA:", err);
    }
  };

  const hasAttachment = formData.filepdf || formData.fileUrl;

  return (
    <>
      <DefaultLayout>
        <Breadcrumb pageName={EDITMODE ? "Update Resource" : "New Resource"} />

        <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
          <div className="flex flex-wrap items-center">
            <div className="hidden w-full xl:block xl:w-1/2">
              <div className="px-26 py-17.5 text-center">
                <Link className="mb-5.5 inline-block" href="/">
                  <Image
                    className="hidden dark:block"
                    src={"/images/logo/logo.svg"}
                    alt="Logo"
                    width="176"
                    height="32"
                  />
                  <Image
                    className="dark:hidden"
                    src={"/images/logo/logo.svg"}
                    alt="Logo"
                    width="176"
                    height="32"
                  />
                </Link>

                <div className="2xl:px-20">ระบบ ตรวจเช็ค Resource งานแผน</div>
                <div>ระบบไม่เปิดให้ไขข้อมูลได้ภายหลัง</div>
                <div>
                  กรุณากรอกข้อมูลเฉพาะส่วนของท่าน
                  และตรวจสอบข้อมูลก่อนดำเนินส่งข้อมูล
                </div>
              </div>
            </div>

            <div className="w-full border-stroke dark:border-strokedark xl:w-1/2 xl:border-l-2">
              <div className="w-full p-4 sm:p-12.5 xl:p-17.5">
                <h2 className="mb-9 text-2xl font-bold text-black dark:text-white sm:text-title-xl2">
                  {EDITMODE ? "อัพเดทรายการ" : "สร้างรายการใหม่"}
                </h2>

                <div className="flex justify-center text-black">
                  <form
                    onSubmit={handleSubmit}
                    method="post"
                    encType="multipart/form-data"
                  >
                    {/* ส่วนของปีงบประมาณ */}
                    <div>
                      <label className="text-dark mb-[10px] block text-base font-medium dark:text-white">
                        ปีงบประมาณ
                      </label>
                      <select
                        id="year"
                        name="year"
                        type="text"
                        onChange={handleChange}
                        value={formData.year}
                        className="dark:border-dark-3 text-dark-6 relative z-20 w-full appearance-none rounded-lg border border-stroke bg-transparent px-5 py-[10px] outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-gray-2"
                      >
                        <option value="2567" className="dark:bg-dark-2">
                          2567
                        </option>
                        <option value="2568" className="dark:bg-dark-2">
                          2568
                        </option>
                        <option value="2569" className="dark:bg-dark-2">
                          2569
                        </option>
                        <option value="2570" className="dark:bg-dark-2">
                          2570
                        </option>
                      </select>
                    </div>

                    {/* ส่วนของชื่อฝ่าย */}
                    <div className="pt-6">
                      <label className="text-dark mb-[10px] block text-base font-medium dark:text-white">
                        ชื่อฝ่าย
                      </label>
                      <input
                        id="department"
                        name="department"
                        placeholder="ฝ่ายแผนงานและความร่วมมือ"
                        disabled
                        type="text"
                        onChange={handleChange}
                        required={true}
                        value={formData.department}
                        className="w-full rounded-lg border border-stroke bg-transparent py-4 pl-6 pr-10 text-black outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                      />
                    </div>

                    {/* ส่วนของชื่องาน */}
                    <div className="pt-6">
                      <label className="mb-2.5 block font-medium text-black dark:text-white">
                        ชื่องาน
                      </label>
                      <input
                        id="namework"
                        name="namework"
                        placeholder="กรุณากรอกข้อมูล"
                        type="text"
                        onChange={handleChange}
                        required={true}
                        value={formData.namework}
                        className="w-full rounded-lg border border-stroke bg-transparent py-4 pl-6 pr-10 text-black outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                      />
                    </div>

                    {/* ส่วนของชื่อโครงการ */}
                    <div className="pt-6">
                      <label className="mb-2.5 block font-medium text-black dark:text-white">
                        ชื่อโครงการ
                      </label>
                      <input
                        id="nameproject"
                        name="nameproject"
                        type="text"
                        placeholder="กรุณากรอกข้อมูล"
                        onChange={handleChange}
                        required={true}
                        value={formData.nameproject}
                        className="w-full rounded-lg border border-stroke bg-transparent py-4 pl-6 pr-10 text-black outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                      />
                    </div>

                    {/* 🛠️ ส่วนจัดการไฟล์ PDF ที่ลบ 'required' ออกแล้ว */}
                    <div className="pt-6">
                      <label className="mb-2.5 block font-medium text-black dark:text-white">
                        แนบไฟล์ PDF
                      </label>

                      {/* แสดงไฟล์ที่แนบอยู่ (ไฟล์ใหม่ที่เลือก หรือ ไฟล์เดิมจาก DB) */}
                      {hasAttachment ? (
                        <div className="flex items-center justify-between rounded-lg border border-primary bg-primary/10 p-4 text-black dark:text-white">
                          <div className="flex flex-col">
                            <p className="font-semibold">
                              📎{" "}
                              {formData.originalFileName ||
                                (formData.filepdf ? formData.filepdf.name : "")}
                            </p>
                            {/* ปุ่มดาวน์โหลดสำหรับไฟล์เดิม */}
                            {formData.fileUrl && (
                              <a
                                href={formData.fileUrl}
                                download={
                                  formData.originalFileName || "download.pdf"
                                }
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-sm text-blue-600 underline hover:text-blue-800"
                              >
                                ดาวน์โหลดไฟล์เดิม
                              </a>
                            )}
                          </div>
                          <button
                            type="button"
                            onClick={handleRemoveAttachment}
                            className="ml-4 rounded-full bg-red-500 px-3 py-1 text-sm font-medium text-white hover:bg-red-600"
                          >
                            ลบไฟล์
                          </button>
                        </div>
                      ) : (
                        <input
                          id="filepdf"
                          name="filepdf"
                          type="file"
                          accept="application/pdf"
                          onChange={handleFileChange}
                          // ❌ ลบ required ออกตามคำขอ
                          className="w-full rounded-lg border border-stroke bg-transparent py-3 pl-6 pr-10 text-black outline-none focus:border-primary dark:border-form-strokedark dark:bg-form-input dark:text-white"
                        />
                      )}
                    </div>
                    {/* ---------------------------------------------------- */}

                    {/* ⭐️ Checkbox ที่แก้ไขให้ใช้ 'checked' แทน 'default' */}
                    <div className="form-check pt-4 text-black dark:text-white">
                      <input
                        id="id1"
                        name="id1"
                        type="checkbox"
                        className="form-check-input"
                        onChange={handleChange}
                        value="1. บันทึกข้อความขออนุมัติโครงการ ✅"
                        checked={!!formData.id1}
                      />
                      <label
                        className="form-check-label pl-2 pt-4"
                        htmlFor="id1"
                      >
                        1. บันทึกข้อความขออนุมัติโครงการ
                      </label>
                    </div>
                    <div className="form-check pt-4 text-black dark:text-white">
                      <input
                        id="id2"
                        name="id2"
                        type="checkbox"
                        className="form-check-input"
                        onChange={handleChange}
                        value="2. บันทึกข้อความขออนุญาติดำเนินโครงการ ✅"
                        checked={!!formData.id2}
                      />
                      <label className="pl-2 pt-4" htmlFor="id2">
                        2. บันทึกข้อความขออนุญาติดำเนินโครงการ
                      </label>
                    </div>
                    <div className="form-check pt-4 text-black dark:text-white">
                      <input
                        id="id3"
                        name="id3"
                        type="checkbox"
                        className="form-check-input"
                        onChange={handleChange}
                        value="3. โครงการ ที่ผู้บริหารลงนามแล้ว ✅"
                        checked={!!formData.id3}
                      />
                      <label className="pl-2 pt-4" htmlFor="id3">
                        3. โครงการ ที่ผู้บริหารลงนามแล้ว
                      </label>
                    </div>
                    <div className="form-check pt-4 text-black dark:text-white">
                      <input
                        id="id4"
                        name="id4"
                        type="checkbox"
                        className="form-check-input"
                        onChange={handleChange}
                        value="4. บันทึกขออนุมัติคำสั่ง ✅"
                        checked={!!formData.id4}
                      />
                      <label className="pl-2 pt-4" htmlFor="id4">
                        4. บันทึกขออนุมัติคำสั่ง
                      </label>
                    </div>
                    <div className="form-check pt-4 text-black dark:text-white">
                      <input
                        id="id5"
                        name="id5"
                        type="checkbox"
                        className="form-check-input"
                        onChange={handleChange}
                        value="5. คำสั่งแต่งตั้งคณะกรรมการดำเนินงาน ✅"
                        checked={!!formData.id5}
                      />
                      <label className="pl-2 pt-4" htmlFor="id5">
                        5. คำสั่งแต่งตั้งคณะกรรมการดำเนินงาน
                      </label>
                    </div>
                    <div className="form-check pt-4 text-black dark:text-white">
                      <input
                        id="id6"
                        name="id6"
                        type="checkbox"
                        className="form-check-input"
                        onChange={handleChange}
                        value="6. บันทึกข้อความขออนุญาตประชุม ✅"
                        checked={!!formData.id6}
                      />
                      <label className="pl-2 pt-4" htmlFor="id6">
                        6. บันทึกข้อความขออนุญาตประชุม
                      </label>
                    </div>
                    <div className="form-check pt-4 text-black dark:text-white">
                      <input
                        id="id7"
                        name="id7"
                        type="checkbox"
                        className="form-check-input"
                        onChange={handleChange}
                        value="7. บันทึกข้อความขอเชิญประชุม ✅"
                        checked={!!formData.id7}
                      />
                      <label className="pl-2 pt-4" htmlFor="id7">
                        7. บันทึกข้อความขอเชิญประชุม
                      </label>
                    </div>
                    <div className="form-check pt-4 text-black dark:text-white">
                      <input
                        id="id8"
                        name="id8"
                        type="checkbox"
                        className="form-check-input"
                        onChange={handleChange}
                        value="8. บันทึกข้อความขอรายงานการประชุม ✅"
                        checked={!!formData.id8}
                      />
                      <label className="pl-2 pt-4" htmlFor="id8">
                        8. บันทึกข้อความขอรายงานการประชุม
                      </label>
                    </div>
                    <div className="form-check pt-4 text-black dark:text-white">
                      <input
                        id="id9"
                        name="id9"
                        type="checkbox"
                        className="form-check-input"
                        onChange={handleChange}
                        value="9. บันทึกข้อความขอความอนุเคราะห์ประชาสัมพันธ์โครงการ ✅"
                        checked={!!formData.id9}
                      />
                      <label className="pl-2 pt-4" htmlFor="id9">
                        9. บันทึกข้อความขอความอนุเคราะห์ประชาสัมพันธ์โครงการ
                      </label>
                    </div>
                    <div className="form-check pt-4 text-black dark:text-white">
                      <input
                        id="id10"
                        name="id10"
                        type="checkbox"
                        className="form-check-input"
                        onChange={handleChange}
                        value="10. บันทึกข้อความรายงานการประชาสัมพันธ์โครงการ ✅"
                        checked={!!formData.id10}
                      />
                      <label className="pl-2 pt-4" htmlFor="id10">
                        10. บันทึกข้อความรายงานการประชาสัมพันธ์โครงการ
                      </label>
                    </div>
                    <div className="form-check pt-4 text-black dark:text-white">
                      <input
                        id="id11"
                        name="id11"
                        type="checkbox"
                        className="form-check-input"
                        onChange={handleChange}
                        value="11. กำหนดการจัดกิจกรรม ✅"
                        checked={!!formData.id11}
                      />
                      <label className="pl-2 pt-4" htmlFor="id11">
                        11. กำหนดการจัดกิจกรรม
                      </label>
                    </div>
                    <div className="form-check pt-4 text-black dark:text-white">
                      <input
                        id="id12"
                        name="id12"
                        type="checkbox"
                        className="form-check-input"
                        onChange={handleChange}
                        value="12. หนังสือเชิญเป็นวิทยากร/หนังสือตอบรับเป็นวิทยากร/หนังสือขอบคุณวิทยากร ✅"
                        checked={!!formData.id12}
                      />
                      <label className="pl-2 pt-4" htmlFor="id12">
                        12.
                        หนังสือเชิญเป็นวิทยากร/หนังสือตอบรับเป็นวิทยากร/หนังสือขอบคุณวิทยากร
                      </label>
                    </div>
                    <div className="form-check pt-4 text-black dark:text-white">
                      <input
                        id="id13"
                        name="id13"
                        type="checkbox"
                        className="form-check-input"
                        onChange={handleChange}
                        value="13. ลายมือชื่อผู้เข้าร่วมโครงการ ✅"
                        checked={!!formData.id13}
                      />
                      <label className="pl-2 pt-4" htmlFor="id13">
                        13. ลายมือชื่อผู้เข้าร่วมโครงการ
                      </label>
                    </div>
                    <div className="form-check pt-4 text-black dark:text-white">
                      <input
                        id="id14"
                        name="id14"
                        type="checkbox"
                        className="form-check-input"
                        onChange={handleChange}
                        value="14. รูปภาพการดำเนินงานโครงการ ✅"
                        checked={!!formData.id14}
                      />
                      <label className="pl-2 pt-4" htmlFor="id14">
                        14. รูปภาพการดำเนินงานโครงการ
                      </label>
                    </div>
                    <div className="form-check pt-4 text-black dark:text-white">
                      <input
                        id="id15"
                        name="id15"
                        type="checkbox"
                        className="form-check-input"
                        onChange={handleChange}
                        value="15. บันทึกข้อความรายงานสรุปการใช้งบประมาณ ✅"
                        checked={!!formData.id15}
                      />
                      <label className="pl-2 pt-4" htmlFor="id15">
                        15. บันทึกข้อความรายงานสรุปการใช้งบประมาณ
                      </label>
                    </div>
                    <div className="form-check pt-4 text-black dark:text-white">
                      <input
                        id="id16"
                        name="id16"
                        type="checkbox"
                        className="form-check-input"
                        onChange={handleChange}
                        value="16. เอกสารชุดเบิกโครงการ ✅"
                        checked={!!formData.id16}
                      />
                      <label className="pl-2 pt-4" htmlFor="id16">
                        16. เอกสารชุดเบิกโครงการ
                      </label>
                    </div>
                    <div className="form-check pt-4 text-black dark:text-white">
                      <input
                        id="id17"
                        name="id17"
                        type="checkbox"
                        className="form-check-input"
                        onChange={handleChange}
                        value="17. แบบสอบถามประเมินความพึงพอใจผู้เข้าร่วมโครงการ Google from / QR Code ✅"
                        checked={!!formData.id17}
                      />
                      <label className="pl-2 pt-4" htmlFor="id17">
                        17. แบบสอบถามประเมินความพึงพอใจผู้เข้าร่วมโครงการ Google
                        from / QR Code
                      </label>
                    </div>
                    <div className="form-check pt-4 text-black dark:text-white">
                      <input
                        id="id18"
                        name="id18"
                        type="checkbox"
                        className="form-check-input"
                        onChange={handleChange}
                        value="18. บันทึกข้อความรายงานสรุปผลการวิเคราะห์ข้อมูลการดำเนินโครงการ ✅"
                        checked={!!formData.id18}
                      />
                      <label className="pl-2 pt-4" htmlFor="id18">
                        18.
                        บันทึกข้อความรายงานสรุปผลการวิเคราะห์ข้อมูลการดำเนินโครงการ
                      </label>
                    </div>
                    <div className="form-check pt-4 text-black dark:text-white">
                      <input
                        id="id19"
                        name="id19"
                        type="checkbox"
                        className="form-check-input"
                        onChange={handleChange}
                        value="19. ผลการวิเคราะห์ข้อมูล ✅"
                        checked={!!formData.id19}
                      />
                      <label className="pl-2 pt-4" htmlFor="id19">
                        19. ผลการวิเคราะห์ข้อมูล
                      </label>
                    </div>
                    <div className="form-check pt-4 text-black dark:text-white">
                      <input
                        id="id20"
                        name="id20"
                        type="checkbox"
                        className="form-check-input"
                        onChange={handleChange}
                        value="20. บันทึกกข้อความรายงานสรุปผลการดำเนินโครงการ ✅"
                        checked={!!formData.id20}
                      />
                      <label className="pl-2 pt-4" htmlFor="id20">
                        20. บันทึกกข้อความรายงานสรุปผลการดำเนินโครงการ
                      </label>
                    </div>

                    <div className="flex justify-center pt-4">
                      <input
                        type="submit"
                        className="w-full cursor-pointer rounded-lg border border-primary bg-primary p-4 text-white transition hover:bg-opacity-90"
                        value={EDITMODE ? "Updated" : "Created"}
                      />
                    </div>
                    <div className="flex justify-center pt-4">
                      <Link
                        href="/"
                        className="w-full cursor-pointer rounded-lg border p-4 text-center text-black transition hover:bg-opacity-90 dark:text-white"
                      >
                        Close
                      </Link>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </DefaultLayout>
    </>
  );
};

export default EditResourceForm;
