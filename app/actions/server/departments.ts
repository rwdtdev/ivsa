'use server';

import DepartmentService from '@/server/services/departments';

export async function getDepartmentsAction() {
  const departmentService = new DepartmentService();

  return departmentService.getAll();
}
