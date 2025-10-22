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
      <div className="pb-6">
        <ECommerce />
      </div>
      <div className="grid grid-cols-12 gap-4 md:gap-6 2xl:gap-7.5">
        <ChartOne />
        {/* <ChartTwo /> */}
        <ChartThree />
        <div className=" ">
          <Chartfour />
        </div>
      </div >
    </>
  );
};

export default Chart;
