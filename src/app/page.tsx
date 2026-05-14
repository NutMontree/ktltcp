import { Metadata } from "next";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import PdcaDashboard from "./pdca/page";

export const metadata: Metadata = {
  title: "KTLTC PDCA System",
  description: "Unified PDCA Management System",
};

export default function Home() {
  return (
    <PdcaDashboard />
  );
}

