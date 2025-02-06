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
    <div className="hover:bg-card-hover bg-card m-2 flex flex-col border border-stroke bg-white p-3 px-7.5 py-6 shadow-default  dark:border-strokedark dark:bg-boxdark">
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
        <p className="pt-1">ชื่องาน : {devdepartment.namework}</p>
        <p className="pt-1">ชื่อโครงการ : {devdepartment.nameproject}</p>
        <p className="pt-1">{devdepartment.id1}</p>
        <p className="pt-1">{devdepartment.id2}</p>
        <p className="pt-1">{devdepartment.id3}</p>
        <p className="pt-1">{devdepartment.id4}</p>
        <p className="pt-1">{devdepartment.id5}</p>
        <p className="pt-1">{devdepartment.id6}</p>
        <p className="pt-1">{devdepartment.id7}</p>
        <p className="pt-1">{devdepartment.id8}</p>
        <p className="pt-1">{devdepartment.id9}</p>
        <p className="pt-1">{devdepartment.id10}</p>
        <p className="pt-1">{devdepartment.id11}</p>
        <p className="pt-1">{devdepartment.id12}</p>
        <p className="pt-1">{devdepartment.id13}</p>
        <p className="pt-1">{devdepartment.id14}</p>
        <p className="pt-1">{devdepartment.id15}</p>
        <p className="pt-1">{devdepartment.id16}</p>
        <p className="pt-1">{devdepartment.id17}</p>
        <p className="pt-1">{devdepartment.id18}</p>
        <p className="pt-1">{devdepartment.id19}</p>
        <p className="pt-1">{devdepartment.id20}</p>
        <div className="mt-2 flex">
          <div className="flex flex-col">
            <p className="my-1 text-xs">วันที่กรอกข้อมูล: {createdDateTime}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DevdepartmentCard;
