import { Metadata } from "next";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import Pdca from "./pdca/page";
import Resource from "./resource/page";
import Devdepartment from "./devdepartment/page";
import Academic from "./academic/page";

export const metadata: Metadata = {
  title: "ktltc Plan",
  description: "Ktltc PDCA Plan",
};

export default function Home() {
  return (
    <>
      <DefaultLayout>
        <Pdca />
        <Resource />
        <Devdepartment />
        <Academic />
      </DefaultLayout>
    </>
  );
}
