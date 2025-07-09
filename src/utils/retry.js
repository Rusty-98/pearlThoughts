// function for delay or wait for next attempt
function wait(ms) {
    return new Promise(resolve => {   
        setTimeout(resolve, ms);
    });
}

async function retry(fn, retries = 3, delay = 100) {
    for (let i = 0; i < retries; i++) {
        try {
            console.log(`Attempt ${i + 1}...`);
            return await fn(); // call email sender
        } catch (err) {
            console.log(`Attempt ${i + 1} failed: ${err.message}`);
            if (i === retries - 1) {
                console.log("All retry attempts failed.");
                throw err;
            }
            const waitTime = delay * Math.pow(2, i);
            console.log(`Waiting ${waitTime}ms before next retry...`);
            await wait(waitTime);
        }
    }
}

export default retry;
