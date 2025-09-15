// File utility functions

export const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

export const getFileIcon = (mimeType) => {
  if (!mimeType) return '📎';
  
  const iconMap = {
    // Documents
    'application/pdf': '📄',
    'application/msword': '📄',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document': '📄',
    
    // Spreadsheets
    'application/vnd.ms-excel': '📊',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': '📊',
    'text/csv': '📊',
    
    // Text files
    'text/plain': '📝',
    'application/json': '📋',
    'text/xml': '📋',
    'application/xml': '📋',
    
    // Images
    'image/jpeg': '🖼️',
    'image/jpg': '🖼️',
    'image/png': '🖼️',
    'image/gif': '🖼️',
    'image/webp': '🖼️',
    'image/svg+xml': '🖼️',
    
    // Archives
    'application/zip': '📦',
    'application/x-rar-compressed': '📦',
    'application/x-7z-compressed': '📦',
    
    // Audio
    'audio/mpeg': '🎵',
    'audio/wav': '🎵',
    'audio/mp3': '🎵',
    
    // Video
    'video/mp4': '🎬',
    'video/avi': '🎬',
    'video/quicktime': '🎬'
  };
  
  return iconMap[mimeType] || '📎';
};

export const getFileTypeVariant = (mimeType) => {
  if (!mimeType) return 'outline';
  
  const variantMap = {
    'application/pdf': 'destructive',
    'application/json': 'default',
    'text/plain': 'secondary',
    'text/csv': 'success',
    'image/jpeg': 'warning',
    'image/jpg': 'warning',
    'image/png': 'warning',
    'image/gif': 'warning',
    'application/vnd.ms-excel': 'success',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': 'success',
    'application/zip': 'secondary',
    'audio/mpeg': 'default',
    'video/mp4': 'default'
  };
  
  return variantMap[mimeType] || 'outline';
};

export const formatDate = (dateString) => {
  if (!dateString) return "N/A";
  return new Date(dateString).toLocaleDateString('tr-TR', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

export const getMimeTypeDisplayName = (mimeType) => {
  if (!mimeType) return 'Bilinmeyen';
  
  const displayNames = {
    'application/pdf': 'PDF Dökümanı',
    'application/json': 'JSON Dosyası',
    'text/plain': 'Metin Dosyası',
    'text/csv': 'CSV Dosyası',
    'image/jpeg': 'JPEG Resmi',
    'image/jpg': 'JPG Resmi',
    'image/png': 'PNG Resmi',
    'image/gif': 'GIF Resmi',
    'application/vnd.ms-excel': 'Excel Dosyası',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': 'Excel Dosyası',
    'application/zip': 'ZIP Arşivi',
    'audio/mpeg': 'MP3 Ses Dosyası',
    'video/mp4': 'MP4 Video Dosyası'
  };
  
  return displayNames[mimeType] || mimeType;
};

export const validateFileSize = (size, maxSize = 100 * 1024 * 1024) => {
  return size <= maxSize;
};

export const validateFileType = (mimeType, allowedTypes = []) => {
  if (allowedTypes.length === 0) return true;
  return allowedTypes.includes(mimeType);
};

export const sanitizeFileName = (fileName) => {
  // Remove potentially dangerous characters
  return fileName.replace(/[<>:"/\\|?*]/g, '_').trim();
};