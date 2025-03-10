// components/invite-gate.tsx
'use client';

import { SERVER_CONFIG } from '@/config/server-config';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useAccount } from 'wagmi';
import InviteOnly from './invite-only';

interface SignInResponse {
  success: boolean;
  data?: {
    address: string;
    appType: string;
    isVerified: boolean;
    lastLoginAt: string;
    message: string;
  };
  error?: {
    status: number;
    message: string;
    description: string;
  };
}

interface SignUpResponse {
  success: boolean;
  data?: {
    address: string;
    inviteCode: string;
    appType: string;
    isVerified: boolean;
    signupBonus: number;
    createdAt: string;
  };
  error?: {
    status: number;
    message: string;
    description: string;
  };
}

interface InviteGateProps {
  children: React.ReactNode;
}

const InviteGate: React.FC<InviteGateProps> = ({ children }) => {
  const { address } = useAccount();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Try to sign in whenever the address changes
  useEffect(() => {
    if (address) {
      attemptSignIn();
    } else {
      setIsAuthenticated(false);
      setLoading(false);
    }
  }, [address]);

  const attemptSignIn = async () => {
    if (!address) return;

    setLoading(true);
    setErrorMessage(null);

    try {
      const response = await axios.post<SignInResponse>(
        `${SERVER_CONFIG.INVITE_ONLY_URL}/signin`,
        {
          address,
          appType: 'FLASH_DUELS',
        },
        { headers: { 'Content-Type': 'application/json' } },
      );

      if (response.data.success) {
        setIsAuthenticated(true);
        console.log('Successfully signed in:', response.data.data?.message);
      } else {
        // If signin fails, it's likely because the user hasn't signed up yet
        setIsAuthenticated(false);
        setErrorMessage('Please enter your invite code to access the app.');
      }
    } catch (error: any) {
      // Check if this is a "user not found" error, which is expected for new users
      if (error.response?.data?.error?.message === 'User not found') {
        setIsAuthenticated(false);
        setErrorMessage('Please enter your invite code to access the app.');
      } else {
        console.error('Error during sign in:', error);
        setErrorMessage('An error occurred. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleInviteCodeSubmit = async (code: string) => {
    if (!address) {
      setErrorMessage('Wallet not connected.');
      return;
    }

    setLoading(true);
    setErrorMessage(null);

    try {
      const response = await axios.post<SignUpResponse>(
        `${SERVER_CONFIG.INVITE_ONLY_URL}/signup`,
        {
          address,
          code,
          appType: 'FLASH_DUELS',
        },
        { headers: { 'Content-Type': 'application/json' } },
      );

      if (response.data.success) {
        setIsAuthenticated(true);
        // Show a success message about signup bonus
        alert(
          `Welcome! You've received ${response.data.data?.signupBonus} tokens as a signup bonus.`,
        );
      } else {
        setErrorMessage(response.data.error?.description || 'Invalid invite code.');
      }
    } catch (error: any) {
      console.error('Error during sign up:', error);
      setErrorMessage(error.response?.data?.error?.description || 'Error validating invite code.');
    } finally {
      setLoading(false);
    }
  };

  if (loading)
    return (
      <div className="fixed inset-0 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white"></div>
      </div>
    );

  return (
    <>
      <div className={isAuthenticated ? '' : 'blur-sm'}>{children}</div>
      {!isAuthenticated && (
        <InviteOnly onSubmit={handleInviteCodeSubmit} errorMessage={errorMessage} />
      )}
    </>
  );
};

export default InviteGate;
