'use server';

import { getAllDepartments } from '@/server/services/departments';

export async function getDepartments() {
  return getAllDepartments();
}
