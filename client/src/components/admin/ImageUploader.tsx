import React, { useState } from 'react';
import { UploadCloud, X, Check } from 'lucide-react';
import { uploadService } from '../../services/uploadService';
import { getImageUrl } from '../../utils/imageUrl';

interface ImageUploaderProps {
  images: string[];
  onChange: (images: string[]) => void;
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({ images, onChange }) => {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setIsUploading(true);
    setError(null);

    try {
      const file = files[0];
      const url = await uploadService.uploadImage(file);
      onChange([...images, url]);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to upload image');
    } finally {
      setIsUploading(false);
      // Reset input
      e.target.value = '';
    }
  };

  const handleRemove = (index: number) => {
    const updated = images.filter((_, i) => i !== index);
    onChange(updated);
  };

  return (
    <div className="space-y-4">
      <label className="block text-xs font-bold uppercase tracking-wider text-neutral-600">
        Product Images
      </label>

      {/* Grid of uploaded images */}
      <div className="flex flex-wrap gap-3">
        {images.map((img, idx) => (
          <div
            key={idx}
            className="relative w-24 h-32 border-2 border-black bg-white shadow-[2px_2px_0px_0px_#000000] overflow-hidden group"
          >
            <img src={getImageUrl(img)} alt={`Uploaded ${idx + 1}`} className="w-full h-full object-cover" />
            <button
              type="button"
              onClick={() => handleRemove(idx)}
              className="absolute top-1 right-1 p-1 bg-black text-white hover:bg-red-600 transition-colors cursor-pointer"
              aria-label="Remove image"
            >
              <X className="w-3.5 h-3.5" />
            </button>
            {idx === 0 && (
              <span className="absolute bottom-0 inset-x-0 bg-black/80 text-[9px] font-bold text-white text-center py-0.5 uppercase tracking-wide">
                Primary
              </span>
            )}
          </div>
        ))}

        {/* Upload box */}
        <label className="w-24 h-32 border-2 border-dashed border-neutral-400 hover:border-black bg-neutral-50 hover:bg-neutral-100 flex flex-col items-center justify-center p-2 text-center cursor-pointer transition-colors">
          <input
            type="file"
            accept="image/png,image/jpeg,image/webp"
            onChange={handleFileChange}
            disabled={isUploading}
            className="hidden"
          />
          {isUploading ? (
            <div className="flex flex-col items-center gap-1 text-neutral-500">
              <svg className="animate-spin h-5 w-5 text-black" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
              <span className="text-[10px] font-bold">Uploading...</span>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-1 text-neutral-600">
              <UploadCloud className="w-6 h-6 text-neutral-400" />
              <span className="text-[10px] font-bold uppercase tracking-wider">Add Image</span>
            </div>
          )}
        </label>
      </div>

      {error && <p className="text-xs text-red-600 font-semibold">{error}</p>}
    </div>
  );
};
