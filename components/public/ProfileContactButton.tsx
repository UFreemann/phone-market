'use client';

import { Button } from '@/components/ui/button';
import { Phone, MessageCircle } from 'lucide-react';
import { trackLead } from '@/actions/track-lead';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

type Props = {
  dealerId: string;
  phoneNumber: string;
  brandColor: string;
};

export default function ProfileContactButton({
  dealerId,
  phoneNumber,
  brandColor,
}: Props) {
  const handleAction = async (type: 'CALL' | 'WHATSAPP') => {
    // Track Lead (Product ID is null for profile clicks)
    // You might need to update 'trackLead' to allow optional productId
    await trackLead(
      dealerId,
      undefined,
      type === 'CALL' ? 'VIEW_CONTACT' : 'WHATSAPP',
    );

    if (type === 'WHATSAPP') {
      const cleanNumber = phoneNumber.replace(/\D/g, '');
      const waNumber = cleanNumber.startsWith('0')
        ? '233' + cleanNumber.substring(1)
        : cleanNumber;
      window.open(`https://wa.me/${waNumber}`, '_blank');
    } else {
      window.location.href = `tel:${phoneNumber}`;
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          className='h-10 px-4 shadow-sm text-white flex items-center gap-2'
          style={{ backgroundColor: brandColor }}
        >
          <Phone className='h-4 w-4' /> Contact
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align='end'>
        <DropdownMenuItem
          onClick={() => handleAction('CALL')}
          className='cursor-pointer'
        >
          <Phone className='mr-2 h-4 w-4 text-blue-600' /> Call {phoneNumber}
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => handleAction('WHATSAPP')}
          className='cursor-pointer'
        >
          <MessageCircle className='mr-2 h-4 w-4 text-green-600' /> Chat on
          WhatsApp
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
