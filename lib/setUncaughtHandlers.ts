import { Logger } from './logger';

export const setUncaughtHandlers = ({ logger }: { logger: Logger }) => {
  process.on('uncaughtException', (err) => {
    logger.error('Uncaught exception occured:', err.stack || err);
    process.exit(-1);
  });

  process.on('unhandledRejection', (err: Error) => {
    logger.error('Unhandled rejection occured: ', err.stack || err);
    process.exit(-1);
  });
};
