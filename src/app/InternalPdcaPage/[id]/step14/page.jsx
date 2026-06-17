import InternalStep14Form from "@/app/(components)/InternalStep14Form";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import InternalStep14 from "@/app/models/InternalStep14";
import { connectDB } from "@/app/models/InternalPdca";

const getMemoData = async (projectId) => {
  try {
    await connectDB();
    const data = await InternalStep14.findOne({ projectId });
    return JSON.parse(JSON.stringify(data || {}));
  } catch (error) {
    return {};
  }
};

const Step14Page = async ({ params }) => {
  const { id } = await params;
  const initialData = await getMemoData(id);

  return (
    <DefaultLayout>
      <Breadcrumb pageName="ลายมือชื่อผู้เข้าร่วมโครงการ" />
      <div className="mx-auto max-w-5xl">
        <InternalStep14Form projectId={id} initialData={initialData} />
      </div>
    </DefaultLayout>
  );
};

export default Step14Page;
