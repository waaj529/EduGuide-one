export interface FileValidationResult {
  isValid: boolean;
  error?: string;
  details: {
    name: string;
    size: number;
    type: string;
    extension: string;
    isSupported: boolean;
  };
}

// Comprehensive file type support
export const SUPPORTED_FILE_TYPES = {
  // Document types
  'application/pdf': ['.pdf'],
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
  'application/msword': ['.doc'],
  'application/vnd.openxmlformats-officedocument.presentationml.presentation': ['.pptx'],
  'application/vnd.ms-powerpoint': ['.ppt'],
  'text/plain': ['.txt'],
  'application/rtf': ['.rtf'],
  'application/vnd.oasis.opendocument.text': ['.odt'],
  'application/vnd.oasis.opendocument.presentation': ['.odp'],
  
  // Image types
  'image/jpeg': ['.jpg', '.jpeg'],
  'image/png': ['.png'],
  'image/gif': ['.gif'],
  'image/bmp': ['.bmp'],
  'image/tiff': ['.tiff', '.tif'],
  'image/webp': ['.webp'],
  
  // Audio types
  'audio/mpeg': ['.mp3'],
  'audio/wav': ['.wav'],
  'audio/mp4': ['.m4a'],
  'audio/aac': ['.aac']
};

export function validateFile(file: File, maxSizeMB: number = 10): FileValidationResult {
  const extension = '.' + file.name.split('.').pop()?.toLowerCase();
  const mimeType = file.type;
  
  const details = {
    name: file.name,
    size: file.size,
    type: mimeType || 'unknown',
    extension,
    isSupported: false
  };

  // Check if file is empty
  if (file.size === 0) {
    return {
      isValid: false,
      error: 'File is empty',
      details
    };
  }

  // Check file size
  if (file.size > maxSizeMB * 1024 * 1024) {
    return {
      isValid: false,
      error: `File size exceeds ${maxSizeMB}MB limit`,
      details
    };
  }

  // Get all supported extensions
  const allSupportedExtensions = Object.values(SUPPORTED_FILE_TYPES).flat();
  
  // Check if extension is supported
  if (!allSupportedExtensions.includes(extension)) {
    return {
      isValid: false,
      error: `Unsupported file type: ${extension}`,
      details
    };
  }

  details.isSupported = true;

  // Validate MIME type if provided
  if (mimeType && SUPPORTED_FILE_TYPES[mimeType]) {
    const expectedExtensions = SUPPORTED_FILE_TYPES[mimeType];
    if (!expectedExtensions.includes(extension)) {
      console.warn(`MIME type mismatch: ${mimeType} vs ${extension}`);
      // Don't fail validation, just warn
    }
  }

  return {
    isValid: true,
    details
  };
}

export function createFormDataWithFile(file: File, additionalData?: Record<string, string>): FormData {
  const formData = new FormData();
  
  // Add the file
  formData.append('file', file);
  
  // Add any additional data
  if (additionalData) {
    Object.entries(additionalData).forEach(([key, value]) => {
      formData.append(key, value);
    });
  }
  
  return formData;
}

export async function fetchWithTimeout(
  url: string, 
  options: RequestInit, 
  timeoutMs: number = 30000
): Promise<Response> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);
  
  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal
    });
    clearTimeout(timeoutId);
    return response;
  } catch (error) {
    clearTimeout(timeoutId);
    if (error.name === 'AbortError') {
      throw new Error('Request timeout: The server took too long to respond');
    }
    throw error;
  }
}

export function getFileTypeCategory(file: File): 'document' | 'image' | 'audio' | 'unknown' {
  const mimeType = file.type;
  
  if (mimeType.startsWith('application/') && 
      (mimeType.includes('pdf') || mimeType.includes('word') || 
       mimeType.includes('presentation') || mimeType.includes('document'))) {
    return 'document';
  }
  
  if (mimeType.startsWith('image/')) {
    return 'image';
  }
  
  if (mimeType.startsWith('audio/')) {
    return 'audio';
  }
  
  // Fallback to extension-based detection
  const extension = '.' + file.name.split('.').pop()?.toLowerCase();
  const docExtensions = ['.pdf', '.doc', '.docx', '.ppt', '.pptx', '.txt', '.rtf', '.odt', '.odp'];
  const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.bmp', '.tiff', '.webp'];
  const audioExtensions = ['.mp3', '.wav', '.m4a', '.aac'];
  
  if (docExtensions.includes(extension)) return 'document';
  if (imageExtensions.includes(extension)) return 'image';
  if (audioExtensions.includes(extension)) return 'audio';
  
  return 'unknown';
} 