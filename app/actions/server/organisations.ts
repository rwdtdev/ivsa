'use server';

import { getAllOrgnaisations } from '@/server/services/organisations';

export async function getOrganisations() {
  return getAllOrgnaisations();
}
