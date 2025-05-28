import { Button } from '@/shadcn/components/ui/button';
import { Link, Check } from 'lucide-react';
import { FC, useState } from 'react';

interface CopyLinkButtonProps {
  duelId: string;
  onClick?: (e: React.MouseEvent) => void;
  tooltipPosition?: 'top' | 'bottom';
}

const CopyLinkButton: FC<CopyLinkButtonProps> = ({
  duelId,
  onClick,
  tooltipPosition = 'bottom',
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent the duel row click event
    if (onClick) {
      onClick(e);
      return;
    }

    const shareUrl = `${window.location.origin}/bet?duelId=${duelId}`;
    navigator.clipboard.writeText(shareUrl).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000); // Reset after 2 seconds
    });
  };

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={handleCopy}
      className="w-8 h-8 rounded-full hover:bg-zinc-800/80 transition-colors relative group"
    >
      {copied ? (
        <Check className="w-4 h-4 text-green-500" />
      ) : (
        <Link className="w-4 h-4 text-zinc-400" />
      )}
      {copied && (
        <div
          className={`absolute ${tooltipPosition === 'top' ? '-top-8' : 'top-8'} left-1/2 -translate-x-1/2 bg-zinc-800 text-zinc-200 text-xs px-2 py-1 rounded whitespace-nowrap`}
        >
          Copied
        </div>
      )}
    </Button>
  );
};

export default CopyLinkButton;
