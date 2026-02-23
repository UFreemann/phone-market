'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Phone, MessageCircle, Eye } from 'lucide-react';
import { trackLead } from '@/actions/track-lead';

type Props = {
  phoneNumber: string;
  dealerId: string;
  productId: string;
};

export default function ContactButtons({
  phoneNumber,
  dealerId,
  productId,
}: Props) {
  const [showNumber, setShowNumber] = useState(false);

  const handleReveal = async () => {
    setShowNumber(true);
    console.log('Tracking Call Lead...');
    // Track the lead in the background
    await trackLead(dealerId, productId, 'VIEW_CONTACT');
  };

  const handleWhatsApp = async () => {
    // Also track WhatsApp clicks as leads
    await trackLead(dealerId, productId, 'WHATSAPP');

    // Open WhatsApp
    // Format number: Remove 0, add 233 (Assuming Ghana)
    const cleanNumber = phoneNumber.replace(/\D/g, ''); // Remove non-digits
    const waNumber = cleanNumber.startsWith('0')
      ? '233' + cleanNumber.substring(1)
      : cleanNumber;

    window.open(
      `https://wa.me/${waNumber}?text=Hi, I am interested in your phone on PhoneMarket.`,
      '_blank',
    );
  };

  return (
    <div className='space-y-3'>
      {/* Reveal Number Button */}
      {!showNumber ? (
        <Button
          onClick={handleReveal}
          size='lg'
          className='w-full bg-blue-600 hover:bg-blue-700 text-lg'
        >
          <Eye className='mr-2 h-5 w-5' /> Show Contact Number
        </Button>
      ) : (
        <Button
          size='lg'
          variant='outline'
          className='w-full text-lg font-bold border-blue-200 bg-blue-50 text-blue-800 cursor-text'
        >
          <Phone className='mr-2 h-5 w-5' /> {phoneNumber}
        </Button>
      )}

      {/* WhatsApp Button */}
      <Button
        onClick={handleWhatsApp}
        size='lg'
        className='w-full bg-green-500 hover:bg-green-600 text-white text-lg'
      >
        <MessageCircle className='mr-2 h-5 w-5' /> Chat on WhatsApp
      </Button>

      <p className='text-xs text-center text-gray-400 mt-2'>
        Safety Tip: Meet in a public place. Do not pay before seeing the item.
      </p>
    </div>
  );
}
