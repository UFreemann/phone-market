'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Check, CheckCircle2, ChevronDown, ChevronUp } from 'lucide-react';
import { initializePayment } from '@/actions/initialize-payment';
import BackButton from '@/components/ui/BackButton';

type Props = {
  currentTier: string;
  isActive: boolean;
  dbPlans: any[];
  gridCols?: number;
};

export default function SubscribeClient({
  currentTier,
  isActive,
  dbPlans,
}: Props) {
  const [duration, setDuration] = useState('1_MONTH');

  const DURATION_OPTIONS = [
    { id: '1_MONTH', label: 'Monthly' },
    { id: '3_MONTHS', label: 'Quarterly' },
    { id: '6_MONTHS', label: 'Biannual (Save 10%)' },
    { id: '1_YEAR', label: 'Yearly (Save 20%)' },
  ];

  return (
    <div className='min-h-screen bg-gray-50 flex flex-col'>
      {/* HEADER */}
      <div className='bg-gradient-to-r from-blue-700 to-blue-900 border-b h-16 flex items-center justify-between px-4 md:px-8 sticky top-0 z-50 shadow-sm text-white'>
        <div className='flex items-center gap-4'>
          <BackButton />
          <h1 className='text-lg font-semibold text-white'>
            Subscription Plans
          </h1>
        </div>
        <div className='text-xs text-blue-100 animate-pulse'>
          Current: <span className='font-bold text-white'>{currentTier}</span>
        </div>
      </div>

      <div className='flex-1 flex flex-col items-center p-4 py-8'>
        {/* DURATION TOGGLE */}
        <div className='text-center mb-10 w-full max-w-4xl'>
          <h2 className='text-3xl font-bold mb-6 text-gray-900'>
            Select Billing Cycle
          </h2>

          {isActive && (
            <div className='mb-6 inline-flex items-center gap-2 bg-blue-100 text-blue-800 px-4 py-2 rounded-full text-sm font-medium border border-blue-100'>
              <Check className='h-4 w-4' /> Plan Active: {currentTier}
            </div>
          )}

          <div className='flex flex-wrap justify-center gap-2 bg-white p-1.5 rounded-xl border shadow-sm mx-auto w-fit'>
            {DURATION_OPTIONS.map((opt) => (
              <button
                key={opt.id}
                onClick={() => setDuration(opt.id)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  duration === opt.id
                    ? 'bg-gray-900 text-white shadow-md'
                    : 'text-gray-500 hover:bg-gray-100 hover:text-gray-900'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        {/* PLANS GRID */}
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-8 max-w-7xl w-full px-4 items-start relative z-0'>
          {/* STATIC FREE PLAN */}
          <PricingCard
            title='Starter'
            price='Free Trial'
            tier='FREE'
            features={[
              '10 Active Listings',
              'Basic Profile',
              'Valid for 7 Days',
            ]}
            btnText={
              isActive && currentTier === 'FREE'
                ? 'Trial Active'
                : 'Start 7-Day Trial'
            }
            isDisabled={isActive}
            isCurrent={currentTier === 'FREE' && isActive}
            duration='1_MONTH'
            theme={{
              headerBg: 'bg-slate-100',
              textColor: 'text-slate-800',
              badgeColor: 'bg-slate-200 text-slate-700',
              iconColor: 'text-slate-400',
            }}
            description='Limited Access'
          />

          {/* DYNAMIC DB PLANS */}
          {dbPlans.map((plan) => (
            <PricingCard
              key={plan.id}
              planId={plan.id}
              title={plan.name}
              tier={plan.tier}
              basePrice={plan.price}
              duration={duration}
              features={plan.features}
              recommended={plan.isPopular}
              btnText={plan.buttonText}
              description={plan.description}
              isDisabled={isActive && currentTier === plan.tier}
              isCurrent={currentTier === plan.tier && isActive}
              theme={plan.theme}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

// --- PRICING CARD COMPONENT ---
function PricingCard({
  planId,
  title,
  tier,
  duration,
  features,
  btnText,
  recommended,
  price: staticPrice,
  basePrice,
  description: staticDesc,
  isDisabled,
  isCurrent,
  theme,
}: any) {
  const [isExpanded, setIsExpanded] = useState(false);
  const visibleFeatures =
    isExpanded || features.length <= 4 ? features : features.slice(0, 4);

  // Helper to determine if input is Tailwind Class or CSS Value
  const isCssValue = (val: string) =>
    val &&
    (val.includes('#') || val.includes('rgb') || val.includes('gradient'));

  // Price Calculation Logic
  const getPriceDetails = () => {
    if (tier === 'FREE') return { price: staticPrice, desc: staticDesc };

    let base = basePrice || 0;
    let multiplier = 1;
    let discount = 0;

    if (duration === '3_MONTHS') {
      multiplier = 3;
    }
    if (duration === '6_MONTHS') {
      multiplier = 6;
      discount = 0.1;
    }
    if (duration === '1_YEAR') {
      multiplier = 12;
      discount = 0.2;
    }

    const total = base * multiplier * (1 - discount);
    const monthlyEquivalent = total / multiplier;

    // let displayDesc = staticDesc || 'Subscription';
    // let displayDesc = `Billed as GH₵ ${monthlyEquivalent.toFixed(0)} / mo`;

    // if (duration !== '1_MONTH') {
    //   displayDesc = `Billed as GH₵ ${monthlyEquivalent.toFixed(0)} / mo`;
    // }

    // return {
    //   price: `GH₵ ${total.toLocaleString()}`,
    //   desc: displayDesc,
    // };
    let displayDesc = '';

    switch (duration) {
      case '1_MONTH':
        displayDesc = 'Billed Monthly';
        break;
      case '3_MONTHS':
        displayDesc = `Billed Quarterly (GH₵ ${monthlyEquivalent.toFixed(0)}/mo)`;
        break;
      case '6_MONTHS':
        displayDesc = `Billed every 6 Months (GH₵ ${monthlyEquivalent.toFixed(0)}/mo)`;
        break;
      case '1_YEAR':
        displayDesc = `Billed Yearly (GH₵ ${monthlyEquivalent.toFixed(0)}/mo)`;
        break;
      default:
        displayDesc = staticDesc || 'Subscription';
    }

    return {
      price: `GH₵ ${total.toLocaleString()}`, // The BIG number you pay now
      desc: displayDesc, // The small text explaining the cycle
    };
  };

  const { price, desc } = getPriceDetails();

  return (
    <Card
      className={`flex flex-col overflow-hidden transition-all duration-300 relative bg-white h-full ${
        recommended
          ? 'border-2 border-indigo-600 shadow-xl scale-105 z-10'
          : 'border border-gray-200 hover:shadow-lg'
      } ${isDisabled ? 'opacity-60 grayscale-[0.5]' : ''}`}
    >
      {recommended && (
        <div className='bg-indigo-600 text-white text-center text-xs font-bold uppercase tracking-widest py-1.5'>
          Most Popular
        </div>
      )}

      {/* HEADER */}
      <CardHeader
        className={`p-8 text-center space-y-4 ${!isCssValue(theme.headerBg) ? theme.headerBg : ''}`}
        style={isCssValue(theme.headerBg) ? { background: theme.headerBg } : {}}
      >
        <CardTitle
          className={`text-2xl font-black uppercase tracking-wide ${!isCssValue(theme.textColor) ? theme.textColor : ''}`}
          style={isCssValue(theme.textColor) ? { color: theme.textColor } : {}}
        >
          {title}
        </CardTitle>

        <div className='flex flex-col items-center'>
          <span
            className={`text-4xl font-extrabold ${!isCssValue(theme.textColor) ? theme.textColor : ''}`}
            style={
              isCssValue(theme.textColor) ? { color: theme.textColor } : {}
            }
          >
            {price}
          </span>

          {/* BADGE / PILL */}
          <span
            className={`mt-3 px-3 py-1 rounded-full text-xs font-bold tracking-wide backdrop-blur-sm ${!isCssValue(theme.badgeColor) ? theme.badgeColor : ''}`}
            style={{
              backgroundColor: isCssValue(theme.badgeColor)
                ? theme.badgeColor
                : undefined,
              color: isCssValue(theme.textColor) ? theme.textColor : undefined, // Inherit text color for badge text
            }}
          >
            {desc}
          </span>
        </div>
      </CardHeader>

      {/* <CardContent className='flex-1 p-8 bg-white'>
        <ul className='space-y-4'>
          {features.map((feature: string, i: number) => (
            <li
              key={i}
              className='flex items-start gap-3 text-sm text-gray-600 font-medium'
            >
              <CheckCircle2
                className={`h-5 w-5 flex-shrink-0 ${!isCssValue(theme.iconColor) ? theme.iconColor : ''}`}
                style={
                  isCssValue(theme.iconColor) ? { color: theme.iconColor } : {}
                }
              />
              <span className='leading-tight'>{feature}</span>
            </li>
          ))}
        </ul>
      </CardContent> */}
      <CardContent className='flex-1 p-8 bg-white'>
        <ul className='space-y-4'>
          {visibleFeatures.map((feature: string, i: number) => (
            <li
              key={i}
              className='flex items-start gap-3 text-sm text-gray-600 font-medium'
            >
              <CheckCircle2
                className={`h-5 w-5 flex-shrink-0 ${!isCssValue(theme.iconColor) ? theme.iconColor : ''}`}
                style={
                  isCssValue(theme.iconColor) ? { color: theme.iconColor } : {}
                }
              />
              <span className='leading-tight'>{feature}</span>
            </li>
          ))}
        </ul>

        {/* EXPAND BUTTON */}
        {features.length > 4 && (
          <button
            type='button'
            onClick={() => setIsExpanded(!isExpanded)}
            className='mt-6 flex items-center justify-center text-xs font-bold text-gray-500 hover:text-gray-900 w-full uppercase tracking-wide transition-colors group'
          >
            {isExpanded
              ? 'Show Less'
              : `View ${features.length - 4} More Benefits`}
            {isExpanded ? (
              <ChevronUp
                size={14}
                className='ml-1 group-hover:-translate-y-0.5 transition-transform'
              />
            ) : (
              <ChevronDown
                size={14}
                className='ml-1 group-hover:translate-y-0.5 transition-transform'
              />
            )}
          </button>
        )}
      </CardContent>

      <CardFooter className='p-6 bg-gray-50/50 border-t mt-auto'>
        {isDisabled ? (
          <Button
            disabled
            className='w-full h-12 font-bold bg-gray-200 text-gray-500 hover:bg-gray-200'
          >
            {isCurrent ? 'Current Plan' : btnText}
          </Button>
        ) : (
          <form action={initializePayment} className='w-full'>
            <input type='hidden' name='tier' value={tier} />
            <input type='hidden' name='planId' value={planId} />
            <input type='hidden' name='duration' value={duration} />
            <Button
              type='submit'
              className={`w-full h-12 text-lg font-bold shadow-md transition-transform active:scale-95 ${!isCssValue(theme.headerBg) ? theme.headerBg : ''}`}
              style={
                isCssValue(theme.headerBg) ? { background: theme.headerBg } : {}
              }
            >
              {btnText}
            </Button>
          </form>
        )}
      </CardFooter>
    </Card>
  );
}
