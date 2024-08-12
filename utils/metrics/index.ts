import {
  Counter,
  Gauge,
  Histogram,
  Summary,
  Registry,
  collectDefaultMetrics
} from 'prom-client';

/**
 * @param prometheus - Insance of prom-client
 * @param appName - Application name, got from process env
 * @param registry - Instance of prom-client registry
 */
export default function (prometheus: any, appName: string, registry?: any): Registry {
  const PrometheusRegistry = registry || prometheus.Registry;
  const metricsRegistry = new PrometheusRegistry();
  metricsRegistry.setDefaultLabels({ application: appName });

  const metrics = {
    errors_count: new prometheus.Counter({
      name: 'errors_count',
      help: 'Количество ошибок приложения',
      labelNames: ['exception', 'application', 'event'],
      registers: [metricsRegistry]
    }),
    http_request_total: new prometheus.Counter({
      name: 'http_request_total',
      help: 'Количество ошибок при регистрации устройств',
      labelNames: ['exception', 'application', 'method', 'uri'],
      registers: [metricsRegistry]
    }),
    STATUS: {
      SUCCESS: 'success',
      ERROR: 'error'
    }
  };

  collectDefaultMetrics({ register: metricsRegistry });

  return metricsRegistry;
}
