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
        <p className="pt-1">ชื่องาน : {pdca.namework}</p>
        <p className="pt-1">ชื่อโครงการ : {pdca.nameproject}</p>
        <p className="pt-1">{pdca.id1}</p>
        <p className="pt-1">{pdca.id2}</p>
        <p className="pt-1">{pdca.id3}</p>
        <p className="pt-1">{pdca.id4}</p>
        <p className="pt-1">{pdca.id5}</p>
        <p className="pt-1">{pdca.id6}</p>
        <p className="pt-1">{pdca.id7}</p>
        <p className="pt-1">{pdca.id8}</p>
        <p className="pt-1">{pdca.id9}</p>
        <p className="pt-1">{pdca.id10}</p>
        <p className="pt-1">{pdca.id11}</p>
        <p className="pt-1">{pdca.id12}</p>
        <p className="pt-1">{pdca.id13}</p>
        <p className="pt-1">{pdca.id14}</p>
        <p className="pt-1">{pdca.id15}</p>
        <p className="pt-1">{pdca.id16}</p>
        <p className="pt-1">{pdca.id17}</p>
        <p className="pt-1">{pdca.id18}</p>
        <p className="pt-1">{pdca.id19}</p>
        <p className="pt-1">{pdca.id20}</p>
        <div className="mt-2 flex">
          <div className="flex flex-col">
            <p className="my-1 text-xs">วันที่กรอกข้อมูล: {createdDateTime}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PdcaCard;
