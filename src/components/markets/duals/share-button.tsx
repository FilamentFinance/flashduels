import { Button } from '@/shadcn/components/ui/button';
import { Share2 } from 'lucide-react';
// import { FC } from 'react';
import { FC, useState, useEffect } from 'react';
import { useToast } from '@/shadcn/components/ui/use-toast';
import { toPng } from 'html-to-image';
import { useSearchParams } from 'next/navigation';
import { useChainId } from 'wagmi';
import { SERVER_CONFIG } from '@/config/server-config';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/shadcn/components/ui/dialog';
// import DuelCard from './duel-card';
// import { Card } from '@/shadcn/components/ui/card';
// import ChanceProgress from './chance-progress';
import { Duel } from '@/types/duel';
// import { Loader2 } from 'lucide-react';

interface ShareButtonProps {
  duel: Duel;
  yesPercentage: number;
  noPercentage: number;
  uniqueParticipants: number;
  timeLeft: string;
  rowRef: React.RefObject<HTMLDivElement>;
  onClick?: (e: React.MouseEvent) => void;
}

const ShareButton: FC<ShareButtonProps> = ({
  duel,
  // yesPercentage,
  // noPercentage,
  // uniqueParticipants,
  // timeLeft,
  rowRef,
  onClick,
}) => {
  // const cardRef = useRef<HTMLDivElement>(null);
  // const [imageError, setImageError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [tweetText, setTweetText] = useState(`Check out this duel on FlashDuels: ${duel.title}`);
  const [origin, setOrigin] = useState('');
  const [mounted, setMounted] = useState(false);
  const searchParams = useSearchParams();
  const { toast } = useToast();
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const chainId = useChainId();

  useEffect(() => {
    setMounted(true);
    if (typeof window !== 'undefined') {
      setOrigin(window.location.origin);
    }
  }, []);

  // Check for Twitter share errors
  const twitterShareError = searchParams.get('twitterShareError');
  if (twitterShareError) {
    toast({
      title: 'Error',
      description: 'Failed to share on Twitter. Please try again.',
      variant: 'destructive',
    });
  }

  // Download the card as an image (from actual row)
  const handleDownloadImage = async () => {
    try {
      if (!rowRef.current) throw new Error('Card element not found');
      const dataUrl = await toPng(rowRef.current, { cacheBust: true });
      const link = document.createElement('a');
      link.download = 'duel-share.png';
      link.href = dataUrl;
      link.click();
    } catch (err) {
      toast({
        title: 'Error',
        description: 'Failed to download image',
        variant: 'destructive',
      });
    }
  };

  // Convert data URL to Blob
  function dataURLtoBlob(dataurl: string) {
    const arr = dataurl.split(',');
    const mime = arr[0].match(/:(.*?);/)![1];
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new Blob([u8arr], { type: mime });
  }

  // Share on Twitter (OAuth flow, from actual row)
  const handleShareImage = async () => {
    try {
      setIsLoading(true);
      if (!rowRef.current) throw new Error('Card element not found');
      const dataUrl = await toPng(rowRef.current, { cacheBust: true });
      setPreviewImage(dataUrl); // for preview
      const imageBlob = dataURLtoBlob(dataUrl);
      const formData = new FormData();
      formData.append('image', imageBlob, 'share.png');
      formData.append('text', tweetText);
      formData.append('url', `${origin}/duels/${duel.duelId}`);
      const backendResponse = await fetch(`${SERVER_CONFIG.getApiUrl(chainId)}/twitter/start`, {
        method: 'POST',
        body: formData,
        credentials: 'include',
      });
      if (!backendResponse.ok) {
        const errorData = await backendResponse.json();
        throw new Error(errorData.error || 'Failed to share on Twitter');
      }
      const { authUrl } = await backendResponse.json();
      window.location.href = authUrl;
    } catch (error) {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to share on Twitter',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
      setShowPreview(false);
    }
  };

  const handleClick = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onClick) {
      onClick(e);
      return;
    }
    // const shareUrl = `${window.location.origin}/bet?duelId=${duelId}`;
    // const shareText = `Check out this duel on FlashDuels: ${title}`;
    // const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`;

    // window.open(twitterUrl, '_blank', 'width=600,height=400');

    // Generate preview image from actual row
    if (rowRef.current) {
      const dataUrl = await toPng(rowRef.current, { cacheBust: true });
      setPreviewImage(dataUrl);
    }
    setShowPreview(true);
  };

  return (
    //   <Button
    //   variant="ghost"
    //   size="icon"
    //   onClick={handleShare}
    //   className="w-8 h-8 rounded-full hover:bg-zinc-800/80 transition-colors"
    // >
    //   <Share2 className="w-4 h-4 text-zinc-400" />
    // </Button>
    <>
      {/* Modal for preview and review */}
      <Dialog open={showPreview} onOpenChange={setShowPreview}>
        <DialogContent
          className="sm:max-w-[700px] border-pink-300"
          onClick={(e) => e.stopPropagation()}
        >
          <DialogHeader>
            <DialogTitle>Preview Tweet</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            {/* Preview image (not clickable) */}
            {mounted && previewImage && (
              <img
                src={previewImage}
                alt="Duel Preview"
                style={{
                  width: '100%',
                  borderRadius: 16,
                  boxShadow: '0 4px 24px rgba(6, 6, 6, 0.08)',
                }}
              />
            )}
            {/* Tweet text area */}
            <div>
              <label className="block text-xs text-zinc-400 mb-1">Customize your tweet text:</label>
              <textarea
                value={tweetText}
                onChange={(e) => setTweetText(e.target.value)}
                rows={3}
                className="w-full rounded bg-zinc-900 text-white p-2 border border-zinc-700 resize-none"
              />
            </div>
            {/* Show the link below the card */}
            {mounted && (
              <div className="text-blue-400 text-xs mt-2 break-all">
                {origin}/duels/{duel.duelId}
              </div>
            )}
          </div>
          <DialogFooter>
            <Button
              className="bg-zinc-800 hover:bg-red-700 text-zinc-400"
              variant="outline"
              onClick={() => setShowPreview(false)}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button
              onClick={handleShareImage}
              disabled={isLoading}
              className="bg-[#1DA1F2] hover:bg-[#2a8ad3]"
            >
              {isLoading ? 'Sharing...' : 'Share on X'}
            </Button>
            <Button
              onClick={handleDownloadImage}
              disabled={isLoading}
              className="bg-zinc-800 hover:bg-pink-400 text-white-400"
            >
              Download
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      {/* Main share button */}
      <Button
        variant="ghost"
        size="icon"
        onClick={handleClick}
        disabled={isLoading}
        className="w-8 h-8 rounded-full hover:bg-zinc-800/80 transition-colors"
      >
        <Share2 className="w-4 h-4 text-zinc-400" />
      </Button>
    </>
  );
};

export default ShareButton;
