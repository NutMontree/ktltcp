import React from "react";
import ResourceCard from "@/app/(components)/ResourceCard";

const getResources = async () => {
  try {
    const res = await fetch(`https://ktltcp.vercel.app/api/Resources`, {
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

const Resource = async () => {
  const data = await getResources();

  if (!data?.resources) {
    return <div>No resource.</div>;
  }

  const resources = data.resources;

  const uniqueDepartments = [
    ...new Set(resources?.map(({ department }) => department)),
  ];

  return (
    <>
      <div className="bg-page text-default-text flex-grow overflow-y-auto p-5">
        <div>
          {resources &&
            uniqueDepartments?.map((uniqueDepartment, departmentIndex) => (
              <div key={departmentIndex} className="mb-4">
                <h2>{uniqueDepartment}</h2>
                <div className="grid-cols-2 lg:grid xl:grid-cols-3">
                  {resources
                    .filter(
                      (resource) => resource.department === uniqueDepartment,
                    )
                    .map((filteredResource, _index) => (
                      <ResourceCard
                        id={_index}
                        key={_index}
                        resource={filteredResource}
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

export default Resource;
