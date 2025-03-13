import { LEADERBOARD } from '@/constants/content/leaderboard';
import { LEADERBOARD_TABS } from '@/constants/leaderboard';
import { Button } from '@/shadcn/components/ui/button';
import { cn } from '@/shadcn/lib/utils';
import { LeaderboardTab } from '@/types/leaderboard';
import { FC } from 'react';

type Props = {
  activeTab: LeaderboardTab;
  setActiveTab: (tab: LeaderboardTab) => void;
};

const Header: FC<Props> = ({ activeTab, setActiveTab }) => {
  return (
    <div className="flex flex-col items-center w-full">
      <h1 className="text-3xl font-medium mb-8">{LEADERBOARD.TITLE}</h1>

      <div className="flex items-center gap-2 p-2 border border-zinc-800 w-fit rounded-2xl">
        {Object.values(LEADERBOARD_TABS).map((tab) => {
          const isActive = tab === activeTab;
          return (
            <Button
              key={tab}
              onClick={() => setActiveTab(tab as LeaderboardTab)}
              variant={isActive ? 'default' : 'ghost'}
              size="lg"
              className={cn(
                'rounded-xl text-base font-medium px-12',
                isActive
                  ? 'bg-flashDualPink text-black hover:bg-flashDualPink'
                  : 'text-zinc-400 hover:text-zinc-400',
              )}
            >
              {tab.charAt(0) + tab.slice(1).toLowerCase()}
            </Button>
          );
        })}
      </div>
    </div>
  );
};

export default Header;
