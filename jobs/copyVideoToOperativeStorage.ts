import { Logger } from '@/lib/logger';

export default async function copyVideoToOperativeStorage(
  logger: Logger,
  options: Record<string, unknown>
) {
  logger.info('copyVideoToOperativeStorage job', options);
}
