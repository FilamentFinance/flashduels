"use client"
import * as React from "react";

const duelsData = [
  {
    icon: "https://cdn.builder.io/api/v1/image/assets/4bd09ea4570a4d12834637c604f75b6a/47d565a9f64ceacf107440bafa6cdc68f040e917f83fd4e4a59187a79899d56a?apiKey=4bd09ea4570a4d12834637c604f75b6a&",
    title: "Will $MOO Hit $1.00 before 5 OCT?",
    direction: "Yes",
    quantity: "2000",
    avgPrice: "$0.98",
    value: "$100",
    resolvesIn: "00:00:00:00",
    directionColor: "text-lime-300",
  },
];

const historyData = [
  {
    icon: "https://via.placeholder.com/20",
    title: "Resolved Duel: $MOO reached $1.00",
    direction: "Yes",
    quantity: "1500",
    avgPrice: "$0.95",
    value: "$90",
    resolvesIn: "Resolved",
    directionColor: "text-blue-300",
  },
];

const balancesData = [
  {
    icon: "https://via.placeholder.com/20",
    title: "Current Balance",
    direction: "N/A",
    quantity: "5000",
    avgPrice: "N/A",
    value: "$500",
    resolvesIn: "N/A",
  },
];

export function DuelsDashboard() {
  const [activeTab, setActiveTab] = React.useState("duels");

  const getActiveData = () => {
    switch (activeTab) {
      case "duels":
        return duelsData;
      case "history":
        return historyData;
      case "balances":
        return balancesData;
      default:
        return [];
    }
  };

  return (
    <div className="flex flex-col min-h-[291px] w-full rounded-lg border border-neutral-800 shadow-sm bg-neutral-900">
      {/* Header Section */}
      <div className="flex items-center w-full px-4 py-2 border-b border-neutral-800">
        <div className="flex items-center gap-4">
          {/* Tab Buttons */}
          <TabButton label="Duels" active={activeTab === "duels"} onClick={() => setActiveTab("duels")} />
          <TabButton label="History" active={activeTab === "history"} onClick={() => setActiveTab("history")} />
          <TabButton label="Balances" active={activeTab === "balances"} onClick={() => setActiveTab("balances")} />
        </div>
      </div>

      {/* Table Section */}
      <div className="flex flex-col overflow-x-auto w-full">
        {/* Table Header */}
        <div className="flex items-center px-4 py-2 text-sm font-semibold text-stone-300 border-b border-neutral-800">
          <TableHeader label="Duel" width="w-[25%]" />
          <TableHeader label="Direction" width="w-[15%]" align="center" />
          <TableHeader label="Quantity" width="w-[15%]" align="center" />
          <TableHeader label="Avg. Price" width="w-[15%]" align="center" />
          <TableHeader label="Value" width="w-[15%]" align="center" />
          <TableHeader label="Resolves in" width="w-[20%]" align="center" />
        </div>

        {/* Table Rows */}
        <div className="flex flex-col w-full">
          {getActiveData().map((item, index) => (
            <DuelRow duelName={item.title} key={index} {...item} />
          ))}
        </div>
      </div>
    </div>
  );
}

/* Tab Button Component */
function TabButton({ label, active, onClick }: { label: string; active?: boolean; onClick: () => void }) {
  return (
    <button
      className={`px-2 py-1 rounded-lg ${
        active
          ? "bg-pink-300 text-neutral-900"
          : "text-stone-300 hover:bg-neutral-800"
      }`}
      onClick={onClick}
    >
      {label}
    </button>
  );
}

/* Table Header Component */
function TableHeader({
  label,
  width,
  align,
}: {
  label: string;
  width: string;
  align?: "left" | "center" | "right";
}) {
  return (
    <div
      className={`px-2 py-1 ${width} ${
        align === "center" ? "text-center" : align === "right" ? "text-right" : ""
      }`}
    >
      {label}
    </div>
  );
}

/* Table Row Component */
function DuelRow({
  duelName,
  direction,
  quantity,
  avgPrice,
  value,
  resolvesIn,
  icon
}: {
  duelName: string;
  direction: string;
  quantity: string;
  avgPrice: string;
  value: string;
  resolvesIn: string;
  icon:string;
}) {
  return (
    <div className="flex items-center px-4 py-2 text-sm text-stone-300 border-b border-neutral-800">
    <div className="w-[25%] flex items-center gap-2">
      <img src={icon} alt={duelName} className="w-6 h-6 rounded-full" />
      <span>{duelName}</span>
    </div>
    <div className="w-[15%] text-center text-green-500">{direction}</div>
    <div className="w-[15%] text-center">{quantity}</div>
    <div className="w-[15%] text-center">{avgPrice}</div>
    <div className="w-[15%] text-center">{value}</div>
    <div className="w-[20%] text-center">{resolvesIn}</div>
  </div>
  
  );
}
