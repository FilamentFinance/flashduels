/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from 'react';
import { useAccount } from 'wagmi';
import { baseApiClient } from '@/config/api-client';
import { SERVER_CONFIG } from '@/config/server-config';
import { Button } from '@/shadcn/components/ui/button';
import { Input } from '@/shadcn/components/ui/input';
import { Label } from '@/shadcn/components/ui/label';
import { toast } from '@/shadcn/components/ui/use-toast';
import { Dialog } from '@/components/ui/custom-modal';

export const CreatorVerify = ({ onClose }: { onClose: () => void }) => {
  const { address } = useAccount();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    twitterHandle: '',
    telegramHandle: '',
    discordHandle: '',
    linkedinProfile: '',
    email: '',
    mobileNumber: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const validateLinkedInProfile = (url: string) => {
    const linkedInRegex = /^https:\/\/(www\.)?linkedin\.com\/in\/[A-z0-9_-]+\/?$/;
    return linkedInRegex.test(url);
  };

  const validateTwitterHandle = (handle: string) => {
    const twitterRegex = /^@?(\w){1,15}$/;
    return twitterRegex.test(handle);
  };

  const validatePhoneNumber = (number: string) => {
    const phoneRegex = /^\+?[1-9]\d{1,14}$/;
    return phoneRegex.test(number);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!address) {
      toast({
        title: 'Error',
        description: 'Please connect your wallet first',
        variant: 'destructive',
      });
      return;
    }

    if (!validateTwitterHandle(formData.twitterHandle)) {
      toast({
        title: 'Error',
        description: 'Invalid Twitter handle',
        variant: 'destructive',
      });
      return;
    }

    if (formData.linkedinProfile && !validateLinkedInProfile(formData.linkedinProfile)) {
      toast({
        title: 'Error',
        description: 'Invalid LinkedIn profile URL',
        variant: 'destructive',
      });
      return;
    }

    if (formData.mobileNumber && !validatePhoneNumber(formData.mobileNumber)) {
      toast({
        title: 'Error',
        description: 'Invalid phone number',
        variant: 'destructive',
      });
      return;
    }

    setLoading(true);
    try {
      const response = await baseApiClient.post(`${SERVER_CONFIG.API_URL}/user/creator/request`, {
        ...formData,
        address: address.toLowerCase(),
      });
      
      toast({
        title: 'Success',
        description: response.data.message || 'Creator verification request submitted successfully.',
      });
      
      setOpen(false);
      setFormData({
        twitterHandle: '',
        telegramHandle: '',
        discordHandle: '',
        linkedinProfile: '',
        email: '',
        mobileNumber: '',
      });
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.response?.data?.error || 'Failed to submit creator request',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog 
      open={open}
      onOpenChange={(isOpen) => {
        setOpen(isOpen);
        if (!isOpen) {
          onClose();
        }
      }}
      trigger={
        <Button variant="outline" className="bg-primary text-white hover:bg-primary/90">
          Verify as Creator
        </Button>
      }
      title="Creator Verification"
      maxWidth="max-w-md"
    >
      <div className="space-y-2 mb-4">
        <p className="text-sm text-muted-foreground">
          Submit your details to become a verified creator on the platform.
        </p>
      </div>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid w-full items-center gap-2">
          <Label htmlFor="twitterHandle">Twitter Handle</Label>
          <Input
            id="twitterHandle"
            name="twitterHandle"
            placeholder="@username"
            value={formData.twitterHandle}
            onChange={handleChange}
            required
          />
        </div>
        
        <div className="grid w-full items-center gap-2">
          <Label htmlFor="telegramHandle">Telegram Handle</Label>
          <Input
            id="telegramHandle"
            name="telegramHandle"
            placeholder="@username"
            value={formData.telegramHandle}
            onChange={handleChange}
          />
        </div>
        
        <div className="grid w-full items-center gap-2">
          <Label htmlFor="discordHandle">Discord Handle</Label>
          <Input
            id="discordHandle"
            name="discordHandle"
            placeholder="username#0000"
            value={formData.discordHandle}
            onChange={handleChange}
          />
        </div>
        
        <div className="grid w-full items-center gap-2">
          <Label htmlFor="linkedinProfile">LinkedIn Profile</Label>
          <Input
            id="linkedinProfile"
            name="linkedinProfile"
            placeholder="https://linkedin.com/in/username"
            value={formData.linkedinProfile}
            onChange={handleChange}
          />
        </div>
        
        <div className="grid w-full items-center gap-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            name="email"
            type="email"
            placeholder="your@email.com"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>
        
        <div className="grid w-full items-center gap-2">
          <Label htmlFor="mobileNumber">Mobile Number</Label>
          <Input
            id="mobileNumber"
            name="mobileNumber"
            placeholder="+1234567890"
            value={formData.mobileNumber}
            onChange={handleChange}
          />
        </div>
        
        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? 'Submitting...' : 'Submit Request'}
        </Button>
      </form>
    </Dialog>
  );
};
