import { Button } from '@/shadcn/components/ui/button';
import { Share2 } from 'lucide-react';
import { FC } from 'react';

interface ShareButtonProps {
  duelId: string;
  title: string;
  onClick?: (e: React.MouseEvent) => void;
}

const ShareButton: FC<ShareButtonProps> = ({ duelId, title, onClick }) => {
  const handleShare = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent the duel row click event
    if (onClick) {
      onClick(e);
      return;
    }

    const shareUrl = `${window.location.origin}/bet?duelId=${duelId}`;
    const shareText = `Check out this duel on FlashDuels: ${title}`;
    const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`;

    window.open(twitterUrl, '_blank', 'width=600,height=400');
  };

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={handleShare}
      className="w-8 h-8 rounded-full hover:bg-zinc-800/80 transition-colors"
    >
      <Share2 className="w-4 h-4 text-zinc-400" />
    </Button>
  );
};

export default ShareButton;
