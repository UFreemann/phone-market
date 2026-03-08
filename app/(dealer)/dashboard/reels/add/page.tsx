'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { supabase } from '@/lib/supabase';
import { addReel } from '@/actions/add-reel';
import { Loader2, Video, UploadCloud } from 'lucide-react';
import BackButton from '@/components/ui/BackButton';

export default function AddReelPage() {
  const [uploading, setUploading] = useState(false);
  const [videoUrl, setVideoUrl] = useState('');
  const [status, setStatus] = useState<'idle' | 'saving'>('idle');

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.[0]) return;
    const file = e.target.files[0];

    // Limit size (e.g. 50MB)
    if (file.size > 50 * 1024 * 1024) {
      alert('File too large. Max 50MB.');
      return;
    }

    setUploading(true);
    const fileName = `reel-${Date.now()}`;
    const { error } = await supabase.storage
      .from('reels')
      .upload(fileName, file);

    if (!error) {
      const { data } = supabase.storage.from('reels').getPublicUrl(fileName);
      setVideoUrl(data.publicUrl);
    }
    setUploading(false);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus('saving');
    const formData = new FormData(e.currentTarget);
    formData.set('videoUrl', videoUrl);
    await addReel(formData);
  };

  return (
    <div className='max-w-2xl mx-auto'>
      <div className='flex items-center gap-4 mb-6'>
        <BackButton />
        <h1 className='text-2xl font-bold'>Post New Reel</h1>
      </div>

      <Card>
        <CardContent className='p-6'>
          <form onSubmit={handleSubmit} className='space-y-6'>
            {/* Video Upload */}
            <div className='space-y-2'>
              <label className='font-medium'>Upload Video (Max 50MB)</label>
              {videoUrl ? (
                <video
                  src={videoUrl}
                  controls
                  className='w-full h-64 bg-black rounded-lg'
                />
              ) : (
                <label className='border-2 border-dashed rounded-xl h-64 flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50'>
                  {uploading ? (
                    <Loader2 className='animate-spin' />
                  ) : (
                    <UploadCloud size={40} className='text-gray-400' />
                  )}
                  <span className='text-sm text-gray-500 mt-2'>
                    Click to upload video
                  </span>
                  <Input
                    type='file'
                    accept='video/*'
                    className='hidden'
                    onChange={handleUpload}
                    disabled={uploading}
                  />
                </label>
              )}
            </div>

            <div className='space-y-2'>
              <label className='font-medium'>Caption</label>
              <Textarea
                name='caption'
                placeholder='Tell us about this delivery...'
              />
            </div>

            <Button
              type='submit'
              className='w-full'
              disabled={!videoUrl || status === 'saving'}
            >
              {status === 'saving' ? 'Posting...' : 'Post Reel'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
