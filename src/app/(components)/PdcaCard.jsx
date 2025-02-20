import DeletePdca from "./DeletePdca";
import Link from "next/link";

const PdcaCard = ({ pdca }) => {
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
  const createdDateTime = formatTimestamp(pdca.createdAt);

  return (
    <div className="hover:bg-card-hover bg-card m-2 flex flex-col border border-stroke bg-white p-3 px-7.5 py-6 shadow-default dark:border-strokedark dark:bg-boxdark">
      <div className="ml-auto flex gap-4">
        <div className="">
          <Link href={`/PdcaPage/${pdca._id}`} style={{ display: "contents" }}>
            ✏️
          </Link>
        </div>
        <div className="">
          <DeletePdca id={pdca._id} />
        </div>
      </div>
      <div
        className=""
        href={`/ProfilePdca/${pdca._id}`}
        style={{ display: "contents" }}
      >
        <hr className="bg-page mb-2 h-px border-0"></hr>
        <div className="pt-1">ชื่องาน : {pdca.namework}</div>
        <div className="pt-1">ชื่อโครงการ : {pdca.nameproject}</div>
        <div className="pt-1">{pdca.id1}</div>
        <div className="pt-1">{pdca.id2}</div>
        <div className="pt-1">{pdca.id3}</div>
        <div className="pt-1">{pdca.id4}</div>
        <div className="pt-1">{pdca.id5}</div>
        <div className="pt-1">{pdca.id6}</div>
        <div className="pt-1">{pdca.id7}</div>
        <div className="pt-1">{pdca.id8}</div>
        <div className="pt-1">{pdca.id9}</div>
        <div className="pt-1">{pdca.id10}</div>
        <div className="pt-1">{pdca.id11}</div>
        <div className="pt-1">{pdca.id12}</div>
        <div className="pt-1">{pdca.id13}</div>
        <div className="pt-1">{pdca.id14}</div>
        <div className="pt-1">{pdca.id15}</div>
        <div className="pt-1">{pdca.id16}</div>
        <div className="pt-1">{pdca.id17}</div>
        <div className="pt-1">{pdca.id18}</div>
        <div className="pt-1">{pdca.id19}</div>
        <div className="pt-1">{pdca.id20}</div>
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

export default PdcaCard;
