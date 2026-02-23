'use client';

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

export default function FaqSection() {
  const faqs = [
    {
      question: 'Is it safe to buy phones here?',
      answer:
        "Absolutely. We verify every dealer on our platform by checking their business ID and physical location. Look for the Blue 'Verified' badge for extra peace of mind.",
    },
    {
      question: 'How do I contact a seller?',
      answer:
        "Simply click the 'Contact' button on any phone listing. You can choose to reveal their phone number or chat directly via WhatsApp instantly.",
    },
    {
      question: 'Do you offer delivery services?',
      answer:
        'Delivery depends on the individual dealer. Most dealers offer local delivery or pickup at their shop. You can discuss this directly with them via WhatsApp.',
    },
    {
      question: 'Can I return a phone if it has issues?',
      answer:
        'We recommend inspecting the phone thoroughly at the point of exchange. However, many of our verified dealers offer a warranty period (e.g., 7 days). Check the product description for details.',
    },
    {
      question: 'How do I become a dealer?',
      answer:
        "It's easy! Click 'Start Selling' at the top of the page, create an account, and upload your shop details. You get a 7-day free trial to test the platform.",
    },
  ];

  return (
    <section className='py-24 bg-gray-50'>
      <div className='max-w-4xl mx-auto px-6'>
        {/* Header */}
        <div className='text-center mb-16 space-y-4'>
          <h2 className='text-3xl md:text-4xl font-bold text-gray-900'>
            Frequently Asked Questions
          </h2>
          <p className='text-gray-500 max-w-2xl mx-auto text-lg'>
            Have questions? We're here to help.
          </p>
        </div>

        {/* Accordion */}
        <Accordion type='single' collapsible className='w-full space-y-4'>
          {faqs.map((faq, index) => (
            <AccordionItem
              key={index}
              value={`item-${index}`}
              className='bg-white border rounded-xl px-6 shadow-sm hover:shadow-md transition-shadow duration-300'
            >
              <AccordionTrigger className='text-left text-lg font-medium text-gray-800 py-6 hover:no-underline hover:text-blue-600 transition-colors'>
                {faq.question}
              </AccordionTrigger>
              <AccordionContent className='text-gray-500 pb-6 text-base leading-relaxed'>
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}
