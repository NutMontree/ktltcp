"use client";
import { useRouter } from "next/navigation";

const DeleteResource = ({ id }) => {
  const router = useRouter();

  const deletResource = async () => {
    const res = await fetch(`http://localhost:3000/api/Resources/${id}`, {
      method: "DELETE",
    });
    if (res.ok) {
      router.refresh();
    }
  };

  return (
    <div
      className="text-red-500 hover:cursor-pointer hover:text-red-600"
      onClick={deletResource}
    >
      ❌
    </div>
  );
};

export default DeleteResource;
