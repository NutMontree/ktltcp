import InternalStep11Form from "@/app/(components)/InternalStep11Form";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import InternalStep11 from "@/app/models/InternalStep11";
import { connectDB } from "@/app/models/InternalPdca";

const getMemoData = async (projectId) => {
  try {
    await connectDB();
    const data = await InternalStep11.findOne({ projectId });
    return JSON.parse(JSON.stringify(data || {}));
  } catch (error) {
    return {};
  }
};

const Step11Page = async ({ params }) => {
  const { id } = await params;
  const initialData = await getMemoData(id);

  return (
    <DefaultLayout>
      <Breadcrumb pageName="รายงานการประชาสัมพันธ์โครงการ" />
      <div className="mx-auto max-w-5xl">
        <InternalStep11Form projectId={id} initialData={initialData} />
      </div>
    </DefaultLayout>
  );
};

export default Step11Page;
