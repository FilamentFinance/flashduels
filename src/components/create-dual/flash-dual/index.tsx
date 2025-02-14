'use client';

import { baseApiClient } from '@/config/api-client';
import { TRANSACTION_STATUS } from '@/constants/app';
import { DUAL_DURATION } from '@/constants/dual';
import { CATEGORIES, FLASH_DUAL_CATEGORIES } from '@/constants/markets';
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
import { cn } from '@/shadcn/lib/utils';
import { DualDuration } from '@/types/dual';
import { getTransactionStatusMessage, mapDurationToNumber } from '@/utils/transaction';
import { Trash2, Upload } from 'lucide-react';
import Image from 'next/image';
import { FC, useState } from 'react';
import { useAccount } from 'wagmi';

interface FlashDualFormProps {
  // onSubmit: (data: FlashDualFormData) => void;
  onBack: () => void;
}

export interface FlashDualFormData {
  category: string;
  duelText: string;
  betIcon: File | null;
  duration: DualDuration;
}
const mapCategoryToEnumIndex = (category: string): number => {
  switch (category.toLowerCase()) {
    case 'crypto':
      return 1;
    case 'politics':
      return 2;
    case 'sports':
      return 3;
    case 'twitter':
      return 4;
    case 'nfts':
      return 5;
    case 'news':
      return 6;
    default:
      return 0;
  }
};

const FlashDualForm: FC<FlashDualFormProps> = ({ onBack }) => {
  const [selectedDuration, setSelectedDuration] = useState<DualDuration>(DUAL_DURATION.THREE_HOURS);
  const [selectedCategory, setSelectedCategory] = useState<string>(CATEGORIES.TRENDING.title);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const { address } = useAccount();
  const { status, error, txHash, approvalHash, isApprovalMining, isDuelMining, createFlashDuel } =
    useCreateFlashDuel();

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsUploading(true);
      // Create preview URL
      const previewUrl = URL.createObjectURL(file);
      setImagePreview(previewUrl);
      setSelectedImage(file);
    } catch (error) {
      console.error('Error handling image:', error);
    } finally {
      setIsUploading(false);
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
    try {
      const categoryEnumIndex = mapCategoryToEnumIndex(selectedCategory);
      const durationNumber = mapDurationToNumber(selectedDuration);
      const options = ['YES', 'NO'];
      const duelText = (document.getElementById('duelText') as HTMLTextAreaElement)?.value || '';

      const pk = {
        topic: duelText,
        category: categoryEnumIndex,
        duration: durationNumber,
        options,
      };

      await createFlashDuel(pk);

      if (status === TRANSACTION_STATUS.DUEL_COMPLETE && address) {
        const durations = [3, 6, 12];

        const duelData = {
          type: 'FLASH_DUEL',
          category: selectedCategory,
          betIcon: selectedImage,
          duelText: duelText,
          minimumWager: 0,
          endsIn: durations[durationNumber],
        };

        await baseApiClient.post('http://localhost:3004/flashduels/duels/approve', {
          ...duelData,
          twitterUsername: '',
          address: address?.toLowerCase(),
        });
      }
    } catch (error) {
      console.error('Failed to create flash duel:', error);
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
                {Object.values(FLASH_DUAL_CATEGORIES).map((category) => (
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
            {isUploading ? (
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
          <Label className="text-zinc-400 ">Ends in</Label>
          <div className="inline-flex bg-[#1C1C1C] rounded-lg w-64 p-1 gap-1">
            {Object.values(DUAL_DURATION).map((duration) => (
              <Button
                key={duration}
                type="button"
                onClick={() => setSelectedDuration(duration)}
                variant="ghost"
                className={cn(
                  'flex-1 h-8 rounded-md text-sm font-medium transition-colors',
                  selectedDuration === duration
                    ? 'bg-[#F19ED2] text-black hover:bg-[#F19ED2]/90'
                    : 'text-white hover:bg-zinc-800',
                )}
              >
                {duration}
              </Button>
            ))}
          </div>
        </div>
      </form>

      <div className="flex gap-4">
        <Button
          type="button"
          variant="outline"
          onClick={onBack}
          className="flex-1 bg-transparent border-zinc-700 text-white hover:bg-zinc-800 hover:text-white"
        >
          Back
        </Button>
        <Button
          type="submit"
          onClick={(e) => {
            e.preventDefault();
            if (!selectedImage || !selectedCategory || !selectedDuration) {
              return;
            }
            handleCreateFlashDuel();
          }}
          className="flex-1 bg-gradient-pink text-black font-semibold hover:bg-gradient-pink/90"
          disabled={
            !selectedImage || !selectedCategory || !selectedDuration || isTransactionInProgress
          }
        >
          {isTransactionInProgress ? getTransactionStatusMessage(status, error) : 'Create Dual'}
        </Button>
      </div>
    </div>
  );
};

export default FlashDualForm;
