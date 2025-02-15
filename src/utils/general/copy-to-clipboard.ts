import { toast } from '@/shadcn/components/ui/use-toast';

const CopyToClipboard = async (value: string) => {
  try {
    await navigator.clipboard.writeText(value);
    toast({
      title: 'Copied!',
      description: `${value}`,
      duration: 2000,
    });
  } catch (error) {
    console.error(error);
    toast({
      title: 'Failed to copy',
      description: 'Please try again',
      variant: 'destructive',
      duration: 2000,
    });
  }
};

export default CopyToClipboard;
