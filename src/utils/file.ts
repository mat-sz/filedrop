import filesize from 'filesize';

import { FileType } from '../types/FileType';

export function fileType(type?: string): FileType {
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
}

export function formatFileName(
  name: string,
  fileNameLength = 32,
  replacementCharacter = '…'
): string {
  const dotIndex = name.lastIndexOf('.');
  const half = Math.floor(fileNameLength / 2);

  if (dotIndex !== -1) {
    const extension = name.substr(dotIndex);
    const fileName = name.substr(0, dotIndex);

    if (fileName.length > fileNameLength) {
      return (
        fileName.substr(0, half) +
        replacementCharacter +
        fileName.substr(fileName.length - (half + 1)) +
        extension
      );
    }
  } else if (name.length > 24) {
    return (
      name.substr(0, half) +
      replacementCharacter +
      name.substr(name.length - (half + 1))
    );
  }

  return name;
}

export function formatFileSize(size: number): string {
  return filesize(size, { pad: true, precision: 3 });
}
