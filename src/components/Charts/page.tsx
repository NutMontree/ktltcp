"use client";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import ChartOne from "@/components/Charts/ChartOne";
// import ChartTwo from "@/components/Charts/ChartTwo";
import dynamic from "next/dynamic";
import React from "react";
import ECommerce from "../Dashboard/E-commerce";
import Chartfour from "./Chartfour";

const ChartThree = dynamic(() => import("@/components/Charts/ChartThree"), {
  ssr: false,
});

const Chart: React.FC = () => {
  return (
    <>
      <Breadcrumb pageName="Chart" />
      <div className="pb-6"><ECommerce /></div>
      <div className="pb-6"><ChartOne /></div>
      <div className="pb-6"><ChartThree /></div>
      <div className="pb-6"><Chartfour /></div>
    </>
  );
};

export default Chart;
