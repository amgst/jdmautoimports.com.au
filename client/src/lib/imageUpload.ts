/**
 * Upload a single image file to the server
 * @param file - The image file to upload
 * @returns Promise resolving to the image URL
 */
export async function uploadImage(file: File): Promise<string> {
  const formData = new FormData();
  formData.append("image", file);

  const response = await fetch("/api/upload/image", {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    // Check if response is HTML (error page) instead of JSON
    const contentType = response.headers.get("content-type");
    if (contentType && contentType.includes("text/html")) {
      const text = await response.text();
      console.error("Server returned HTML instead of JSON:", text.substring(0, 200));
      throw new Error("Server error: Received HTML response instead of JSON. Please check server logs.");
    }
    
    try {
      const error = await response.json();
      throw new Error(error.error || "Failed to upload image");
    } catch (e) {
      if (e instanceof Error && e.message.includes("Server error")) {
        throw e;
      }
      throw new Error("Upload failed: " + response.statusText);
    }
  }

  const data = await response.json();
  return data.url;
}

/**
 * Validate if a file is an image
 * @param file - The file to validate
 * @returns boolean indicating if the file is an image
 */
export function isImageFile(file: File): boolean {
  return file.type.startsWith("image/");
}

/**
 * Validate file size (max 5MB by default)
 * @param file - The file to validate
 * @param maxSizeMB - Maximum size in MB (default: 5)
 * @returns boolean indicating if the file is within size limit
 */
export function isValidFileSize(file: File, maxSizeMB: number = 5): boolean {
  const maxSizeBytes = maxSizeMB * 1024 * 1024;
  return file.size <= maxSizeBytes;
}

/**
 * Create a preview URL for an image file (for display before upload)
 * @param file - The image file
 * @returns Object URL that should be revoked after use
 */
export function createImagePreview(file: File): string {
  return URL.createObjectURL(file);
}

/**
 * Revoke an object URL to free memory
 * @param url - The object URL to revoke
 */
export function revokeImagePreview(url: string): void {
  URL.revokeObjectURL(url);
}

