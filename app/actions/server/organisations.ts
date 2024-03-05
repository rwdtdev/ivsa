'use server';

import OrganisationService from '@/server/services/organisations';

export async function getOrganisationsAction() {
  try {
    const organisationService = new OrganisationService();

    return organisationService.getAll();
  } catch (err) {
    throw err;
  }
}
