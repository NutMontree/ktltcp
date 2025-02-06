import React from "react";
import AcademicCard from "@/app/(components)/AcademicCard";

const getAcademics = async () => {
  try {
    const res = await fetch(`http://localhost:3000/api/Academics`, {
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

const Academic = async () => {
  const data = await getAcademics();

  if (!data?.academics) {
    return <p>No academic.</p>;
  }

  const academics = data.academics;

  const uniqueDepartments = [
    ...new Set(academics?.map(({ department }) => department)),
  ];

  return (
    <>
      <div className="bg-page text-default-text flex-grow overflow-y-auto p-5">
        <div>
          {academics &&
            uniqueDepartments?.map((uniqueDepartment, departmentIndex) => (
              <div key={departmentIndex} className="mb-4">
                <h2>{uniqueDepartment}</h2>
                <div className="grid-cols-2 lg:grid xl:grid-cols-3">
                  {academics
                    .filter(
                      (academic) => academic.department === uniqueDepartment,
                    )
                    .map((filteredAcademic, _index) => (
                      <AcademicCard
                        id={_index}
                        key={_index}
                        academic={filteredAcademic}
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

export default Academic;
