import InternalStep12Form from "@/app/(components)/InternalStep12Form";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import InternalStep12 from "@/app/models/InternalStep12";
import { connectDB } from "@/app/models/InternalPdca";

const getMemoData = async (projectId) => {
  try {
    await connectDB();
    const data = await InternalStep12.findOne({ projectId });
    return JSON.parse(JSON.stringify(data || {}));
  } catch (error) {
    return {};
  }
};

const Step12Page = async ({ params }) => {
  const { id } = await params;
  const initialData = await getMemoData(id);

  return (
    <DefaultLayout>
      <Breadcrumb pageName="กำหนดการจัดกิจกรรม" />
      <div className="mx-auto max-w-5xl">
        <InternalStep12Form projectId={id} initialData={initialData} />
      </div>
    </DefaultLayout>
  );
};

export default Step12Page;
