import EditPdcaForm from "@/app/(components)/EditPdcaForm";
const getPdcaById = async (id) => {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
    const res = await fetch(`${baseUrl}/api/Pdcas/${id}`, {
      cache: "no-store",
    });

    if (!res.ok) {
      throw new Error("Failed to fetch PDCA");
    }

    return res.json();
  } catch (error) {
    console.error("Fetch PDCA error:", error);
    return null;
  }
};
const PdcaPage = async ({ params }) => {
  let updatePdcaData = { _id: "new" };
  const { id } = await params;
  const EDITMODE = id === "new" ? false : true;

  if (EDITMODE) {
    const data = await getPdcaById(id);
    if (data) {
      updatePdcaData = data.foundPdca;
    }
  }

  return <EditPdcaForm pdca={updatePdcaData} />;
};

export default PdcaPage;
