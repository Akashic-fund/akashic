'use client';

import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import {
  Share2,
  Copy,
  Twitter,
  Facebook,
  Linkedin,
  Send,
  Instagram,
} from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface ShareCampaignDialogProps {
  campaignTitle: string;
  campaignSlug: string;
}

export function CampaignShareDialog({
  campaignTitle,
  campaignSlug,
}: ShareCampaignDialogProps) {
  const [open, setOpen] = useState(false);

  const campaignUrl =
    typeof window !== 'undefined'
      ? `${window.location.origin}/campaigns/${campaignSlug}`
      : `/campaigns/${campaignSlug}`;

  const shareText = `Check out this campaign: ${campaignTitle}`;

  const shareLinks = [
    {
      name: 'Twitter',
      icon: <Twitter className="h-5 w-5" />,
      color: 'bg-[#1DA1F2] hover:bg-[#1a94df]',
      url: `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(campaignUrl)}`,
    },
    {
      name: 'Facebook',
      icon: <Facebook className="h-5 w-5" />,
      color: 'bg-[#4267B2] hover:bg-[#3b5998]',
      url: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(campaignUrl)}`,
    },
    {
      name: 'LinkedIn',
      icon: <Linkedin className="h-5 w-5" />,
      color: 'bg-[#0077B5] hover:bg-[#006699]',
      url: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(campaignUrl)}`,
    },
    {
      name: 'WhatsApp',
      icon: <Send className="h-5 w-5" />,
      color: 'bg-[#25D366] hover:bg-[#20bd5a]',
      url: `https://api.whatsapp.com/send?text=${encodeURIComponent(`${shareText} ${campaignUrl}`)}`,
    },
    {
      name: 'Instagram',
      icon: <Instagram className="h-5 w-5" />,
      color: 'bg-[#E1306C] hover:bg-[#c13584]',
      url: `https://www.instagram.com/?url=${encodeURIComponent(campaignUrl)}`,
    },
  ];

  const copyToClipboard = () => {
    navigator.clipboard
      .writeText(campaignUrl)
      .then(() => {
        toast({
          title: 'Link copied!',
          description: 'Campaign link has been copied to clipboard',
        });
      })
      .catch((err) => {
        console.error('Failed to copy: ', err);
        toast({
          title: 'Failed to copy',
          description: 'Please try again',
          variant: 'destructive',
        });
      });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="icon" className="rounded-full">
          <Share2 className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Share this campaign</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="flex flex-col items-center gap-4">
            <div className="grid w-full grid-cols-3 gap-2">
              {shareLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`${link.color} flex items-center justify-center rounded-full p-3 text-white transition-transform hover:scale-110`}
                  onClick={() => setOpen(false)}
                >
                  {link.icon}
                  <span className="sr-only">{link.name}</span>
                </a>
              ))}
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <div className="grid flex-1 gap-2">
              <div className="flex items-center justify-between rounded-md border px-3 py-2">
                <span className="whitespace-normal break-words text-sm text-gray-600">
                  {campaignUrl}
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={copyToClipboard}
                  className="h-8 px-2"
                >
                  <Copy className="h-4 w-4" />
                  <span className="sr-only">Copy</span>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
