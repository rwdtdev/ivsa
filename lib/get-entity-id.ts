export const getEntityId = (pathname: string) => {
  const pathnameChunks = pathname.split('/');

  return pathnameChunks[pathnameChunks.length - 1] || null;
};
