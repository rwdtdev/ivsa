import promClient from 'prom-client';
import getMetricsRegistry from '@/utils/metrics';

export async function GET() {
  const registry = getMetricsRegistry(promClient, 'asvi');

  return new Response(await registry.metrics(), { status: 200 });
}
