'use server';

import { OrganisationService } from '@/core/organisation/OrganisationService';

export async function getOrganisationsAction() {
  const organisationService = new OrganisationService();

  return organisationService.getAll();
}
