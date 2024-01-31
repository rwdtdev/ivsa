'use server';

import { getAllDepartments } from '@/server/services/departments';

export async function getDepartmentsAction() {
  try {
    return getAllDepartments();
  } catch (err) {
    throw err;
  }
}
