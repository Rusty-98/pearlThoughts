
class RateLimiter {
    constructor(limit, windowMs) {
        this.limit = limit;
        this.windowMs = windowMs;
        this.timestamps = [];
    }

    allow() {
        const now = Date.now();
        this.timestamps = this.timestamps.filter(ts => now - ts < this.windowMs);
        if (this.timestamps.length < this.limit) {
            this.timestamps.push(now);
            return true;
        }
        return false;
    }
}

export default RateLimiter;
