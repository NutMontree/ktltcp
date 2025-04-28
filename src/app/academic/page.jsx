import React from "react";
import AcademicCard from "@/app/(components)/AcademicCard";

const getAcademics = async () => {
  try {
    // const res = await fetch(`https://ktltcp.vercel.app/api/Academics`, {
    const res = await fetch(`https://ktltcp.vercel.app/api/Academics`, {
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
    return <div>No academic.</div>;
  }

  const academics = data.academics;

  const uniqueYears = [...new Set(academics?.map(({ year }) => year))];

  return (
    <>
      <div className="bg-page text-default-text flex-grow overflow-y-auto p-5">
        <div>
          {academics &&
            uniqueYears?.map((uniqueYear, yearIndex) => (
              <div key={yearIndex} className="mb-4">
                <h2>{uniqueYear}</h2>
                <div className="grid-cols-2 lg:grid xl:grid-cols-3">
                  {academics
                    .filter((academic) => academic.year === uniqueYear)
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
