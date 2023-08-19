import { loadImage } from 'imtool/lib/utils/file.js';
import { iOS } from './browser.js';

// From: https://github.com/GoogleChromeLabs/pwacompat/blob/master/src/pwacompat.js

function contextForCanvas({ width, height } = { width: 1, height: 1 }) {
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  return canvas.getContext('2d')!;
}

interface SplashOptions {
  width: number;
  height: number;
  orientation: string;
  icon: HTMLImageElement;
  backgroundColor: string;
}

function splashFor({
  width,
  height,
  orientation,
  icon,
  backgroundColor,
}: SplashOptions) {
  const idealSplashIconSize = 128;
  const minimumSplashIconSize = 48;
  const splashIconPadding = 20;

  const ratio = window.devicePixelRatio;
  const ctx = contextForCanvas({
    width: width * ratio,
    height: height * ratio,
  });

  ctx.scale(ratio, ratio);
  ctx.fillStyle = backgroundColor;
  ctx.fillRect(0, 0, width, height);
  ctx.translate(width / 2, (height - splashIconPadding) / 2);

  if (icon) {
    let iconWidth = icon.width / ratio;
    let iconHeight = icon.height / ratio;
    if (iconHeight > idealSplashIconSize) {
      iconWidth /= iconHeight / idealSplashIconSize;
      iconHeight = idealSplashIconSize;
    }

    if (
      iconWidth >= minimumSplashIconSize &&
      iconHeight >= minimumSplashIconSize
    ) {
      ctx.drawImage(
        icon,
        iconWidth / -2,
        iconHeight / -2,
        iconWidth,
        iconHeight
      );
      ctx.translate(0, iconHeight / 2 + splashIconPadding);
    }
  }

  return () => {
    const data = ctx.canvas.toDataURL();
    appendSplash(orientation, data);
    return data;
  };
}

const splash: Record<string, HTMLLinkElement> = {};

function appendSplash(orientation: string, data: string) {
  splash[orientation]?.remove();

  const generatedSplash = document.createElement('link');
  splash[orientation] = generatedSplash;
  generatedSplash.setAttribute('rel', 'apple-touch-startup-image');
  generatedSplash.setAttribute('media', `(orientation: ${orientation})`);
  generatedSplash.setAttribute('href', data);
  document.head.appendChild(generatedSplash);
}

export async function renderBothSplash(
  iconUrl: string,
  backgroundColor: string
) {
  // We only want to add this for iOS.
  if (!iOS) {
    return;
  }

  const icon = await loadImage(iconUrl);
  const s = window.screen;
  const portrait = splashFor({
    width: s.width,
    height: s.height,
    orientation: 'portrait',
    icon,
    backgroundColor,
  });
  const landscape = splashFor({
    width: s.height,
    height: s.width,
    orientation: 'landscape',
    icon,
    backgroundColor,
  });

  setTimeout(() => {
    portrait();
    setTimeout(() => {
      landscape();
    }, 10);
  }, 10);
}
