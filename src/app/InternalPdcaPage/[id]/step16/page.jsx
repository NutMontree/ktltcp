import InternalStep16Form from "@/app/(components)/InternalStep16Form";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import InternalStep16 from "@/app/models/InternalStep16";
import { connectDB } from "@/app/models/InternalPdca";

const getMemoData = async (projectId) => {
  try {
    await connectDB();
    const data = await InternalStep16.findOne({ projectId });
    return JSON.parse(JSON.stringify(data || {}));
  } catch (error) {
    return {};
  }
};

const Step16Page = async ({ params }) => {
  const { id } = await params;
  const initialData = await getMemoData(id);

  return (
    <DefaultLayout>
      <Breadcrumb pageName="รายงานสรุปการใช้งบประมาณ" />
      <div className="mx-auto max-w-5xl">
        <InternalStep16Form projectId={id} initialData={initialData} />
      </div>
    </DefaultLayout>
  );
};

export default Step16Page;
