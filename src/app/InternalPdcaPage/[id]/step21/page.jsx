import InternalStep21Form from "@/app/(components)/InternalStep21Form";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import InternalStep21 from "@/app/models/InternalStep21";
import { connectDB } from "@/app/models/InternalPdca";

const getMemoData = async (projectId) => {
  try {
    await connectDB();
    const data = await InternalStep21.findOne({ projectId });
    return JSON.parse(JSON.stringify(data || {}));
  } catch (error) {
    return {};
  }
};

const Step21Page = async ({ params }) => {
  const { id } = await params;
  const initialData = await getMemoData(id);

  return (
    <DefaultLayout>
      <Breadcrumb pageName="รายงานสรุปผลการดำเนินโครงการ" />
      <div className="mx-auto max-w-5xl">
        <InternalStep21Form projectId={id} initialData={initialData} />
      </div>
    </DefaultLayout>
  );
};

export default Step21Page;
