// components/invite-code-input.tsx
'use client';

import { Button } from '@/shadcn/components/ui/button';
import { Input } from '@/shadcn/components/ui/input';
import React, { useState } from 'react';

interface InviteCodeInputProps {
  onSubmit: (code: string) => void;
  disabled: boolean;
}

const InviteCodeInput: React.FC<InviteCodeInputProps> = ({ onSubmit, disabled }) => {
  const [inviteCode, setInviteCode] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInviteCode(event.target.value);
  };

  const handleSubmit = async () => {
    if (inviteCode.trim() && !isSubmitting) {
      setIsSubmitting(true);
      await onSubmit(inviteCode);
      setIsSubmitting(false);
      setInviteCode('');
    }
  };

  const handleKeyPress = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter') {
      handleSubmit();
    }
  };

  return (
    <div className="flex items-center space-x-2">
      <Input
        type="text"
        placeholder="Enter invite code"
        value={inviteCode}
        onChange={handleInputChange}
        onKeyPress={handleKeyPress}
        className="w-full"
        disabled={isSubmitting}
      />
      <Button onClick={handleSubmit} disabled={isSubmitting || !inviteCode.trim()}>
        {isSubmitting ? (
          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mx-auto"></div>
        ) : (
          'Submit'
        )}
      </Button>
    </div>
  );
};

export default InviteCodeInput;