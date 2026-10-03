/**
 * Converts and compresses any user-uploaded image file (JPEG, PNG, HEIC, BMP, camera photos)
 * directly in the browser into an optimized, high-quality WebP file.
 * 
 * Benefits:
 * - Automatically changes format to .webp
 * - Resizes large camera photos (e.g. 15MB down to ~120KB)
 * - Prevents 413 Payload Too Large / big file size upload errors on mobile/Vercel
 */
export async function convertImageToWebP(
  file: File,
  maxWidth = 1600,
  quality = 0.82
): Promise<File> {
  // If not an image, return original file (e.g., PDF or video)
  if (!file.type.startsWith('image/') && !file.name.match(/\.(jpe?g|png|webp|bmp|gif|avif|heic|heif|tif|tiff)$/i)) {
    return file;
  }

  // If already small webp (< 400KB), no need to re-encode
  if (file.type === 'image/webp' && file.size < 400 * 1024) {
    return file;
  }

  // Ensure DOM / window is available
  if (typeof window === 'undefined' || typeof document === 'undefined') {
    return file;
  }

  return new Promise((resolve) => {
    try {
      const img = new Image();
      const objectUrl = URL.createObjectURL(file);

      img.onload = () => {
        try {
          URL.revokeObjectURL(objectUrl);
          let { width, height } = img;

          // Scale down if either dimension exceeds maxWidth
          if (width > maxWidth || height > maxWidth) {
            if (width > height) {
              height = Math.round((height * maxWidth) / width);
              width = maxWidth;
            } else {
              width = Math.round((width * maxWidth) / height);
              height = maxWidth;
            }
          }

          const canvas = document.createElement('canvas');
          canvas.width = Math.max(1, width);
          canvas.height = Math.max(1, height);
          const ctx = canvas.getContext('2d');

          if (!ctx) {
            resolve(file);
            return;
          }

          // Draw image on canvas
          ctx.drawImage(img, 0, 0, width, height);

          // Convert to WebP blob
          canvas.toBlob(
            (blob) => {
              if (!blob) {
                resolve(file);
                return;
              }

              const baseName = file.name.replace(/\.[^/.]+$/, '').replace(/[^a-zA-Z0-9_-]/g, '_');
              const newFile = new File([blob], `${baseName}.webp`, {
                type: 'image/webp',
                lastModified: Date.now(),
              });

              resolve(newFile);
            },
            'image/webp',
            quality
          );
        } catch (innerErr) {
          console.warn('Canvas conversion fallback:', innerErr);
          resolve(file);
        }
      };

      img.onerror = () => {
        URL.revokeObjectURL(objectUrl);
        resolve(file);
      };

      img.src = objectUrl;
    } catch (e) {
      console.warn('Image optimizer error, sending original:', e);
      resolve(file);
    }
  });
}
