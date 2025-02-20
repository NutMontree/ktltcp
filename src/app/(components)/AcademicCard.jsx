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
    <div className="hover:bg-card-hover bg-card m-2 flex flex-col border border-stroke bg-white p-3 px-7.5 py-6 shadow-default dark:border-strokedark dark:bg-boxdark">
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
        <div className="pt-1">ชื่องาน : {academic.namework}</div>
        <div className="pt-1">ชื่อโครงการ : {academic.nameproject}</div>
        <div className="pt-1">{academic.id1}</div>
        <div className="pt-1">{academic.id2}</div>
        <div className="pt-1">{academic.id3}</div>
        <div className="pt-1">{academic.id4}</div>
        <div className="pt-1">{academic.id5}</div>
        <div className="pt-1">{academic.id6}</div>
        <div className="pt-1">{academic.id7}</div>
        <div className="pt-1">{academic.id8}</div>
        <div className="pt-1">{academic.id9}</div>
        <div className="pt-1">{academic.id10}</div>
        <div className="pt-1">{academic.id11}</div>
        <div className="pt-1">{academic.id12}</div>
        <div className="pt-1">{academic.id13}</div>
        <div className="pt-1">{academic.id14}</div>
        <div className="pt-1">{academic.id15}</div>
        <div className="pt-1">{academic.id16}</div>
        <div className="pt-1">{academic.id17}</div>
        <div className="pt-1">{academic.id18}</div>
        <div className="pt-1">{academic.id19}</div>
        <div className="pt-1">{academic.id20}</div>
        <div className="mt-2 flex">
          <div className="flex flex-col">
            <div className="my-1 text-xs">
              วันที่กรอกข้อมูล: {createdDateTime}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AcademicCard;
