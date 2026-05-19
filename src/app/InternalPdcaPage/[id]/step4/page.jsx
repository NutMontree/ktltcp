import InternalStep4Form from "@/app/(components)/InternalStep4Form";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import InternalStep4 from "@/app/models/InternalStep4";
import { connectDB } from "@/app/models/InternalPdca";

const getStep4Data = async (projectId) => {
  try {
    await connectDB();
    const data = await InternalStep4.findOne({ projectId });
    return JSON.parse(JSON.stringify(data || {}));
  } catch (error) {
    return {};
  }
};

const Step4Page = async ({ params }) => {
  const { id } = await params;
  const initialData = await getStep4Data(id);

  return (
    <DefaultLayout>
      <Breadcrumb pageName="4. บันทึกขออนุมัติคำสั่งแต่งตั้งคณะกรรมการดำเนินงาน" />
      <div className="mx-auto max-w-5xl">
        <InternalStep4Form projectId={id} initialData={initialData} />
      </div>
    </DefaultLayout>
  );
};

export default Step4Page;
