import React from "react";
import DevdepartmentCard from "@/app/(components)/DevdepartmentCard";

const getDevdepartments = async () => {
  try {
    const res = await fetch(`https://ktltcp.vercel.app/api/Devdepartments`, {
      cache: "no-store",
    });

    if (!res.ok) {
      throw new Error("Failed to fetch topics");
    }

    return res.json();
  } catch (error) {
    console.log("Error loading topics: ", error);
  }
};

const Devdepartment = async () => {
  const data = await getDevdepartments();

  if (!data?.devdepartments) {
    return <div>No devdepartment.</div>;
  }

  const devdepartments = data.devdepartments;

  const uniqueDepartments = [
    ...new Set(devdepartments?.map(({ department }) => department)),
  ];

  return (
    <>
      <div className="bg-page text-default-text flex-grow overflow-y-auto p-5">
        <div>
          {devdepartments &&
            uniqueDepartments?.map((uniqueDepartment, departmentIndex) => (
              <div key={departmentIndex} className="mb-4">
                <h2>{uniqueDepartment}</h2>
                <div className="grid-cols-2 lg:grid xl:grid-cols-3">
                  {devdepartments
                    .filter(
                      (devdepartment) =>
                        devdepartment.department === uniqueDepartment,
                    )
                    .map((filteredDevdepartment, _index) => (
                      <DevdepartmentCard
                        id={_index}
                        key={_index}
                        devdepartment={filteredDevdepartment}
                      />
                    ))}
                </div>
              </div>
            ))}
        </div>
      </div>
    </>
  );
};

export default Devdepartment;
