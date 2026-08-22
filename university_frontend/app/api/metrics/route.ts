import { NextResponse } from 'next/server';
import client from 'prom-client';

export const dynamic = 'force-dynamic';

// Initialize Prometheus registry as a global singleton to prevent re-registration in Next.js hot reload / serverless functions
const globalForPrometheus = globalThis as unknown as {
  prometheusRegister?: client.Registry;
};

const register =
  globalForPrometheus.prometheusRegister ??
  (() => {
    const reg = new client.Registry();
    client.collectDefaultMetrics({
      register: reg,
      prefix: 'sit_frontend_',
    });
    return reg;
  })();

if (process.env.NODE_ENV !== 'production') {
  globalForPrometheus.prometheusRegister = register;
}

export async function GET() {
  const metrics = await register.metrics();
  return new NextResponse(metrics, {
    status: 200,
    headers: {
      'Content-Type': register.contentType,
      'Cache-Control': 'no-store, max-age=0',
    },
  });
}
