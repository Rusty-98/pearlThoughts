
class MockProviderA {
    constructor() {
        this.name = "ProviderA";
        this.failureRate = 0.6; // 60% failure rate
        this.retryCount = 3; // 3 retries if failed
    }

    async sendEmail(email) {
        if (Math.random() < this.failureRate) {
            throw new Error("ProviderA failed to send email.");
        }
        console.log(`[ProviderA] Email sent to ${email.to}`);
    }
}

export default MockProviderA;