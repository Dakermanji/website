//! config/instrument.js

import * as Sentry from '@sentry/node';
import env from './dotenv.js';
import { nodeProfilingIntegration } from '@sentry/profiling-node';

Sentry.init({
	dsn: `https://${env.SENTRY_DSN}.ingest.us.sentry.io/${env.SENTRY_PROJECT_ID}`,
	integrations: [nodeProfilingIntegration()],
	// Tracing
	tracesSampleRate: 0.1, //  Capture 100% of the transactions
});

export default Sentry;
