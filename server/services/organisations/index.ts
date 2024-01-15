export const getAllOrgnaisations = async () => {
  return prisma.organisation.findMany();
};
