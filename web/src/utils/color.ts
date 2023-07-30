export const uuidToColor = (uuid?: string) => {
  if (!uuid) {
    return undefined;
  }

  const H = (parseInt(uuid.substring(0, 3), 16) / 0xfff) * 360;
  const S = (parseInt(uuid.substring(3, 6), 16) / 0xfff) * 25 + 50;
  const L = (parseInt(uuid.substring(9, 12), 16) / 0xfff) * 25 + 55;

  return `hsl(${H}deg, ${S}%, ${L}%)`;
};
