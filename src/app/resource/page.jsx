import React from "react";
import ResourceCard from "@/app/(components)/ResourceCard";

const getResources = async () => {
  try {
    const res = await fetch(`https://ktltcp.vercel.app/api/Resources`, {
      //`http://localhost:3000
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

  const uniqueYears = [...new Set(resources?.map(({ year }) => year))];

  return (
    <>
      <h1 className="text-xl font-bold text-black-2">ฝ่ายบริหารทรัพยากร</h1>
      <div className="bg-page text-default-text flex-grow overflow-y-auto p-5">
        <div>
          {resources &&
            uniqueYears?.map((uniqueYear, yearIndex) => (
              <div key={yearIndex} className="mb-4">
                <h2 className="text-black-2">{uniqueYear}</h2>
                <div className="grid-cols-2 lg:grid xl:grid-cols-3">
                  {resources
                    .filter((resource) => resource.year === uniqueYear)
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
