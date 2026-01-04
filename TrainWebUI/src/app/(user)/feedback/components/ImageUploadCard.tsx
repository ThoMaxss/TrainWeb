import { useRef } from "react";
import { Upload, X } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";

interface ImageUploadCardProps {
  uploadedImages: File[];
  onImageUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onRemoveImage: (index: number) => void;
}

export function ImageUploadCard({ uploadedImages, onImageUpload, onRemoveImage }: ImageUploadCardProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  return (
    <Card className="border-0 bg-background shadow-md">
      <div className="p-2">
        <Label className="mb-3 block text-lg font-semibold text-foreground">
          Thêm hình ảnh{" "}
          <span className="text-muted-foreground font-normal">(tùy chọn, tối đa 3 ảnh)</span>
        </Label>

        <div className="space-y-3">
          {/* Upload Button */}
          {uploadedImages.length < 3 && (
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="flex w-full items-center justify-center gap-2 rounded-lg border-2 border-dashed border-border p-2 transition-colors hover:border-primary hover:bg-primary/5"
            >
              <Upload className="h-5 w-5 text-muted-foreground" />
              <span className="text-muted-foreground">Chọn ảnh từ thiết bị</span>
            </button>
          )}

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple
            onChange={onImageUpload}
            className="hidden"
          />

          {/* Uploaded Images Preview */}
          {uploadedImages.length > 0 && (
            <div className="grid gap-3 sm:grid-cols-3">
              {uploadedImages.map((image, index) => (
                <div
                  key={index}
                  className="group relative overflow-hidden rounded-lg border"
                >
                  <img
                    src={URL.createObjectURL(image)}
                    alt={`Upload ${index + 1}`}
                    className="h-32 w-full object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => onRemoveImage(index)}
                    className="absolute right-2 top-2 flex h-6 w-6 items-center justify-center rounded-full bg-destructive text-primary-foreground opacity-0 transition-opacity group-hover:opacity-100"
                  >
                    <X className="h-4 w-4" />
                  </button>
                  <div className="absolute bottom-0 left-0 right-0 bg-black/60 p-2">
                    <p className="text-xs text-white truncate">
                      {image.name}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </Card>
  );
}
