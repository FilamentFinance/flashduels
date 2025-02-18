// components/invite-gate.tsx
'use client';

import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useAccount } from 'wagmi';
import InviteOnly from './invite-only';
import { SERVER_CONFIG } from '@/config/server-config';

interface InviteValidationResponse {
  success: boolean;
  data: {
    userAddress: string;
    inviteCode: string;
    usedAt: string;
    expiresAt: string;
    appType: string;
    creatorAddress: string;
  };
}

interface InviteGateProps {
  children: React.ReactNode;
}

const INVITE_STORAGE_KEY = 'invite_valid';

const InviteGate: React.FC<InviteGateProps> = ({ children }) => {
  const { address } = useAccount();
  const [isInviteValid, setIsInviteValid] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedInvite = localStorage.getItem(INVITE_STORAGE_KEY);
    if (storedInvite) {
      try {
        const inviteData = JSON.parse(storedInvite) as { expireAt: string };
        if (new Date() < new Date(inviteData.expireAt)) {
          setIsInviteValid(true);
        } else {
          localStorage.removeItem(INVITE_STORAGE_KEY);
        }
      } catch (error) {
        console.error('Error parsing stored invite data', error);
      }
    }
    setLoading(false);
  }, []);

  const handleInviteCodeSubmit = async (code: string) => {
    if (!address) {
      alert('Wallet not connected.');
      return;
    }
    try {
      const response = await axios.post<InviteValidationResponse>(
        `${SERVER_CONFIG.INVITE_ONLY_URL}/join`,
        { address, code },
        { headers: { 'Content-Type': 'application/json' } },
      );
      const result = response.data;
      if (result.success) {
        localStorage.setItem(INVITE_STORAGE_KEY, JSON.stringify(result.data));
        setIsInviteValid(true);
      } else {
        alert('Invalid invite code.');
      }
    } catch (error) {
      console.error('Error validating invite code:', error);
      alert('Error validating invite code.');
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <>
      <div className={isInviteValid ? '' : 'blur-sm'}>{children}</div>
      {!isInviteValid && <InviteOnly onSubmit={handleInviteCodeSubmit} />}
    </>
  );
};

export default InviteGate;
