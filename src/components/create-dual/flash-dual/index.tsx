'use client';

import { DUAL_DURATION } from '@/constants/dual';
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
import { DualDuration } from '@/types/dual';
import Image from 'next/image';
import { FC } from 'react';

interface FlashDualFormProps {
  onSubmit: (data: FlashDualFormData) => void;
}

export interface FlashDualFormData {
  category: string;
  duelText: string;
  betIcon: File | null;
  duration: DualDuration;
}

const FlashDualForm: FC<FlashDualFormProps> = ({ onSubmit }) => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    onSubmit({
      category: formData.get('category') as string,
      duelText: formData.get('duelText') as string,
      betIcon: formData.get('betIcon') as File,
      duration: formData.get('duration') as DualDuration,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col space-y-6">
      {/* Progress Indicator */}
      <div className="flex gap-2">
        <div className="h-1 flex-1 rounded bg-pink-500"></div>
        <div className="h-1 flex-1 rounded bg-pink-500"></div>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="category" className="text-zinc-400">
            Category*
          </Label>
          <Select name="category" required>
            <SelectTrigger className="bg-zinc-900 border-zinc-700">
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="sports">Sports</SelectItem>
              <SelectItem value="news">News</SelectItem>
              <SelectItem value="entertainment">Entertainment</SelectItem>
              <SelectItem value="politics">Politics</SelectItem>
              <SelectItem value="technology">Technology</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="duelText" className="text-zinc-400">
            Duel Text*
          </Label>
          <Textarea
            id="duelText"
            name="duelText"
            placeholder="Enter your Text Here"
            className="bg-zinc-900 border-zinc-700 min-h-[120px]"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="betIcon" className="text-zinc-400">
            Bet Icon*
          </Label>
          <div className="border-2 border-dashed border-zinc-700 rounded-lg p-8 text-center bg-zinc-900">
            <div className="flex flex-col items-center gap-2">
              <Image
                src="/logo/file-upload.svg"
                alt="Upload"
                width={32}
                height={32}
                className="opacity-50"
              />
              <p className="text-zinc-400">Drag and drop an image here</p>
              <p className="text-zinc-500 text-sm">recommended size: 500x500 px</p>
            </div>
            <Input
              type="file"
              id="betIcon"
              name="betIcon"
              className="hidden"
              accept="image/*"
              required
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label className="text-zinc-400">Ends in</Label>
          <div className="inline-flex p-1 gap-1 bg-zinc-900 rounded-lg w-full">
            {Object.values(DUAL_DURATION).map((duration) => (
              <Button
                key={duration}
                type="button"
                name="duration"
                value={duration}
                variant="ghost"
                className={`flex-1 rounded-md ${duration === DUAL_DURATION.THREE_HOURS ? 'bg-pink-500 text-black hover:bg-pink-600' : 'hover:bg-zinc-800'}`}
              >
                {duration}
              </Button>
            ))}
          </div>
        </div>
      </div>
    </form>
  );
};

export default FlashDualForm;
