import * as React from "react";
import { useAccount } from "wagmi";
import { ActiveDuels, NEXT_PUBLIC_API } from "@/utils/consts";
import { apiClient } from "@/utils/apiClient";

export function DuelsDashboard() {
  const [activeTab, setActiveTab] = React.useState("duels");
  const [duels, setDuels] = React.useState<ActiveDuels>([]);
  const [history, setHistory] = React.useState<ActiveDuels>([]);
  const { address } = useAccount();

  const getDuelsData = async () => {
    try {
      const response = await apiClient.post(`${NEXT_PUBLIC_API}/portfolio/table/duels`, {
        userAddress: address?.toLowerCase(),
      }, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      setDuels(response.data);
    } catch (error) {
      console.error("Error fetching duels data:", error);
    }
  };
  
  const getHistoryData = async () => {
    try {
      const response = await apiClient.post(`${NEXT_PUBLIC_API}/portfolio/table/history`, {
        userAddress: address?.toLowerCase(),
      }, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      setHistory(response.data);
    } catch (error) {
      console.error("Error fetching history data:", error);
    }
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
  console.log(activeData, "activeData")
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
          <TableHeader label="Avg. Price" width="w-[15%]" align="center" />
          <TableHeader label="Value" width="w-[15%]" align="center" />
          {activeTab === "history" ? (
            <TableHeader label="Profit/Loss" width="w-[20%]" align="center" />
          ) : (
          <TableHeader label="Resolves in" width="w-[20%]" align="center" />
          )
        }
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
                    status={item.duelDetails.status}
                    createdAt={item.duelDetails.createdAt}
                    startAt={item.duelDetails.startAt}
                    avgPrice={item.yesBet.price as string}
                    quantity={item.yesBet.quantity as string}
                    amount={item.yesBet.amount as string}
                    resolvesIn={item.duelDetails.endsIn as number}
                    icon={item.duelDetails.betIcon}
                    pnl={item.pnl}
                    activeTab={activeTab}
                  />
                )}
                {item.noBet.amount && (
                  <DuelRow
                    duelName={item.duelDetails.betString || `Will ${item.duelDetails.token} be ${item.duelDetails.winCondition === 0 ? "ABOVE" : "BELOW"} ${item.duelDetails.triggerPrice}`}
                    key={`${index}-no`}
                    status={item.duelDetails.status}
                    createdAt={item.duelDetails.createdAt}
                    startAt={item.duelDetails.startAt}
                    direction={"No"}
                    avgPrice={item.noBet.price as string}
                    quantity={item.noBet.quantity}
                    amount={item.yesBet.amount as string}
                    resolvesIn={item.duelDetails.endsIn as number}
                    icon={item.duelDetails.betIcon}
                    pnl={item.pnl}
                    activeTab={activeTab}
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
  // value,
  resolvesIn,
  status,
  createdAt,
  startAt,
  icon,
  pnl,
  amount,
  activeTab,
  quantity
}: {
  duelName: string;
  direction: string;
  activeTab: string;
  quantity: string;
  avgPrice: string;
  status: number
  amount: string;
  resolvesIn: number;
  createdAt: number;
  startAt: number;
  icon: string;
  pnl: number
}) {
  const thirtyMinutesMs = 30 * 60 * 1000;
  const durationMs = resolvesIn * 60 * 60 * 1000; 
  const [time, setTimeLeft] = React.useState("");
  const calculateRemainingTime = () => {
    const currentTimeMs = Date.now();
    const startTimeMs = createdAt * 1000;

    let remainingTimeMs;

    // Check if 30 minutes have passed since createdAt
    const timeElapsedMs = currentTimeMs - startTimeMs;
    if (timeElapsedMs > thirtyMinutesMs || status === 0) {
      // Use startAt if 30 minutes have passed
      const startAtTimeMs = startAt * 1000;
      const timeSinceStartAt = currentTimeMs - startAtTimeMs;
      remainingTimeMs = Math.max(durationMs - timeSinceStartAt, 0); // Calculate remaining time from startAt
    } else {
      // Use createdAt if 30 minutes have not passed
      remainingTimeMs = Math.max(thirtyMinutesMs - timeElapsedMs, 0); // Calculate remaining time from createdAt
    }

    return remainingTimeMs;
  };

  // Function to format time in HH:MM:SS format
  const formatTime = (ms: number) => {
    const totalSeconds = Math.floor(ms / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    const padTime = (time: number) => time.toString().padStart(2, '0');
    return `${padTime(hours)}:${padTime(minutes)}:${padTime(seconds)}`;
  };

  // Update timeLeft every second
  React.useEffect(() => {
    const interval = setInterval(() => {
      const remainingTimeMs = calculateRemainingTime();
      setTimeLeft(formatTime(remainingTimeMs)); // Update state with formatted time
    }, 1000);

    return () => clearInterval(interval); // Clear interval on component unmount
  }, [createdAt, startAt, resolvesIn]);
  
  return (
    <div className="flex items-center px-4 py-2 text-sm text-stone-300 border-b border-neutral-800">
      <div className="w-[25%] flex items-center gap-2">
        <img src={icon} alt={duelName} className="w-6 h-6 rounded-full" />
        <span>{duelName}</span>
      </div>
      <div className={`w-[15%] text-center ${direction === "Yes" ? 'text-green-500' : 'text-red-500'}`}>{direction}</div>
      <div className="w-[15%] text-center">{Number(quantity).toFixed(2)}</div>
      <div className="w-[15%] text-center">${Number(avgPrice).toFixed(2)}</div>
      <div className="w-[15%] text-center">${Number(amount).toFixed(2)}</div>
      <div className="w-[20%] text-center">{activeTab === "history" ? `$${pnl.toFixed(2)}` : time}</div>
    </div>
  );
}
