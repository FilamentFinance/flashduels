import React, { useEffect, useState } from "react";
import { ApproveDuelItem, DuelRowProps, NewDuelItem, NEXT_PUBLIC_API } from "@/utils/consts";
import { useAccount } from "wagmi";
import { apiClient } from "@/utils/apiClient";

export const PortfolioGrid = ({ activeButton, specialCategoryIndex }: { activeButton: string, setActiveButton: (activeButton: string) => void, specialCategoryIndex: number | null, setSpecialCategoryIndex: (specialCategoryIndex: number | null) => void }) => {

  const { address } = useAccount();

  const [duels, setDuels] = useState([]);
  const [pendingDuels, setPendingDuels] = useState([]);

  const [loading, setLoading] = useState(true); // Add loading state
  console.log(loading)
  useEffect(() => {
    const fetchDuels = async () => {
      setLoading(true); // Set loading to true when fetching data
      try {
        const response = await apiClient.post(`${NEXT_PUBLIC_API}/portfolio/duels`, {
          userAddress: address?.toLowerCase(),
        }, {
          headers: {
            "Content-Type": "application/json",
          },
        }); 
        const pendingDuels = response.data.pendingDuels
    
        if (response.data.allDuels) {
          const filteredDuels = response.data.allDuels
          
            .map((item: NewDuelItem) => ({
              title: item.betString || `Will ${item.token} be ${item.winCondition === 0 ? "ABOVE" : "BELOW"} ${item.triggerPrice}`,
              imageSrc: item.betIcon || "",
              // category: item.category,
              status: item.status,
              duelType: item.duelType,
              timeLeft: item.endsIn,
              createdAt: item.createdAt,
              // token: item.token,
              // triggerPrice: item.triggerPrice,

              startAt: item.startAt || 0,
              // volume: `$${item.totalBetAmount}`,
              // duelId: item.duelId,
            }));
    
          setDuels(filteredDuels);
        }
        if (pendingDuels){
          const filteredPendingDuels = pendingDuels
            .map((item: ApproveDuelItem) => ({
              title: item.data.betString || `Will ${item.data.token} be ${item.data.winCondition === 0 ? "ABOVE" : "BELOW"} ${item.data.triggerPrice}`,
              imageSrc: item.data.betIcon || "",
              // category: item.data.category,
              status: item.status === "pending" ? 2 : item.status === "approved" ? 3 : item.status === "rejected" && 4,
              duelType: item.type,
              timeLeft: item.data.endsIn,
              // token: item.data.token,
              // triggerPrice: item.data.triggerPrice,
            }));
            setPendingDuels(filteredPendingDuels)
        }
      } catch (error) {
        console.error("Error fetching duels:", error);
      } finally {
        setLoading(false); // Set loading to false after data is fetched
      }
    };

    fetchDuels();
  }, [address, activeButton, specialCategoryIndex]);

  return (
     <div className="flex flex-col min-h-[291px] w-full rounded-lg border border-neutral-800 shadow-sm bg-neutral-900">
 
       {/* Table Section */}
       <div className="flex flex-col overflow-x-auto w-full">
         {/* Table Header */}
         <div className="flex items-center px-4 py-2 text-sm font-semibold text-stone-300 border-b border-neutral-800">
           <TableHeader label="Duel" width="w-[25%]" />
           <TableHeader label="Type" width="w-[15%]" align="center" />
           <TableHeader label="Status" width="w-[15%]" align="center" />
           <TableHeader label="Duration" width="w-[15%]" align="center" />
           {/* <TableHeader label="Value" width="w-[15%]" align="center" /> */}
         </div>
 
         {/* Table Rows */}
         <div className="flex flex-col w-full">
           {[...duels, ...pendingDuels].length > 0  ? (
             [...duels, ...pendingDuels].map((item:DuelRowProps, index) => (
               <>
                
                   <DuelRow
                     duelName={item.title}
                     icon={item.imageSrc}
                     key={`${index}-no`}
                     status={item.status}
                     createdAt={item.createdAt}
                     type={item.duelType}
                    //  createdAt={item.createdAt}
                     startAt={item.startAt}
                     resolvesIn={item.timeLeft as number}
                    
                   />
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
  //  direction,
  //  avgPrice,
   // value,
   resolvesIn,
   status,
   createdAt,
   startAt,
   icon,
  //  pnl,
   type,
  //  amount,
  //  activeTab,
  //  quantity
 }: {
   duelName: string;
  //  direction: string;
   type: string;
  //  activeTab: string;
  //  quantity: string;
  //  avgPrice: string;
   status: number
  //  amount: string;
   resolvesIn: number;
   createdAt: number | null;
   startAt: number | null;
   icon: string;
  //  pnl: number
 }) {
  console.log(status, "status")
   const thirtyMinutesMs = 30 * 60 * 1000;
   const durationMs = resolvesIn * 60 * 60 * 1000; 
   const [time, setTimeLeft] = React.useState("");
   const calculateRemainingTime = () => {
     const currentTimeMs = Date.now();
     if (!createdAt || !startAt) {
      return durationMs;
    }
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
       <div className={`w-[15%] text-center`}>{type}</div>
       <div className="w-[15%] text-center">{status === -1 ? "Bootstraping" : status === 0 ? "Live" : status === 1 ? "Completed" : status === 2 ? "Pending" : status === 3 ? "Approved" : status === 4 && "Rejected"}</div>
       <div className="w-[15%] text-center">{time}</div>
       {/* <div className="w-[15%] text-center">${Number(amount).toFixed(2)}</div> */}
       {/* <div className="w-[20%] text-center">{activeTab === "history" ? `$${pnl.toFixed(2)}` : time}</div> */}
     </div>
   );
 }
 