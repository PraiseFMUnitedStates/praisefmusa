
import React, { useState } from 'react';
import { supabase, isMock } from '../lib/supabase';

interface AvatarUploadProps {
  userId: string;
  onUpload: (url: string) => void;
}

const AvatarUpload: React.FC<AvatarUploadProps> = ({ userId, onUpload }) => {
  const [uploading, setUploading] = useState(false);

  const uploadAvatar = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;

    try {
      setUploading(true);

      const file = e.target.files[0];
      
      if (isMock) {
        const reader = new FileReader();
        reader.onloadend = async () => {
          const base64String = reader.result as string;
          await supabase.auth.updateUser({
            data: { avatar_url: base64String }
          });
          onUpload(base64String);
          setUploading(false);
        };
        reader.readAsDataURL(file);
        return;
      }

      const fileExt = file.name.split('.').pop();
      // Use a clean path: userId/timestamp.ext
      const filePath = `${userId}/${Date.now()}.${fileExt}`;

      // 1. Upload to Storage
      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file, { 
          upsert: true,
          cacheControl: '3600'
        });

      if (uploadError) {
        if (uploadError.message.includes('row-level security') || (uploadError as any).status === 403) {
          throw new Error('Supabase Storage RLS Error: Ensure the "avatars" bucket has a policy allowing INSERT for authenticated users.');
        }
        throw uploadError;
      }

      // 2. Get Public URL
      const { data } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath);

      const imageUrl = data.publicUrl;

      // 3. Update User Metadata
      const { error: updateAuthError } = await supabase.auth.updateUser({
        data: { avatar_url: imageUrl }
      });

      if (updateAuthError) throw updateAuthError;

      onUpload(imageUrl);

    } catch (error: any) {
      console.error('Avatar Upload Error:', error);
      alert(error.message || 'Error uploading image. Check console for details.');
    } finally {
      if (!isMock) setUploading(false);
    }
  };

  return (
    <div className="mt-4">
      <label className="inline-block">
        <input
          type="file"
          accept="image/*"
          onChange={uploadAvatar}
          disabled={uploading}
          className="hidden"
        />
        <div className={`cursor-pointer px-4 py-2 bg-black text-white text-[10px] font-normal uppercase tracking-widest hover:bg-praise-orange transition-all shadow-md active:scale-95 ${uploading ? 'opacity-50 cursor-not-allowed' : ''}`}>
          {uploading ? (
            <span className="flex items-center gap-2">
              <svg className="animate-spin h-3 w-3 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Updating...
            </span>
          ) : (
            'Update Photo'
          )}
        </div>
      </label>
    </div>
  );
};

export default AvatarUpload;
