import { useRef } from 'react';
import { FolderOpen, X } from 'lucide-react';

interface LocalImagePickerProps {
  selected: string[];
  onChange: (urls: string[]) => void;
  max?: number;
}

export const LocalImagePicker = ({ selected, onChange, max = 6 }: LocalImagePickerProps) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const readFile = (file: File): Promise<string> =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });

  const handleFiles = async (files: FileList | null) => {
    if (!files?.length) return;

    const remaining = max - selected.length;
    const toRead = Array.from(files)
      .filter((f) => f.type.startsWith('image/'))
      .slice(0, remaining);

    if (toRead.length === 0) return;

    const urls = await Promise.all(toRead.map(readFile));
    onChange([...selected, ...urls]);
  };

  return (
    <div className="space-y-4">
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple
        className="hidden"
        onChange={(e) => {
          handleFiles(e.target.files);
          e.target.value = '';
        }}
      />

      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        disabled={selected.length >= max}
        className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-orange-500/40 bg-orange-500/10 px-5 py-3.5 text-sm font-semibold text-orange-400 transition hover:bg-orange-500/20 disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
      >
        <FolderOpen className="h-5 w-5" />
        Choisir des photos 
      </button>

      <p className="text-xs text-slate-500">
        {selected.length}/{max} photo{max > 1 ? 's' : ''} — la première sera l&apos;image principale
      </p>

      {selected.length > 0 && (
        <div className="flex flex-wrap gap-3">
          {selected.map((url, index) => (
            <div key={`img-${index}`} className="group relative">
              <img
                src={url}
                alt={`Photo ${index + 1}`}
                className="h-24 w-24 rounded-xl object-cover ring-2 ring-orange-500/50"
              />
              {index === 0 && (
                <span className="absolute -top-2 left-2 rounded-full bg-orange-500 px-2 py-0.5 text-[10px] font-bold text-white">
                  Principale
                </span>
              )}
              <button
                type="button"
                onClick={() => onChange(selected.filter((_, i) => i !== index))}
                className="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full bg-rose-500 text-white"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
