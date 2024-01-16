'use server';

import { getAllDepartments } from '@/server/services/departments';

export async function getDepartments() {
  try {
    return getAllDepartments();
  } catch (err) {
    throw err;
  }
}
