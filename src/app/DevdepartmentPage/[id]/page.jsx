import EditDevdepartmentForm from "@/app/(components)/EditDevdepartmentForm";
const getUserById = async (id) => {
  try {
    const res = await fetch(`http://localhost:3000/api/Devdepartments/${id}`, {
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

let updateDevdepartmentData = {};
const DevdepartmentPage = async ({ params }) => {
  const EDITMODE = params.id === "new" ? false : true;

  if (EDITMODE) {
    updateDevdepartmentData = await getUserById(params.id);
    updateDevdepartmentData = updateDevdepartmentData.foundDevdepartment;
  } else {
    updateDevdepartmentData = {
      _id: "new",
    };
  }

  return <EditDevdepartmentForm devdepartment={updateDevdepartmentData} />;
};

export default DevdepartmentPage;
