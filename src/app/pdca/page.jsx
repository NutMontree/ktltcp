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
    return <p>No pdca.</p>;
  }

  const pdcas = data.pdcas;

  const uniqueDepartments = [
    ...new Set(pdcas?.map(({ department }) => department)),
  ];

  return (
    <>
      <div className="bg-page text-default-text flex-grow overflow-y-auto p-5">
        <div>
          {pdcas &&
            uniqueDepartments?.map((uniqueDepartment, departmentIndex) => (
              <div key={departmentIndex} className="mb-4">
                <h2>{uniqueDepartment}</h2>
                <div className="grid-cols-2 lg:grid xl:grid-cols-3">
                  {pdcas
                    .filter((pdca) => pdca.department === uniqueDepartment)
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
