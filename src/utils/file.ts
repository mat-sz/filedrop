import { FileType } from '../types/FileType';

export const fileType = (type?: string) => {
  if (!type) {
    return FileType.UNKNOWN;
  }

  if (type.startsWith('text/') || type.includes('pdf')) {
    return FileType.TEXT;
  } else if (
    type.includes('zip') ||
    type.includes('rar') ||
    type.includes('7z') ||
    type.includes('compress')
  ) {
    return FileType.ARCHIVE;
  } else if (type.startsWith('image/')) {
    return FileType.IMAGE;
  } else if (type.startsWith('video/')) {
    return FileType.VIDEO;
  } else if (type.startsWith('audio/')) {
    return FileType.AUDIO;
  } else if (type.startsWith('application/')) {
    return FileType.BINARY;
  }

  return FileType.UNKNOWN;
};
