import DeleteDevdepartment from "./DeleteDevdepartment";
import Link from "next/link";

const DevdepartmentCard = ({ devdepartment }) => {
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
  const createdDateTime = formatTimestamp(devdepartment.createdAt);

  return (
    <div className="hover:bg-card-hover bg-card m-2 flex flex-col border border-stroke bg-white p-3 px-7.5 py-6 shadow-default dark:border-strokedark dark:bg-boxdark">
      <div className="ml-auto flex gap-4">
        <div className="">
          <Link
            href={`/DevdepartmentPage/${devdepartment._id}`}
            style={{ display: "contents" }}
          >
            ✏️
          </Link>
        </div>
        <div className="">
          <DeleteDevdepartment id={devdepartment._id} />
        </div>
      </div>
      <div
        className=""
        href={`/ProfileDevdepartment/${devdepartment._id}`}
        style={{ display: "contents" }}
      >
        <hr className="bg-page mb-2 h-px border-0"></hr>
        <div className="pt-1">ชื่องาน : {devdepartment.namework}</div>
        <div className="pt-1">ชื่อโครงการ : {devdepartment.nameproject}</div>
        <div className="pt-1">{devdepartment.id1}</div>
        <div className="pt-1">{devdepartment.id2}</div>
        <div className="pt-1">{devdepartment.id3}</div>
        <div className="pt-1">{devdepartment.id4}</div>
        <div className="pt-1">{devdepartment.id5}</div>
        <div className="pt-1">{devdepartment.id6}</div>
        <div className="pt-1">{devdepartment.id7}</div>
        <div className="pt-1">{devdepartment.id8}</div>
        <div className="pt-1">{devdepartment.id9}</div>
        <div className="pt-1">{devdepartment.id10}</div>
        <div className="pt-1">{devdepartment.id11}</div>
        <div className="pt-1">{devdepartment.id12}</div>
        <div className="pt-1">{devdepartment.id13}</div>
        <div className="pt-1">{devdepartment.id14}</div>
        <div className="pt-1">{devdepartment.id15}</div>
        <div className="pt-1">{devdepartment.id16}</div>
        <div className="pt-1">{devdepartment.id17}</div>
        <div className="pt-1">{devdepartment.id18}</div>
        <div className="pt-1">{devdepartment.id19}</div>
        <div className="pt-1">{devdepartment.id20}</div>
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

export default DevdepartmentCard;
