
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";
import { Share2, Copy, Facebook, Twitter, Linkedin, Mail } from "lucide-react";

interface ShareButtonProps {
  url?: string;
  title?: string;
}

const ShareButton = ({ url = window.location.href, title = "Check out this resource on EduGuide AI" }: ShareButtonProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(url);
      toast({
        title: "Link copied",
        description: "The link has been copied to your clipboard",
      });
    } catch (err) {
      console.error('Failed to copy: ', err);
      toast({
        title: "Failed to copy",
        description: "Please try again or copy the URL manually",
        variant: "destructive",
      });
    }
  };

  const shareTargets = [
    { 
      name: "Facebook", 
      icon: <Facebook className="h-5 w-5" />, 
      url: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}&t=${encodeURIComponent(title)}` 
    },
    { 
      name: "Twitter", 
      icon: <Twitter className="h-5 w-5" />, 
      url: `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}` 
    },
    { 
      name: "LinkedIn", 
      icon: <Linkedin className="h-5 w-5" />, 
      url: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}` 
    },
    { 
      name: "Email", 
      icon: <Mail className="h-5 w-5" />, 
      url: `mailto:?subject=${encodeURIComponent(title)}&body=${encodeURIComponent(url)}` 
    }
  ];

  const handleShare = (shareUrl: string) => {
    window.open(shareUrl, '_blank', 'noopener,noreferrer');
    setIsOpen(false);
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm">
          <Share2 className="h-4 w-4 mr-2" />
          Share
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80" align="end">
        <div className="space-y-4">
          <h3 className="font-medium">Share this resource</h3>
          
          <div className="flex items-center space-x-2">
            <Input
              readOnly
              value={url}
              className="flex-1"
            />
            <Button size="sm" onClick={handleCopyLink}>
              <Copy className="h-4 w-4" />
            </Button>
          </div>
          
          <div className="flex justify-between">
            {shareTargets.map((target) => (
              <Button
                key={target.name}
                variant="outline"
                size="sm"
                className="p-2"
                onClick={() => handleShare(target.url)}
                aria-label={`Share on ${target.name}`}
              >
                {target.icon}
              </Button>
            ))}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default ShareButton;
