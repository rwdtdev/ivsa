'use server';

import { getAllOrgnaisations } from '@/server/services/organisations';

export async function getOrganisationsAction() {
  try {
    return getAllOrgnaisations();
  } catch (err) {
    throw err;
  }
}
