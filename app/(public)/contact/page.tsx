'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Mail, MapPin, Phone, Send, CheckCircle2 } from 'lucide-react';
import { sendContactMessage } from '@/actions/contact'; // Import the action
import { Loader2 } from 'lucide-react'; // Import Loader
import { toast } from 'sonner'; // Optional: Use toast for errors

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);
  const [isSending, setIsSending] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSending(true);

    const formData = new FormData(e.currentTarget);
    const result = await sendContactMessage(formData);

    if (result.success) {
      setSubmitted(true);
    } else {
      toast.error(result.error || 'Something went wrong');
    }

    setIsSending(false);
  };

  return (
    <div className='min-h-screen bg-gray-50 flex items-center justify-center p-4 py-12'>
      <div className='max-w-5xl w-full grid grid-cols-1 md:grid-cols-2 shadow-2xl rounded-3xl overflow-hidden bg-white min-h-[600px]'>
        {/* LEFT COLUMN: CONTACT INFO */}
        <div className='bg-gradient-to-br from-blue-900 to-slate-900 p-10 text-white flex flex-col justify-between relative overflow-hidden'>
          {/* Background Decor */}
          <div className='absolute top-0 right-0 w-64 h-64 bg-blue-500 rounded-full mix-blend-overlay filter blur-3xl opacity-20 -mr-16 -mt-16 pointer-events-none' />
          <div className='absolute bottom-0 left-0 w-40 h-40 bg-purple-500 rounded-full mix-blend-overlay filter blur-3xl opacity-20 -ml-10 -mb-10 pointer-events-none' />

          <div className='relative z-10'>
            <h1 className='text-4xl font-bold mb-4 tracking-tight'>
              Get in touch
            </h1>
            <p className='text-blue-100 text-lg mb-10 leading-relaxed'>
              Have questions about buying, selling, or our premium plans? We're
              here to help you grow.
            </p>

            <div className='space-y-8'>
              <div className='flex items-center gap-5'>
                <div className='bg-white/10 p-3 rounded-full backdrop-blur-md border border-white/10 text-blue-200'>
                  <Phone size={24} />
                </div>
                <div>
                  <p className='text-xs text-blue-300 font-bold uppercase tracking-wider'>
                    Call Us
                  </p>
                  <p className='text-lg font-semibold'>+233 54 000 0000</p>
                </div>
              </div>

              <div className='flex items-center gap-5'>
                <div className='bg-white/10 p-3 rounded-full backdrop-blur-md border border-white/10 text-blue-200'>
                  <Mail size={24} />
                </div>
                <div>
                  <p className='text-xs text-blue-300 font-bold uppercase tracking-wider'>
                    Email Us
                  </p>
                  <p className='text-lg font-semibold'>
                    support@phonemarket.com
                  </p>
                </div>
              </div>

              <div className='flex items-center gap-5'>
                <div className='bg-white/10 p-3 rounded-full backdrop-blur-md border border-white/10 text-blue-200'>
                  <MapPin size={24} />
                </div>
                <div>
                  <p className='text-xs text-blue-300 font-bold uppercase tracking-wider'>
                    Visit Us
                  </p>
                  <p className='text-lg font-semibold'>
                    Accra Digital Center, Ghana
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className='mt-12 text-sm text-blue-200/60 relative z-10'>
            &copy; {new Date().getFullYear()} PhoneMarket Inc. All rights
            reserved.
          </div>
        </div>

        {/* RIGHT COLUMN: FORM */}
        <div className='p-8 md:p-12 flex flex-col justify-center bg-white'>
          {submitted ? (
            <div className='text-center animate-in fade-in zoom-in duration-500'>
              <div className='bg-green-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6'>
                <CheckCircle2 className='h-10 w-10 text-green-600' />
              </div>
              <h2 className='text-2xl font-bold text-gray-900 mb-2'>
                Message Sent!
              </h2>
              <p className='text-gray-500 mb-8'>
                Thank you for reaching out. Our team will get back to you within
                24 hours.
              </p>
              <Button
                onClick={() => setSubmitted(false)}
                variant='outline'
                className='h-12 px-8'
              >
                Send Another Message
              </Button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className='space-y-6'>
              <div>
                <h2 className='text-2xl font-bold text-gray-900 mb-1'>
                  Send us a Message
                </h2>
                <p className='text-gray-500 text-sm'>
                  Fill out the form below and we'll reply shortly.
                </p>
              </div>

              <div className='grid grid-cols-2 gap-4'>
                <div className='space-y-2'>
                  <label className='text-xs font-bold text-gray-500 uppercase tracking-wide'>
                    First Name
                  </label>
                  <Input
                    name='firstName'
                    placeholder='John'
                    required
                    className='bg-gray-50 border-gray-200 focus:bg-white transition-colors h-12'
                  />
                </div>
                <div className='space-y-2'>
                  <label className='text-xs font-bold text-gray-500 uppercase tracking-wide'>
                    Last Name
                  </label>
                  <Input
                    name='lastName'
                    placeholder='Doe'
                    required
                    className='bg-gray-50 border-gray-200 focus:bg-white transition-colors h-12'
                  />
                </div>
              </div>

              <div className='space-y-2'>
                <label className='text-xs font-bold text-gray-500 uppercase tracking-wide'>
                  Email Address
                </label>
                <Input
                  name='email'
                  type='email'
                  placeholder='john@example.com'
                  required
                  className='bg-gray-50 border-gray-200 focus:bg-white transition-colors h-12'
                />
              </div>

              <div className='space-y-2'>
                <label className='text-xs font-bold text-gray-500 uppercase tracking-wide'>
                  Message
                </label>
                <Textarea
                  name='message'
                  placeholder='How can we help you?'
                  required
                  className='min-h-[150px] bg-gray-50 border-gray-200 focus:bg-white transition-colors resize-none p-4'
                />
              </div>

              <Button
                type='submit'
                disabled={isSending}
                className='w-full bg-blue-600 hover:bg-blue-700 h-14 text-lg font-bold shadow-lg shadow-blue-900/10 transition-transform active:scale-[0.98]'
              >
                {isSending ? (
                  <Loader2 className='animate-spin' />
                ) : (
                  <>
                    Send Message <Send size={18} className='ml-2' />
                  </>
                )}{' '}
              </Button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
