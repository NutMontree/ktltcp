import PermissionForm from "@/app/(components)/PermissionForm";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import ProjectApproval from "@/app/models/ProjectApproval";
import { connectDB } from "@/app/models/InternalPdca";

async function getStep2Data(projectId) {
  await connectDB();
  const data = await ProjectApproval.findOne({ projectId });
  return data ? JSON.parse(JSON.stringify(data)) : {};
}

const Step2Page = async ({ params }) => {
  const { id } = await params;
  const initialData = await getStep2Data(id);

  return (
    <DefaultLayout>
      <Breadcrumb pageName="แบบฟอร์มขออนุญาตดำเนินโครงการ (Step 2)" />
      <div className="mx-auto max-w-5xl">
        <PermissionForm projectId={id} initialData={initialData} />
      </div>
    </DefaultLayout>
  );
};

export default Step2Page;
