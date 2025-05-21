'use client';

import { Dialog } from '@/components/ui/custom-modal';
import { SERVER_CONFIG } from '@/config/server-config';
import { Button } from '@/shadcn/components/ui/button';
import { Card, CardContent } from '@/shadcn/components/ui/card';
import { Input } from '@/shadcn/components/ui/input';
import { useToast } from '@/shadcn/components/ui/use-toast';
import axios from 'axios';
import { Check, Copy } from 'lucide-react';
import { FC, useState } from 'react';
import { useAccount, useChainId } from 'wagmi';

interface InviteCodeData {
  code: string;
  expireAt: string;
  maxUsage: number;
  usageCount: number;
  appType: string;
  creatorAddress: string;
  createdAt: string;
  creator: {
    totalCodes: number;
    lastCodeGeneratedAt: string;
  };
}

interface ApiError {
  status: number;
  message: string;
  description: string;
}

const GenerateInvite: FC = () => {
  const [inviteCodeData, setInviteCodeData] = useState<InviteCodeData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [apiError, setApiError] = useState<ApiError | null>(null);
  const [copied, setCopied] = useState(false);
  const [userName, setUserName] = useState('');
  const { toast } = useToast();
  const { address } = useAccount();
  const chainId = useChainId();

  const handleCopy = async () => {
    if (!inviteCodeData?.code) return;
    try {
      await navigator.clipboard.writeText(inviteCodeData.code);
      setCopied(true);
      toast({
        title: 'Copied',
        description: `Invite code ${inviteCodeData.code} copied to clipboard.`,
      });
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast({
        title: 'Error',
        description: 'Failed to copy invite code.',
        variant: 'destructive',
      });
    }
  };

  const handleGenerate = async () => {
    if (!address) {
      toast({
        title: 'No Wallet Connected',
        description: 'Please connect your wallet to generate an invite code.',
        variant: 'destructive',
      });
      return;
    }
    if (!userName.trim()) {
      toast({
        title: 'Missing Username',
        description: 'Please enter your username.',
        variant: 'destructive',
      });
      return;
    }
    setIsLoading(true);
    setIsError(false);
    setApiError(null);
    try {
      const response = await axios.post(
        `${SERVER_CONFIG.getInviteOnlyUrl(chainId)}/generate`,
        { address, appType: 'flash-duels', username: userName },
        { headers: { 'Content-Type': 'application/json' } },
      );
      const result = response.data;
      if (result.success) {
        setInviteCodeData(result.data);
        toast({
          title: 'Success',
          description: 'Invite code generated successfully.',
        });
      } else {
        setIsError(true);
        setApiError(result.error);
        toast({
          title: 'Error',
          description: result.error.description || 'Failed to generate invite code.',
          variant: 'destructive',
        });
      }
    } catch (error) {
      console.error('Error generating invite code:', error);
      setIsError(true);
      toast({
        title: 'Error',
        description: 'An error occurred while generating invite code.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog
      title={
        <div className="flex flex-col items-center gap-2">
          <h2 className="text-2xl font-semibold">Invite Code Details</h2>
        </div>
      }
      trigger={
        <Button variant="ghost" className="bg-gradient-pink text-black" disabled={isLoading}>
          {isLoading ? 'Generating...' : 'Generate Invite'}
        </Button>
      }
      maxWidth="max-w-md"
    >
      <Card className="bg-zinc-900 border-none">
        <CardContent>
          {isError && apiError && (
            <div className="mb-4 p-4 bg-red-600 rounded">
              <p className="text-white font-semibold">{apiError.message}</p>
              <p className="text-white text-sm">{apiError.description}</p>
            </div>
          )}
          {isLoading && !inviteCodeData ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between bg-zinc-800 p-4 rounded animate-pulse">
                <div className="w-1/2 h-6 bg-zinc-700 rounded" />
                <div className="w-12 h-8 bg-zinc-700 rounded" />
              </div>
              <div className="space-y-2">
                <div className="w-full h-4 bg-zinc-700 rounded animate-pulse" />
                <div className="w-full h-4 bg-zinc-700 rounded animate-pulse" />
                <div className="w-full h-4 bg-zinc-700 rounded animate-pulse" />
              </div>
            </div>
          ) : inviteCodeData ? (
            <div className="flex flex-col space-y-4">
              <div className="flex items-center justify-between bg-zinc-800 p-4 rounded">
                <span className="font-mono text-lg text-white">{inviteCodeData.code}</span>
                <Button variant="outline" size="sm" onClick={handleCopy} className="text-white">
                  {copied ? (
                    <>
                      <Check className="w-4 h-4 mr-1" />
                      Copied
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4 mr-1" />
                      Copy
                    </>
                  )}
                </Button>
              </div>
              <div className="text-sm text-gray-400 space-y-2">
                {inviteCodeData.expireAt && (
                  <p>
                    <span className="font-semibold text-white">Expires At:</span>{' '}
                    {new Date(inviteCodeData.expireAt).toLocaleString()}
                  </p>
                )}
                <p>
                  <span className="font-semibold text-white">Usage:</span>{' '}
                  {inviteCodeData.usageCount} / {inviteCodeData.maxUsage}
                </p>
                <p>
                  <span className="font-semibold text-white">App Type:</span>{' '}
                  {inviteCodeData.appType}
                </p>
                <p>
                  <span className="font-semibold text-white">Creator Address:</span>{' '}
                  {inviteCodeData.creatorAddress}
                </p>
                <p>
                  <span className="font-semibold text-white">Created At:</span>{' '}
                  {new Date(inviteCodeData.createdAt).toLocaleString()}
                </p>
              </div>
            </div>
          ) : (
            <div className="flex flex-col space-y-4">
              <Input
                type="text"
                placeholder="Enter your username"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                className="bg-zinc-800 text-white"
              />
              <Button
                variant="ghost"
                className="bg-gradient-pink text-black"
                onClick={handleGenerate}
                disabled={isLoading}
              >
                Submit
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </Dialog>
  );
};

export default GenerateInvite;
