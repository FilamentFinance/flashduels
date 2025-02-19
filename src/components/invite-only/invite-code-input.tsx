// components/invite-code-input.tsx
'use client';

import { Button } from '@/shadcn/components/ui/button';
import { Input } from '@/shadcn/components/ui/input';
import React, { useState } from 'react';

interface InviteCodeInputProps {
  onSubmit: (code: string) => void;
}

const InviteCodeInput: React.FC<InviteCodeInputProps> = ({ onSubmit }) => {
  const [inviteCode, setInviteCode] = useState('');

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInviteCode(event.target.value);
  };

  const handleSubmit = () => {
    if (inviteCode.trim()) {
      onSubmit(inviteCode);
      setInviteCode('');
    }
  };

  return (
    <div className="flex items-center space-x-2">
      <Input
        type="text"
        placeholder="Enter invite code"
        value={inviteCode}
        onChange={handleInputChange}
        className="w-full"
      />
      <Button onClick={handleSubmit}>Submit</Button>
    </div>
  );
};

export default InviteCodeInput;
