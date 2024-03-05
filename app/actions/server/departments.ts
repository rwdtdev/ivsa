'use server';

import DepartmentService from '@/server/services/departments';

export async function getDepartmentsAction() {
  try {
    const departmentService = new DepartmentService();

    return departmentService.getAll();
  } catch (err) {
    throw err;
  }
}
