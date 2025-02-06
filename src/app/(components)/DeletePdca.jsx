"use client";
import { useRouter } from "next/navigation";

const DeletePdca = ({ id }) => {
  const router = useRouter();

  const deletPdca = async () => {
    const res = await fetch(`http://localhost:3000/api/Pdcas/${id}`, {
      method: "DELETE",
    });
    if (res.ok) {
      router.refresh();
    }
  };

  return (
    <div
      className="text-red-500 hover:cursor-pointer hover:text-red-600"
      onClick={deletPdca}
    >
      ❌
    </div>
  );
};

export default DeletePdca;
