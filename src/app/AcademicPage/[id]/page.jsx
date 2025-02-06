import EditAcademicForm from "@/app/(components)/EditAcademicForm";
const getUserById = async (id) => {
  try {
    const res = await fetch(`http://localhost:3000/api/Academics/${id}`, {
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

let updateAcademicData = {};
const AcademicPage = async ({ params }) => {
  const EDITMODE = params.id === "new" ? false : true;

  if (EDITMODE) {
    updateAcademicData = await getUserById(params.id);
    updateAcademicData = updateAcademicData.foundAcademic;
  } else {
    updateAcademicData = {
      _id: "new",
    };
  }

  return <EditAcademicForm academic={updateAcademicData} />;
};

export default AcademicPage;
