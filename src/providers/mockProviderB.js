
class MockProviderB {
    constructor() {
        this.name = "ProviderB";
        this.failureRate = 0.4; // 40% failure rate
        this.retryCount = 3; // 3 retries if failed
    }

    async sendEmail(email) {
        if (Math.random() < this.failureRate) {
            throw new Error("ProviderB failed to send email.");
        }
        console.log(`[ProviderB] Email sent to ${email.to}`);
    }
}

export default MockProviderB;
