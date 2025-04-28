import React from "react";
import PdcaCard from "@/app/(components)/PdcaCard";

const getPdcas = async () => {
  try {
    const res = await fetch(`https://ktltcp.vercel.app/api/Pdcas`, {
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

const Pdca = async () => {
  const data = await getPdcas();

  if (!data?.pdcas) {
    return <div>No pdca.</div>;
  }

  const pdcas = data.pdcas;

  const uniqueYears = [...new Set(pdcas?.map(({ year }) => year))];

  return (
    <>
      <div className="bg-page text-default-text flex-grow overflow-y-auto p-5">
        <div>
          {pdcas &&
            uniqueYears?.map((uniqueYear, yearIndex) => (
              <div key={yearIndex} className="mb-4">
                <h2>{uniqueYear}</h2>
                <div className="grid-cols-2 lg:grid xl:grid-cols-3">
                  {pdcas
                    .filter((pdca) => pdca.year === uniqueYear)
                    .map((filteredPdca, _index) => (
                      <PdcaCard id={_index} key={_index} pdca={filteredPdca} />
                    ))}
                </div>
              </div>
            ))}
        </div>
      </div>
    </>
  );
};

export default Pdca;
