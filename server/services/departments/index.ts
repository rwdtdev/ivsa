export const getAllDepartments = async () => {
  return prisma.department.findMany();
};
