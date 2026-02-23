import { Loader2 } from 'lucide-react';

export default function LoadingSpinner({
  text = 'Loading...',
}: {
  text?: string;
}) {
  return (
    <div className='flex h-[50vh] w-full items-center justify-center text-gray-500'>
      <Loader2 className='mr-3 h-6 w-6 animate-spin text-blue-600' />
      <span className='font-semibold text-lg'>{text}</span>
    </div>
  );
}
