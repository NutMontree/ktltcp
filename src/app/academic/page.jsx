import AcademicCard from "@/app/(components)/AcademicCard";

const getAcademics = async () => {
  try {
    const res = await fetch(`https://ktltcp.vercel.app/api/Academics`, {
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

const Academic = async () => {
  const data = await getAcademics();

  if (!data?.academics) {
    return <div>No academic.</div>;
  }

  const academics = data.academics;

  const uniqueYears = [...new Set(academics?.map(({ year }) => year))];

  const uniqueDepartment = [
    ...new Set(academics?.map(({ department }) => department)),
  ];

  return (
    <>
      <h1 className="text-xl font-bold text-black-2">ฝ่ายวิชาการ</h1>
      <div className="bg-page text-default-text flex-grow overflow-y-auto p-5">
        <div>
          {academics &&
            uniqueYears?.map((uniqueYear, yearIndex) => (
              <div key={yearIndex} className="mb-4">
                <h2 className="text-black-2">{uniqueYear}</h2>
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
