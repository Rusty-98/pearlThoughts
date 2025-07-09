import MockProviderA from "../providers/mockProviderA.js"
import MockProviderB from "../providers/mockProviderB.js"
import RateLimiter from "../utils/rateLimiter.js";
import retry from "../utils/retry.js";

class EmailService {
    constructor() {
        this.mockProviderA = new MockProviderA();
        this.mockProviderB = new MockProviderB();
        this.idempotencyCache = new Map();
        this.rateLimiter = new RateLimiter(5, 1000); // 5 requests per second
        this.failureCounts = { ProviderA: 0, ProviderB: 0 };
        this.circuitBreakerThreshold = 3; // 3 consecutive failures to open the circuit breaker
    }

    async sendEmail(email) {
        if (!this.rateLimiter.allow()) {
            throw new Error("Rate limit exceeded.");
        }

        const key = email.idempotencyKey;

        if (this.idempotencyCache.has(key)) {
            return this.idempotencyCache.get(key);
        }

        const retryCounts = { ProviderA: 0, ProviderB: 0 };

        const metaData = {
            status: "pending",
            provider: null,
            retries: {},
            timestamp: Date.now(),
            error: null
        };


        const trySend = async (provider, name) => {
            if (this.failureCounts[name] >= this.circuitBreakerThreshold) {
                console.log(`[${name}] Circuit breaker open`);
                throw new Error(`${name} circuit breaker triggered`);
            }

            console.log(`[${name}] Sending email to ${email.to}...`);

            let attempts = 0;
            try {
                await retry(async () => {
                    attempts++;
                    return provider.sendEmail(email);
                }, 3, 100);

                metaData.provider = name;
                this.failureCounts[name] = 0;
            } finally {
                retryCounts[name] = attempts;
            }
        };

        try {
            await trySend(this.mockProviderA, 'ProviderA');
            metaData.status = 'success';
        } catch (e1) {
            console.log("ProviderA failed, switching to ProviderB...");
            this.failureCounts['ProviderA']++;
            try {
                await trySend(this.mockProviderB, 'ProviderB');
                metaData.status = 'fallback';
            } catch (e2) {
                metaData.status = 'failed';
                metaData.error = e2.message;
                this.failureCounts['ProviderB']++;
                metaData.retries = retryCounts;
                this.idempotencyCache.set(key, metaData);
                throw new Error("Both providers failed.");
            }
        }

        metaData.retries = retryCounts;
        this.idempotencyCache.set(key, metaData);
        return metaData;
    }

    getStatus(idempotencyKey) {
        return this.idempotencyCache.get(idempotencyKey) || {
            status: 'not found',
            provider: null,
            retries: { ProviderA: 0, ProviderB: 0 },
            error: 'No record found'
        };
    }
}

export default EmailService;