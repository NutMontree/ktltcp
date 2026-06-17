import InternalStep18Form from "@/app/(components)/InternalStep18Form";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import InternalStep18 from "@/app/models/InternalStep18";
import { connectDB } from "@/app/models/InternalPdca";

const getMemoData = async (projectId) => {
  try {
    await connectDB();
    const data = await InternalStep18.findOne({ projectId });
    return JSON.parse(JSON.stringify(data || {}));
  } catch (error) {
    return {};
  }
};

const Step18Page = async ({ params }) => {
  const { id } = await params;
  const initialData = await getMemoData(id);

  return (
    <DefaultLayout>
      <Breadcrumb pageName="แบบสอบถามประเมินความพึงพอใจ" />
      <div className="mx-auto max-w-5xl">
        <InternalStep18Form projectId={id} initialData={initialData} />
      </div>
    </DefaultLayout>
  );
};

export default Step18Page;
