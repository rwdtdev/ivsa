'use server';
import { ActionService } from '@/core/action/ActionService';

export async function getAllMonitoringData() {
  const actionService = new ActionService();
  try {
    return await actionService.getAll();
  } catch (error) {
    console.debug(error);
  }
}
