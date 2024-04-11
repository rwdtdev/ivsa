export const getEntityId = (pathname: string, offset: number = 1) => {
  const pathnameChunks = pathname.split('/');

  return pathnameChunks[pathnameChunks.length - offset] || null;
};
