import * as React from "react";
import { useAccount } from "wagmi";
import { ActiveDuels, NEXT_PUBLIC_API } from "@/utils/consts";

export function DuelsDashboard() {
  const [activeTab, setActiveTab] = React.useState("duels");
  const [duels, setDuels] = React.useState<ActiveDuels>([]);
  const [history, setHistory] = React.useState<ActiveDuels>([]);
  const { address } = useAccount();

  const getDuelsData = async () => {
    const body = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userAddress: address,
      }),
    }
    console.log(body, "body")
    const response = await fetch(`${NEXT_PUBLIC_API}/portfolio/table/duels`, body);
    const data = await response.json();
    console.log(data, "data")
    setDuels(data);
  };

  const getHistoryData = async () => {
    const response = await fetch(`${NEXT_PUBLIC_API}/portfolio/table/history`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userAddress: address,
      }),
    });
    const data = await response.json();
    setHistory(data);
  };

  // Fetch data when activeTab changes
  React.useEffect(() => {
    if (activeTab === "duels") {
      getDuelsData();
    } else if (activeTab === "history") {
      getHistoryData();
    }
  }, [activeTab, address]);

  const activeData = activeTab === "duels" ? duels : history;

  return (
    <div className="flex flex-col min-h-[291px] w-full rounded-lg border border-neutral-800 shadow-sm bg-neutral-900">
      {/* Header Section */}
      <div className="flex items-center w-full px-4 py-2 border-b border-neutral-800">
        <div className="flex items-center gap-4">
          {/* Tab Buttons */}
          <TabButton label="Duels" active={activeTab === "duels"} onClick={() => setActiveTab("duels")} />
          <TabButton label="History" active={activeTab === "history"} onClick={() => setActiveTab("history")} />
        </div>
      </div>

      {/* Table Section */}
      <div className="flex flex-col overflow-x-auto w-full">
        {/* Table Header */}
        <div className="flex items-center px-4 py-2 text-sm font-semibold text-stone-300 border-b border-neutral-800">
          <TableHeader label="Duel" width="w-[25%]" />
          <TableHeader label="Direction" width="w-[15%]" align="center" />
          <TableHeader label="Quantity" width="w-[15%]" align="center" />
          <TableHeader label="Entry Price" width="w-[15%]" align="center" />
          <TableHeader label="Value" width="w-[15%]" align="center" />
          <TableHeader label="Resolves in" width="w-[20%]" align="center" />
        </div>

        {/* Table Rows */}
        <div className="flex flex-col w-full">
          {activeData.length > 0 ? (
            activeData.map((item, index) => (
              <>
                {item.yesBet.amount && (
                  <DuelRow
                    duelName={item.duelDetails.betString || `Will ${item.duelDetails.token} be ${item.duelDetails.winCondition === 0 ? "ABOVE" : "BELOW"} ${item.duelDetails.triggerPrice}`}
                    key={`${index}-yes`}
                    direction={"Yes"}
                    avgPrice={item.yesBet.price as string}
                    value={item.yesBet.amount}
                    resolvesIn={item.duelDetails.endsIn as number}
                    icon={item.duelDetails.betIcon}
                  />
                )}
                {item.noBet.amount && (
                  <DuelRow
                    duelName={item.duelDetails.betString || `Will ${item.duelDetails.token} be ${item.duelDetails.winCondition === 0 ? "ABOVE" : "BELOW"} ${item.duelDetails.triggerPrice}`}
                    key={`${index}-no`}
                    direction={"No"}
                    avgPrice={item.noBet.price as string}
                    value={item.noBet.amount}
                    resolvesIn={item.duelDetails.endsIn as number}
                    icon={item.duelDetails.betIcon}
                  />
                )}
              </>
            ))
          ) : (
            <div className="text-center text-stone-400">No data available</div>
          )}

        </div>
      </div>
    </div>
  );
}

// Tab Button Component
function TabButton({ label, active, onClick }: { label: string; active?: boolean; onClick: () => void }) {
  return (
    <button
      className={`px-2 py-1 rounded-lg ${active
          ? "bg-pink-300 text-neutral-900"
          : "text-stone-300 hover:bg-neutral-800"
        }`}
      onClick={onClick}
    >
      {label}
    </button>
  );
}

// Table Header Component
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
      className={`px-2 py-1 ${width} ${align === "center" ? "text-center" : align === "right" ? "text-right" : ""
        }`}
    >
      {label}
    </div>
  );
}

// Table Row Component
function DuelRow({
  duelName,
  direction,
  avgPrice,
  value,
  resolvesIn,
  icon
}: {
  duelName: string;
  direction: string;
  // quantity: string;
  avgPrice: string;
  value: string;
  resolvesIn: number;
  icon: string;
}) {
  return (
    <div className="flex items-center px-4 py-2 text-sm text-stone-300 border-b border-neutral-800">
      <div className="w-[25%] flex items-center gap-2">
        <img src={icon} alt={duelName} className="w-6 h-6 rounded-full" />
        <span>{duelName}</span>
      </div>
      <div className={`w-[15%] text-center ${direction === "Yes" ? 'text-green-500' : 'text-red-500'}`}>{direction}</div>
      <div className="w-[15%] text-center">{(Number(avgPrice) * Number(value)).toFixed(3)}</div>
      <div className="w-[15%] text-center">{Number(avgPrice).toFixed(3)}</div>
      <div className="w-[15%] text-center">{value}</div>
      <div className="w-[20%] text-center">{resolvesIn}</div>
    </div>
  );
}
