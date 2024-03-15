'use server';

import { DepartmentService } from '@/core/department/DepartmentService';

export async function getDepartmentsAction() {
  const departmentService = new DepartmentService();

  return departmentService.getAll();
}
