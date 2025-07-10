# pearlThoughts
Intern Assignment of PearlThoughts making email sending service.

# 📧 Resilient Email Sending Service

A fault-tolerant email sending microservice built in JavaScript. This service uses **mock providers**, retry logic, circuit breakers, and rate limiting to ensure reliable email delivery — all while supporting idempotency and status tracking.

Designed for robustness, observability, and modularity, the service demonstrates clean architecture principles with minimal dependencies.


## 🚀 Key Features

- 🔁 **Retry with Exponential Backoff**  
  Retries failed requests up to 3 times with exponential delays.

- 🔄 **Fallback Between Providers**  
  Automatically switches to a backup provider if the primary fails.

- 🛡️ **Circuit Breaker Pattern**  
  Opens the circuit for a provider after 3 consecutive failures.

- ♻️ **Idempotent Sending**  
  Prevents duplicate email sends with an in-memory cache.

- 📉 **Rate Limiting**  
  Restricts to 5 requests per second globally.

- 🧾 **Status Tracking**  
  Retrieves metadata (status, provider, retry attempts, errors) for sent emails.

- 🔌 **Mock Providers**  
  Simulates real-world provider behavior (failures, delays, etc.)


## 🛠️ Tech Stack

| Technology      | Purpose                               |
| --------------- | ------------------------------------- |
| **Node.js** | Backend JavaScript runtime environment|
| **Express.js** | Web framework for building the API    |
| **JavaScript** | Core programming language (ESM)       |

---

## 🗂️ Project Structure

Here is a brief overview of the project's directory structure and the purpose of each folder.

```plaintext
/
├── src/
│   ├── controllers/
│   │   └── emailController.js  # Handles incoming HTTP requests and responses.
│   │
│   ├── providers/
│   │   ├── MockProviderA.js    # Simulates the primary email provider.
│   │   └── MockProviderB.js    # Simulates the backup email provider.
│   │
│   ├── routes/
│   │   └── emailRoutes.js      # Defines the API endpoints (e.g., /api/send-email).
│   │
│   ├── services/
│   │   └── EmailService.js     # Contains the core business logic for sending emails.
│   │
│   └── utils/
│       ├── circuitBreaker.js   # Implements the circuit breaker pattern.
│       ├── idempotencyCache.js # Manages the cache for idempotent requests.
│       ├── rateLimiter.js      # Provides rate limiting middleware.
│       └── retryHandler.js     # Manages the retry with exponential backoff logic.
│
├── .env.example                # Example environment variables file.
├── .gitignore                  # Specifies files for Git to ignore.
├── app.js                      # The main entry point for the Express application.

```


## 📡 API Endpoints

### 1. `POST /api/send-email`

Send an email request using idempotency logic and provider fallback.

#### ✅ Request Body:
```json
{
  "to": "recipient@example.com",
  "subject": "Hello",
  "body": "This is a test email",
  "idempotencyKey": "unique-key-123"
}
```

#### 🔁 Responses:

##### ✅ 200 OK
```json
{
  "status": "success",
  "provider": "ProviderA",
  "retries": {
    "ProviderA": 1,
    "ProviderB": 0
  },
  "timestamp": 1720585559922
}
```
##### ❌ 500 Internal Server Error
```json
{
  "error": "Both providers failed"
}
```

### 2. `GET /api/status/:idempotencyKey`

Retrieve the delivery status of a previously attempted email, based on the provided `idempotencyKey`.

#### 🔁 Response Example:
```json
{
  "status": "success",
  "provider": "ProviderA",
  "retries": {
    "ProviderA": 2,
    "ProviderB": 0
  },
  "error": null
}
```

#### 🧾 Response Fields:

| Field      | Type        | Description                                                             |
|------------|-------------|-------------------------------------------------------------------------|
| `status`   | `string`    | One of `"success"`, `"fallback"`, `"failed"`, or `"not found"`          |
| `provider` | `string`    | Either `"ProviderA"`, `"ProviderB"`, or `null` if not sent              |
| `retries`  | `object`    | Number of retry attempts per provider                                   |
| `error`    | `string null` | Error message (if sending failed), or `null` if successful            |

---

## ⚙️ Setup & Run

### 📦 Step 1: Clone the Repository

First, clone the project to your local machine using Git:

```bash
git clone https://github.com/your-username/resilient-email-service.git
cd resilient-email-service
```
### 📁 Step 2: Install Dependencies

Install the required Node.js packages using `npm`:

```bash
npm install
```
This will install all dependencies defined in the package.json file, including Express and other utilities needed to run the server.

### 🌐 Step 3: Run the Server

Start the server using the following command:

```bash
npm start
```
If successful, you’ll see a message like:

```bash
🚀 server is running !!
```
By default, the server will run at:

```
http://localhost:3000
```


### 📄 4. Project Configuration
By default, the app runs on port 3000. You can override this by creating a .env file:
```
PORT=5000
```

---


## 🧪 Manual Testing Guide

You can test the API manually using **Postman**, **curl**, or any API tool of your choice.


### 📤 1. Send an Email

#### Endpoint:
```
POST http://localhost:3000/api/send-email
```


#### Request Body:
```json
{
  "to": "user@example.com",
  "subject": "Welcome!",
  "body": "Thanks for signing up.",
  "idempotencyKey": "test-123"
}
```

### 📤 Example Using Curl:
```bash
curl -X POST http://localhost:3000/api/send-email \
  -H "Content-Type: application/json" \
  -d '{
    "to": "user@example.com",
    "subject": "Test Subject",
    "body": "Test body",
    "idempotencyKey": "unique-key-1"
}'
```

### ✅ Expected Success Response

```json
{
  "status": "success",
  "provider": "ProviderA",
  "retries": {
    "ProviderA": 1,
    "ProviderB": 0
  },
  "timestamp": 1720585559922
}
```
### ♻️ 2. Try Resending the Same Email (Idempotency)
Re-run the same request again with the same idempotencyKey.

✅ It should not send the email again and return the cached response.

### 🔄 3. Get Email Status
Endpoint:
```
GET http://localhost:3000/api/status/test-123
```
### 📤 Example Using Curl:

```bash
curl http://localhost:3000/api/status/test-123
```
### Expected Response:
```json
{
  "status": "success",
  "provider": "ProviderA",
  "retries": { "ProviderA": 1, "ProviderB": 0 },
  "error": null
}
```
### 🧪 4. Trigger Failures (Optional)

You can manually simulate failures to test fallback, retries, and the circuit breaker mechanism.

#### 🔧 How to Simulate Failure:

1. Open either `MockProviderA.js` or `MockProviderB.js`.
2. Temporarily set the failure rate to `1.0` (i.e., 100% failure):

```js
```
3. Restart the server. 
4. Re-run the *POST /api/send-email* request.

#### 🧪 What This Tests

- 🔁 **Retry Mechanism**  
  Automatically retries failed email attempts with exponential backoff.

- 🔄 **Fallback Provider**  
  If the primary provider fails, the service switches to the secondary one.

- 🧱 **Circuit Breaker**  
  After repeated failures, the circuit breaker trips to prevent overloading a failing provider.

---

#### ✅ Tips

- ⏳ **Rate Limiting:**  
  Wait **1–2 seconds** between requests to avoid hitting the rate limit (5 requests per second).

- 🔄 **Circuit Reset:**  
  If **both providers are tripped** (circuit breaker open), **restart the server** to reset state during testing.
