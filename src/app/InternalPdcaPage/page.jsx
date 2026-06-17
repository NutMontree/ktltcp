export const dynamic = 'force-dynamic';

import InternalPdca, { connectDB } from "@/app/models/InternalPdca";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import Link from "next/link";

import DeleteInternalPdca from "@/app/(components)/DeleteInternalPdca";

const getInternalPdcas = async () => {
  try {
    await connectDB();
    const data = await InternalPdca.find().sort({ createdAt: -1 });
    return JSON.parse(JSON.stringify(data));
  } catch (error) {
    return [];
  }
};

const InternalPdcaDashboard = async () => {
  const pdcas = await getInternalPdcas();

  return (
    <DefaultLayout>
      <Breadcrumb pageName="จัดการเอกสารภายใน (11 ขั้นตอน)" />
      
      <div className="mb-6 flex justify-end">
        <Link 
          href="/InternalPdcaPage/new" 
          className="bg-primary text-white px-6 py-3 rounded-xl font-bold shadow-lg hover:bg-opacity-90"
        >
          + เพิ่มเอกสารใหม่
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {pdcas.map((item) => (
          <div key={item._id} className="bg-white dark:bg-boxdark p-6 rounded-2xl shadow-sm border border-stroke dark:border-strokedark">
            <div className="flex justify-between items-start mb-4">
              <span className="bg-primary/10 text-primary text-xs font-bold px-3 py-1 rounded-full">
                ปี {item.year}
              </span>
              <div className="flex gap-3">
                <Link href={`/InternalPdcaPage/${item._id}`} className="text-blue-500 hover:underline text-sm font-bold">แก้ไข</Link>
                <DeleteInternalPdca id={item._id} />
              </div>
            </div>
            <h3 className="text-lg font-black text-black dark:text-white mb-2 line-clamp-2">{item.nameproject}</h3>
            <p className="text-sm text-gray-500 mb-4">{item.department}</p>
            
            <div className="border-t pt-4 flex justify-between items-center">
               <span className="text-xs text-gray-400">อัปเดตเมื่อ: {new Date(item.updatedAt).toLocaleDateString("th-TH")}</span>
               <div className="flex -space-x-2">
                  {/* Progress or other indicators */}
               </div>
            </div>
          </div>
        ))}
        {pdcas.length === 0 && (
          <div className="col-span-full py-20 text-center bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200">
            <p className="text-gray-400 font-bold">ยังไม่มีข้อมูลเอกสารภายใน</p>
          </div>
        )}
      </div>
    </DefaultLayout>
  );
};

export default InternalPdcaDashboard;
