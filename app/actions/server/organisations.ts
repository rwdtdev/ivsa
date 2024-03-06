'use server';

import OrganisationService from '@/server/services/organisations';

export async function getOrganisationsAction() {
  const organisationService = new OrganisationService();

  return organisationService.getAll();
}
