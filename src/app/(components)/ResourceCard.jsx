import DeleteResource from "./DeleteResource";
import Link from "next/link";

const ResourceCard = ({ resource }) => {
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
  const createdDateTime = formatTimestamp(resource.createdAt);

  return (
    <div className="hover:bg-card-hover bg-card m-2 flex flex-col border border-stroke bg-white p-3 px-7.5 py-6 shadow-default dark:border-strokedark dark:bg-boxdark">
      <div className="ml-auto flex gap-4">
        <div className="">
          <Link
            href={`/ResourcePage/${resource._id}`}
            style={{ display: "contents" }}
          >
            ✏️
          </Link>
        </div>
        <div className="">
          <DeleteResource id={resource._id} />
        </div>
      </div>
      <div
        className=""
        href={`/ProfileResource/${resource._id}`}
        style={{ display: "contents" }}
      >
        <hr className="bg-page mb-2 h-px border-0"></hr>{" "}
        <div className="pt-1">ปีงบประมาณ : {resource.year}</div>
        <div className="pt-1">ชื่องาน : {resource.namework}</div>
        <div className="pt-1">ชื่อโครงการ : {resource.nameproject}</div>
        <div className="pt-1">{resource.id1}</div>
        <div className="pt-1">{resource.id2}</div>
        <div className="pt-1">{resource.id3}</div>
        <div className="pt-1">{resource.id4}</div>
        <div className="pt-1">{resource.id5}</div>
        <div className="pt-1">{resource.id6}</div>
        <div className="pt-1">{resource.id7}</div>
        <div className="pt-1">{resource.id8}</div>
        <div className="pt-1">{resource.id9}</div>
        <div className="pt-1">{resource.id10}</div>
        <div className="pt-1">{resource.id11}</div>
        <div className="pt-1">{resource.id12}</div>
        <div className="pt-1">{resource.id13}</div>
        <div className="pt-1">{resource.id14}</div>
        <div className="pt-1">{resource.id15}</div>
        <div className="pt-1">{resource.id16}</div>
        <div className="pt-1">{resource.id17}</div>
        <div className="pt-1">{resource.id18}</div>
        <div className="pt-1">{resource.id19}</div>
        <div className="pt-1">{resource.id20}</div>
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

export default ResourceCard;
