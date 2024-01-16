'use server';

import { getAllOrgnaisations } from '@/server/services/organisations';

export async function getOrganisations() {
  try {
    return getAllOrgnaisations();
  } catch (err) {
    throw err;
  }
}
