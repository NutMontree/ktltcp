"use client";
import { useRouter } from "next/navigation";

const DeleteAcademic = ({ id }) => {
  const router = useRouter();

  const deletAcademic = async () => {
    const res = await fetch(`http://localhost:3000/api/Academics/${id}`, {
      method: "DELETE",
    });
    if (res.ok) {
      router.refresh();
    }
  };

  return (
    <div
      className="text-red-500 hover:cursor-pointer hover:text-red-600"
      onClick={deletAcademic}
    >
      ❌
    </div>
  );
};

export default DeleteAcademic;
