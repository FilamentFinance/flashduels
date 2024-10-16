import React from "react";
import LeaderboardTable from "./LeaderboardTable";
import LeaderboardToggle from "./LeaderboardToggle";

const LeaderboardPage: React.FC = () => {
  return (
    <div className="flex overflow-hidden flex-col">
      {/* <Header /> */}
      <main className="flex flex-col justify-center self-center mt-4 w-full text-center whitespace-nowrap max-w-[874px] max-md:max-w-full space-y-4">
        <h1 className="flex-1 shrink gap-2.5 self-stretch w-full text-2xl font-semibold leading-none text-white max-md:max-w-full">
          Leaderboard
        </h1>
        <LeaderboardToggle />
        <LeaderboardTable />
      </main>
    </div>
  );
};

export default LeaderboardPage;
