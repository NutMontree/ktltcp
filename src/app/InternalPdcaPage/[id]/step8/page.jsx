import InternalInviteMemoForm from "@/app/(components)/InternalInviteMemoForm";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import InternalInviteMemo from "@/app/models/InternalInviteMemo";
import { connectDB } from "@/app/models/InternalPdca";

const getMemoData = async (projectId) => {
  try {
    await connectDB();
    const data = await InternalInviteMemo.findOne({ projectId });
    return JSON.parse(JSON.stringify(data || {}));
  } catch (error) {
    return {};
  }
};

const Step7Page = async ({ params }) => {
  const { id } = await params;
  const initialData = await getMemoData(id);

  return (
    <DefaultLayout>
      <Breadcrumb pageName="แบบฟอร์มขอเชิญประชุม (Step 8)" />
      <div className="mx-auto max-w-5xl">
        <InternalInviteMemoForm projectId={id} initialData={initialData} />
      </div>
    </DefaultLayout>
  );
};

export default Step7Page;
