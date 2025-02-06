"use client";
import { useRouter } from "next/navigation";

const DeleteDevdepartment = ({ id }) => {
  const router = useRouter();

  const deletDevdepartment = async () => {
    const res = await fetch(
      `https://ktltcp.vercel.app/api/Devdepartments/${id}`,
      {
        method: "DELETE",
      },
    );
    if (res.ok) {
      router.refresh();
    }
  };

  return (
    <div
      className="text-red-500 hover:cursor-pointer hover:text-red-600"
      onClick={deletDevdepartment}
    >
      ❌
    </div>
  );
};

export default DeleteDevdepartment;
