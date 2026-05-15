import InternalMemoForm from "@/app/(components)/InternalMemoForm";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import InternalMemo from "@/app/models/InternalMemo";
import { connectDB } from "@/app/models/InternalPdca";

const getMemoData = async (projectId) => {
  try {
    await connectDB();
    const data = await InternalMemo.findOne({ projectId });
    return JSON.parse(JSON.stringify(data || {}));
  } catch (error) {
    return {};
  }
};

const MemoPage = async ({ params }) => {
  const { id } = await params;
  const initialData = await getMemoData(id);

  return (
    <DefaultLayout>
      <Breadcrumb pageName="บันทึกข้อความ (ขั้นตอนที่ 1)" />
      <div className="mx-auto max-w-5xl">
        <InternalMemoForm projectId={id} initialData={initialData} />
      </div>
    </DefaultLayout>
  );
};

export default MemoPage;
