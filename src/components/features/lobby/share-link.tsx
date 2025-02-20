import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Share2, Check, Copy } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

type Props = {
    className?: string;
}

const ShareLink = ({ className }: Props) => {
    const [copied, setCopied] = useState(false);
    const currentUrl = typeof window !== 'undefined' ? window.location.href : '';

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(currentUrl);
            setCopied(true);
            toast.success('Link copied!', {
                duration: 2000,
                className: 'bg-gray-900 text-white'
            });
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            console.error('Failed to copy:', err);
            toast.error('Failed to copy link');
        }
    };

    return (
        <Card className={cn("bg-gray-900/50 border-gray-800/50 shadow-lg backdrop-blur-sm", className)}>
            <CardHeader className='px-3 pt-3 pb-0'>
                <CardTitle className='text-white p-0'>Share Link</CardTitle>
            </CardHeader>
            <CardContent className="p-3">
                <div className="flex gap-1.5 items-center">
                    <div className="flex-1 relative">
                        <Share2 className="absolute left-2.5 top-1/2 transform -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
                        <Input
                            value={currentUrl}
                            readOnly
                            className="pl-8 pr-2 py-1 h-9 text-sm bg-gray-800/30 border-gray-700/50 text-gray-200 focus:ring-1 focus:ring-yellow-500/20 placeholder:text-gray-500"
                        />
                    </div>
                    <Button
                        onClick={handleCopy}
                        variant="ghost"
                        size="icon"
                        className="h-9 w-9 hover:bg-gray-800/50 text-gray-400 hover:text-yellow-400 transition-colors"
                    >
                        {copied ? (
                            <Check className="w-4 h-4 text-green-500" />
                        ) : (
                            <Copy className="w-4 h-4" />
                        )}
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
};

export default ShareLink;