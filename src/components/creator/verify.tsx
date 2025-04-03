/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect } from 'react';
import { useAccount } from 'wagmi';
import { baseApiClient } from '@/config/api-client';
import { SERVER_CONFIG } from '@/config/server-config';
import { Button } from '@/shadcn/components/ui/button';
import { Input } from '@/shadcn/components/ui/input';
import { Label } from '@/shadcn/components/ui/label';
import { toast } from '@/shadcn/components/ui/use-toast';
import { Dialog } from '@/components/ui/custom-modal';
const REJECTION_LIMIT = 3;

export const CreatorVerify = ({ onClose }: { onClose: () => void }) => {
  const { address } = useAccount();
  const [loading, setLoading] = useState(false);
  const [isDataLoading, setIsDataLoading] = useState(true);
  const [requestStatus, setRequestStatus] = useState<{
    status: string;
    rejectionCount: number;
    isBlacklisted: boolean;
  } | null>(null);
  const [isCreator, setIsCreator] = useState<boolean | null>(null);
  const [formData, setFormData] = useState(() => {
    // Retrieve saved form data from localStorage
    const savedData = localStorage.getItem('creatorFormData');
    return savedData ? JSON.parse(savedData) : {
      name: '',
      twitterHandle: '',
      telegramHandle: '',
      email: '',
      discordHandle: '',
      linkedinProfile: '',
      mobileNumber: '',
    };
  });

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        if (!address) return;
        const response = await baseApiClient.get(`${SERVER_CONFIG.API_URL}/user/auth`, {
          params: {
            address: address
          }
        });
        const userData = response.data;

        setFormData((prev: any) => ({
          ...prev,
          twitterHandle: userData.twitterUsername || '',
        }));
        localStorage.setItem('creatorFormData', JSON.stringify({
          ...formData,
          twitterHandle: userData.twitterUsername || '',
        }));
      } catch (error) {
        console.error('Failed to fetch user data:', error);
      }
    };

    const checkCreatorStatus = async () => {
      if (!address) {
        setIsCreator(null);
        setRequestStatus(null);
        setIsDataLoading(false);
        return;
      }
      try {
        setIsDataLoading(true);
        const response = await baseApiClient.get(`${SERVER_CONFIG.API_URL}/user/creator/status`, {
          params: {
            address: address.toLowerCase()
          }
        });
        console.log("response", response);
        setIsCreator(response.data.isCreator);
        setRequestStatus(response.data.request);
      } catch (error) {
        console.error("Error checking creator status:", error);
        setIsCreator(false);
        setRequestStatus(null);
      } finally {
        setIsDataLoading(false);
      }
    };

    fetchUserData();
    checkCreatorStatus();

    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('twitterConnected') === 'true') {
      setIsCreator(true);
    }
  }, [address]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev: any) => {
      const updatedData = { ...prev, [name]: value };
      // Save updated form data to localStorage
      localStorage.setItem('creatorFormData', JSON.stringify(updatedData));
      return updatedData;
    });
  };

//   const validateLinkedInProfile = (url: string) => {
//     const linkedInRegex = /^https:\/\/(www\.)?linkedin\.com\/in\/[A-z0-9_-]+\/?$/;
//     return linkedInRegex.test(url);
//   };

  // const validateTwitterHandle = (handle: string) => {
  //   const twitterRegex = /^@?(\w){1,15}$/;
  //   return twitterRegex.test(handle);
  // };

//   const validatePhoneNumber = (number: string) => {
//     const phoneRegex = /^\+?[1-9]\d{1,14}$/;
//     return phoneRegex.test(number);
//   };

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

    // if (!validateTwitterHandle(formData.twitterHandle)) {
    //   toast({
    //     title: 'Error',
    //     description: 'Invalid Twitter handle',
    //     variant: 'destructive',
    //   });
    //   return;
    // }

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
      
      setIsCreator(true);
      setFormData({
        name: '',
        twitterHandle: '',
        telegramHandle: '',
        email: '',
        discordHandle: '',
        linkedinProfile: '',
        mobileNumber: '',
      });
      
      // Auto close the modal on successful submission
      onClose();
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

  const handleConnectTwitter = () => {
    const token = address ? localStorage.getItem(`Bearer_${address.toLowerCase()}`) : null;
    
    if (!token) {
      toast({
        title: 'Error',
        description: 'Please sign in first',
        variant: 'destructive',
      });
      return;
    }
    
    // Encode the token properly for URL
    const tokenParam = token ? `?token=${encodeURIComponent(token.replace('Bearer ', ''))}` : '';
    const connectUrl = `${SERVER_CONFIG.API_URL}/user/auth/connect-twitter${tokenParam}`;
    
    console.log("Redirecting to:", connectUrl);
    window.location.href = connectUrl;
  };

  return (
    <Dialog 
      open={true}
      onOpenChange={(isOpen) => {
        if (!isOpen) {
          onClose();
        }
      }}
      title="Creator Verification"
      maxWidth="max-w-md"
    >
      {isDataLoading ? (
        <div className="flex justify-center items-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-secondary"></div>
        </div>
      ) : (
        <>
          <div className="space-y-2 mb-4">
            {isCreator ? (
              <p className="text-sm text-muted-foreground">
                You are already a verified creator. You can start creating duels on the platform.
              </p>
            ) : requestStatus ? (
              requestStatus.status === "pending" ? (
                <p className="text-sm text-muted-foreground">
                  Creating a duel requires creator verification. Your request is being reviewed and you will be able to start creating duels once it&apos;s accepted.
                </p>
              ) : requestStatus.status === "rejected" ? (
                <p className="text-sm text-muted-foreground">
                  Your creator verification request was rejected. Please try again. You have {REJECTION_LIMIT - requestStatus.rejectionCount} attempts left.
                </p>
              ) : (
                <p className="text-sm text-muted-foreground">
                  You need to be a verified creator to create duels on the platform.
                </p>
              )
            ) : (
              <p className="text-sm text-muted-foreground">
                You need to be a verified creator to create duels on the platform.
              </p>
            )}
          </div>
          {(!requestStatus || requestStatus.status !== "pending" && requestStatus.rejectionCount < REJECTION_LIMIT) && (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid w-full items-center gap-2">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  name="name"
                  placeholder="Your Name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="grid w-full items-center gap-2">
                <Label htmlFor="twitterHandle">Twitter Handle</Label>
                <Input
                  id="twitterHandle"
                  name="twitterHandle"
                  placeholder="@username"
                  value={formData.twitterHandle}
                  onChange={handleChange}
                  readOnly
                  required
                />
                {!formData.twitterHandle && (
                  <Button 
                    type="button"
                    className="mt-2 bg-secondary text-black hover:bg-secondary/90" 
                    onClick={handleConnectTwitter}
                  >
                    Connect Twitter
                  </Button>
                )}
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
              
              <Button 
                type="submit" 
                className="w-full mt-2 bg-secondary text-black hover:bg-secondary/90" 
                disabled={loading || !formData.twitterHandle}
              >
                {loading ? 'Submitting...' : 'Submit Request'}
              </Button>
            </form>
          )}
        </>
      )}
    </Dialog>
  );
};
