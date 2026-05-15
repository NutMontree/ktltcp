import EditInternalPdcaForm from "@/app/(components)/EditInternalPdcaForm";
import InternalPdca, { connectDB } from "@/app/models/InternalPdca";
import InternalFormConfig from "@/app/models/InternalFormConfig";

const getInternalPdcaById = async (id) => {
  try {
    await connectDB();
    if (id === "new") return {};
    const data = await InternalPdca.findById(id);
    return JSON.parse(JSON.stringify(data || {}));
  } catch (error) {
    return {};
  }
};

const getInternalFormConfig = async () => {
  try {
    await connectDB();
    let config = await InternalFormConfig.findOne({ type: "internal_pdca_form" });
    return JSON.parse(JSON.stringify(config));
  } catch (error) {
    return null;
  }
};

const InternalPdcaPage = async ({ params }) => {
  const { id } = await params;
  const pdca = await getInternalPdcaById(id);
  const config = await getInternalFormConfig();

  return (
    <EditInternalPdcaForm 
      pdca={pdca} 
      pdcaItems={config?.pdcaItems || []} 
      departments={config?.departments || []}
      fiscalYears={config?.fiscalYears || []}
    />
  );
};

export default InternalPdcaPage;
