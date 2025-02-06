import DeleteAcademic from "./DeleteAcademic";
import Link from "next/link";

const AcademicCard = ({ academic }) => {
  // สร้างวันเวลาอัตโนมัติ
  function formatTimestamp(timestamp) {
    const options = {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    };

    const date = new Date(timestamp);
    const formattedDate = date.toLocaleString("en-US", options);

    return formattedDate;
  }
  // สร้างวันเวลาอัตโนมัติ
  const createdDateTime = formatTimestamp(academic.createdAt);

  return (
    <div className="hover:bg-card-hover bg-card m-2 flex flex-col border border-stroke bg-white p-3 px-7.5 py-6 shadow-default  dark:border-strokedark dark:bg-boxdark">
      <div className="ml-auto flex gap-4">
        <div className="">
          <Link
            href={`/AcademicPage/${academic._id}`}
            style={{ display: "contents" }}
          >
            ✏️
          </Link>
        </div>
        <div className="">
          <DeleteAcademic id={academic._id} />
        </div>
      </div>
      <div
        className=""
        href={`/ProfileAcademic/${academic._id}`}
        style={{ display: "contents" }}
      >
        <hr className="bg-page mb-2 h-px border-0"></hr>
        <p className="pt-1">ชื่องาน : {academic.namework}</p>
        <p className="pt-1">ชื่อโครงการ : {academic.nameproject}</p>
        <p className="pt-1">{academic.id1}</p>
        <p className="pt-1">{academic.id2}</p>
        <p className="pt-1">{academic.id3}</p>
        <p className="pt-1">{academic.id4}</p>
        <p className="pt-1">{academic.id5}</p>
        <p className="pt-1">{academic.id6}</p>
        <p className="pt-1">{academic.id7}</p>
        <p className="pt-1">{academic.id8}</p>
        <p className="pt-1">{academic.id9}</p>
        <p className="pt-1">{academic.id10}</p>
        <p className="pt-1">{academic.id11}</p>
        <p className="pt-1">{academic.id12}</p>
        <p className="pt-1">{academic.id13}</p>
        <p className="pt-1">{academic.id14}</p>
        <p className="pt-1">{academic.id15}</p>
        <p className="pt-1">{academic.id16}</p>
        <p className="pt-1">{academic.id17}</p>
        <p className="pt-1">{academic.id18}</p>
        <p className="pt-1">{academic.id19}</p>
        <p className="pt-1">{academic.id20}</p>
        <div className="mt-2 flex">
          <div className="flex flex-col">
            <p className="my-1 text-xs">วันที่กรอกข้อมูล: {createdDateTime}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AcademicCard;
