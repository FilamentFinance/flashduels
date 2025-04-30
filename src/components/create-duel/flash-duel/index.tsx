'use client';

import { baseApiClient } from '@/config/api-client';
import { SERVER_CONFIG } from '@/config/server-config';
import { TRANSACTION_STATUS } from '@/constants/app';
import {
  // DUEL_DURATION,
  DUEL_TYPE,
  DURATIONS,
  OPTIONS,
  FLASH_DUEL_DURATION,
} from '@/constants/duel';
import { CATEGORIES, FLASH_DUEL_CATEGORIES } from '@/constants/markets';
import useCreateFlashDuel from '@/hooks/useCreateFlashDuel';
import { Button } from '@/shadcn/components/ui/button';
import { Input } from '@/shadcn/components/ui/input';
import { Label } from '@/shadcn/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shadcn/components/ui/select';
import { Textarea } from '@/shadcn/components/ui/textarea';
import { DuelDuration } from '@/types/duel';
import { mapCategoryToEnumIndex, mapDurationToNumber } from '@/utils/general/create-duels';
import { getTransactionStatusMessage } from '@/utils/transaction';
import { Trash2, Upload, Loader2 } from 'lucide-react';
import Image from 'next/image';
import { FC, useState, useEffect } from 'react';
import { useAccount, useChainId } from 'wagmi';
import { cn } from '@/shadcn/lib/utils';
import { useToast } from '@/shadcn/components/ui/use-toast';
import { usePublicClient } from 'wagmi';
import { formatUnits } from 'ethers';
import { Hex } from 'viem';
import { CREDITS } from '@/abi/CREDITS';
import { sei } from 'viem/chains';

type FlashDuelFormProps = {
  onBack: () => void;
  onComplete: () => void;
  isSubmitting: boolean;
  setIsSubmitting: (value: boolean) => void;
};

const FlashDuelForm: FC<FlashDuelFormProps> = ({
  onBack,
  onComplete,
  isSubmitting,
  setIsSubmitting,
}) => {
  const [selectedDuration, setSelectedDuration] = useState<DuelDuration>(
    FLASH_DUEL_DURATION.THREE_HOURS,
  );
  const [selectedCategory, setSelectedCategory] = useState<string>(CATEGORIES['ALL_DUELS'].title);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const { address } = useAccount();
  const chainId = useChainId();
  const { status, error, isApprovalMining, isDuelMining, createFlashDuel, isComplete } =
    useCreateFlashDuel();
  const [isButtonClicked, setIsButtonClicked] = useState(false);
  const [creditsBalance, setCreditsBalance] = useState<string>('0');
  const { toast } = useToast();
  const publicClient = usePublicClient();
  const symbol = chainId === sei.id ? 'CRD' : 'FDCRD';

  useEffect(() => {
    console.log('Completion Status Check:', {
      isComplete,
      hasAddress: !!address,
      currentStatus: status,
    });

    const handleCompletion = async () => {
      if (isComplete && address) {
        console.log('Proceeding with API call after duel completion');
        const duelText = (document.getElementById('duelText') as HTMLTextAreaElement)?.value || '';
        const durationNumber = mapDurationToNumber(selectedDuration, 'flash');

        const duelData = {
          type: DUEL_TYPE.FLASH_DUEL,
          category: selectedCategory,
          betIcon: imageUrl,
          betString: duelText,
          minimumWager: '',
          endsIn: DURATIONS[durationNumber],
        };

        console.log('Preparing to send duel data to API:', duelData);
        try {
          await baseApiClient.post(`${SERVER_CONFIG.API_URL}/user/duels/approve`, {
            ...duelData,
            twitterUsername: '',
            address: address?.toLowerCase(),
          });
          console.log('API call successful');

          // Show toast notification about admin approval
          toast({
            title: 'Flash Duel Created Successfully',
            description:
              'Your Flash Duel is now pending admin approval. Please check your portfolio page for status updates.',
            duration: 6000,
          });

          onComplete();
        } catch (error) {
          console.error('API Error:', error);
          onComplete();
        }
      }
    };

    handleCompletion();
  }, [isComplete, address]);

  useEffect(() => {
    const checkCreditsBalance = async () => {
      if (!address || !publicClient) return;

      try {
        const balance = await publicClient.readContract({
          abi: CREDITS,
          address: SERVER_CONFIG.CREDIT_CONTRACT as Hex,
          functionName: 'balanceOf',
          args: [address.toLowerCase()],
        });

        setCreditsBalance(balance?.toString() || '0');
      } catch (error) {
        console.error('Error fetching credits balance:', error);
      }
    };

    checkCreditsBalance();
  }, [address, publicClient]);

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsSubmitting(true);
      const previewUrl = URL.createObjectURL(file);
      setImagePreview(previewUrl);
      setSelectedImage(file);
    } catch (error) {
      console.error('Error handling image:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteImage = () => {
    if (imagePreview) {
      URL.revokeObjectURL(imagePreview);
    }
    setSelectedImage(null);
    setImagePreview(null);
  };

  const handleCreateFlashDuel = async () => {
    if (isTransactionInProgress || isButtonClicked) return;
    setIsButtonClicked(true);

    try {
      setIsSubmitting(true);

      const balanceInEther = parseFloat(formatUnits(BigInt(creditsBalance), 18));
      if (balanceInEther < 5) {
        toast({
          title: `Insufficient ${symbol} Balance`,
          description: `You need at least 5 ${symbol} to create a duel. Your current balance is ${balanceInEther.toFixed(2)} ${symbol}.`,
          variant: 'destructive',
        });
        setIsButtonClicked(false);
        setIsSubmitting(false);
        return;
      }

      // Inform user about the approval process before proceeding
      toast({
        title: 'Creating Flash Duel',
        description:
          'After transaction completion, your duel will need admin approval before going live.',
        duration: 5000,
      });

      const categoryEnumIndex = mapCategoryToEnumIndex(selectedCategory);
      const durationNumber = mapDurationToNumber(selectedDuration);
      const duelText = (document.getElementById('duelText') as HTMLTextAreaElement)?.value || '';

      if (selectedImage) {
        const fileName = `${Date.now()}-${selectedImage.name}`;
        const presignedUrlResponse = await baseApiClient.post(
          `${SERVER_CONFIG.API_URL}/user/aws/generate-presigned-url`,
          {
            fileName,
            fileType: selectedImage.type,
            userAddress: address?.toLowerCase(),
          },
        );

        const fullUrl = presignedUrlResponse.data.url;
        const imageUrl = fullUrl.split('?')[0];
        setImageUrl(imageUrl);
        await fetch(presignedUrlResponse.data.url, {
          method: 'PUT',
          body: selectedImage,
          headers: {
            'Content-Type': selectedImage.type,
          },
        });
      }

      const createDuelData = {
        topic: duelText,
        category: categoryEnumIndex,
        duration: durationNumber,
        options: OPTIONS,
      };
      await createFlashDuel(createDuelData);
    } catch (error) {
      console.error('Error in handleCreateFlashDuel:', error);
      onComplete();
    } finally {
      setIsSubmitting(false);
      setIsButtonClicked(false);
    }
  };

  const isTransactionInProgress =
    status === TRANSACTION_STATUS.APPROVAL_PENDING ||
    status === TRANSACTION_STATUS.APPROVAL_MINING ||
    status === TRANSACTION_STATUS.CREATING_DUEL ||
    status === TRANSACTION_STATUS.DUEL_MINING ||
    isApprovalMining ||
    isDuelMining;

  return (
    <div className="space-y-6">
      <form className="space-y-4">
        <div className="flex items-center justify-between space-y-2">
          <Label htmlFor="category" className="text-zinc-400 flex-1">
            Category*
          </Label>
          <div className="w-52">
            <Select name="category" required onValueChange={(value) => setSelectedCategory(value)}>
              <SelectTrigger className="bg-zinc-900 border-zinc-700">
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent className="bg-[#1C1C1C] border-zinc-700">
                {Object.values(FLASH_DUEL_CATEGORIES).map((category) => (
                  <SelectItem
                    key={category}
                    value={category}
                    className="text-white focus:bg-zinc-800 focus:text-white"
                  >
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="duelText" className="text-zinc-400">
            Duel Text*
          </Label>
          <Textarea
            id="duelText"
            name="duelText"
            placeholder="Enter your Text Here"
            className="bg-zinc-900 border-zinc-700 min-h-[50px]"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="betIcon" className="text-zinc-400">
            Bet Icon*
          </Label>
          <div className="border-2 border-dashed border-zinc-700 rounded-lg p-4 text-center bg-zinc-900">
            {isSubmitting ? (
              <div className="flex flex-col items-center gap-2">
                <div className="animate-spin">
                  <Upload className="h-8 w-8 text-zinc-400" />
                </div>
                <p className="text-zinc-400">Uploading...</p>
              </div>
            ) : imagePreview ? (
              <div className="flex items-center gap-4">
                <div className="relative w-24 h-24">
                  <Image
                    src={imagePreview}
                    alt="Preview"
                    fill
                    className="object-cover rounded-lg"
                  />
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={handleDeleteImage}
                  className="text-red-500 hover:text-red-600 hover:bg-red-500/10"
                >
                  <Trash2 className="h-5 w-5" />
                </Button>
              </div>
            ) : (
              <label htmlFor="betIcon" className="flex flex-col items-center gap-2 cursor-pointer">
                <Image
                  src="/logo/file-upload.svg"
                  alt="Upload"
                  width={32}
                  height={32}
                  className="opacity-50"
                />
                <p className="text-zinc-400">Drag and drop an image here</p>
                <p className="text-zinc-500 text-sm">recommended size: 500x500 px</p>
                <Input
                  type="file"
                  id="betIcon"
                  name="betIcon"
                  className="hidden"
                  accept="image/*"
                  required
                  onChange={handleImageChange}
                />
              </label>
            )}
          </div>
        </div>

        <div className="flex items-center justify-between gap-4">
          <Label className="text-zinc-400">Ends in</Label>
          <div className="w-32">
            <Select
              value={selectedDuration}
              onValueChange={(value) => setSelectedDuration(value as DuelDuration)}
            >
              <SelectTrigger className="bg-zinc-900 border-zinc-700">
                <SelectValue placeholder="Select duration" />
              </SelectTrigger>
              <SelectContent className="bg-[#1C1C1C] border-zinc-700">
                {Object.values(FLASH_DUEL_DURATION).map((duration) => (
                  <SelectItem
                    key={duration}
                    value={duration}
                    className="text-white focus:bg-zinc-800 focus:text-white"
                  >
                    {duration}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </form>

      <div className="flex gap-4">
        <Button
          type="button"
          variant="outline"
          onClick={onBack}
          disabled={isTransactionInProgress}
          className={cn(
            'flex-1 border-zinc-700',
            isTransactionInProgress ? 'opacity-50 cursor-not-allowed' : 'hover:bg-zinc-900',
          )}
        >
          Back
        </Button>
        <Button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            handleCreateFlashDuel();
          }}
          disabled={
            !selectedImage ||
            !selectedCategory ||
            !selectedDuration ||
            isTransactionInProgress ||
            isButtonClicked
          }
          className={cn(
            'flex-1 bg-gradient-pink text-black relative overflow-hidden group',
            isTransactionInProgress || isButtonClicked ? 'opacity-50 cursor-not-allowed' : '',
          )}
        >
          <span
            className={cn('relative z-10 flex items-center gap-2', isSubmitting && 'opacity-0')}
          >
            {isTransactionInProgress ? getTransactionStatusMessage(status, error) : 'Create Duel'}
          </span>
          {isSubmitting && (
            <div className="absolute inset-0 flex items-center justify-center gap-2">
              <Loader2 className="h-5 w-5 animate-spin" />
              <span>Creating Flash Duel...</span>
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-r from-[#F19ED2] to-[#F19ED2]/80 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </Button>
      </div>
    </div>
  );
};

export default FlashDuelForm;
