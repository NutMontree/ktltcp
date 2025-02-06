import EditPdcaForm from "@/app/(components)/EditPdcaForm";
const getUserById = async (id) => {
  try {
    const res = await fetch(`https://ktltcp.vercel.app/api/Pdcas/${id}`, {
      cache: "no-store",
    });

    if (!res.ok) {
      throw new Error("Failed to fetch topic");
    }

    return res.json();
  } catch (error) {
    console.log(error);
  }
};

let updatePdcaData = {};
const PdcaPage = async ({ params }) => {
  const EDITMODE = params.id === "new" ? false : true;

  if (EDITMODE) {
    updatePdcaData = await getUserById(params.id);
    updatePdcaData = updatePdcaData.foundPdca;
  } else {
    updatePdcaData = {
      _id: "new",
    };
  }

  return <EditPdcaForm pdca={updatePdcaData} />;
};

export default PdcaPage;
