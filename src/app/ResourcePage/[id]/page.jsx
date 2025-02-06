import EditResourceForm from "@/app/(components)/EditResourceForm";
const getUserById = async (id) => {
  try {
    const res = await fetch(`http://localhost:3000/api/Resources/${id}`, {
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

let updateResourceData = {};
const ResourcePage = async ({ params }) => {
  const EDITMODE = params.id === "new" ? false : true;

  if (EDITMODE) {
    updateResourceData = await getUserById(params.id);
    updateResourceData = updateResourceData.foundResource;
  } else {
    updateResourceData = {
      _id: "new",
    };
  }

  return <EditResourceForm resource={updateResourceData} />;
};

export default ResourcePage;
