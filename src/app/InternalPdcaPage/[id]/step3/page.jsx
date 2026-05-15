import Step3Form from "@/app/(components)/Step3Form";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import ProjectApproval from "@/app/models/ProjectApproval";
import { connectDB } from "@/app/models/InternalPdca";

const getStep3Data = async (projectId) => {
  try {
    await connectDB();
    const data = await ProjectApproval.findOne({ projectId });
    return JSON.parse(JSON.stringify(data || {}));
  } catch (error) {
    return {};
  }
};

const Step3Page = async ({ params }) => {
  const { id } = await params;
  const initialData = await getStep3Data(id);

  return (
    <DefaultLayout>
      <Breadcrumb pageName="แบบฟอร์มขออนุมัติโครงการ (ขั้นตอนที่ 3)" />
      <div className="mx-auto max-w-5xl">
        <Step3Form projectId={id} initialData={initialData} />
      </div>
    </DefaultLayout>
  );
};

export default Step3Page;
