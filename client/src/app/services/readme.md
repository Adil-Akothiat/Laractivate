# 🛡️ JWT Authentication: Silent Refresh & Concurrency Handling
## The "Stale Token" Challenge
When multiple API requests are fired simultaneously (e.g., via Promise.all), they are all initialized using the Old Access Token currently stored in the browser's cookies.

### The Problem Workflow:
Request A, B, and C are sent at the same time.
All three carry the Expired Token.

The Server returns a 401 EXPIRED_TOKEN for all three.

## The Solution: The "Pause & Re-Issue" Pattern
To prevent a race condition and handle the refresh securely, we implement a Lock & Queue system in our Axios Interceptor.

### 1. The Manager (First Request)
The first 401 response to arrive becomes the "Manager":
It sets isRefreshing = true.

It calls POST /auth/refresh-token.

Result: The Backend validates the Refresh Token and sends back a Set-Cookie header with a New Access Token.

### 2. The Passengers (Subsequent Requests)
While the Manager is busy, Requests B and C arrive:

They see isRefreshing === true.

They are pushed into the failedQueue array as Pending Promises.

They are effectively "frozen" in the browser's memory.

### 3. The Re-Issue (The "Magic" Step)
Once the Manager receives the new token from the server, it calls processQueue().

The Queue is Released: Every frozen request in the failedQueue is resolved.

The Retry: We don't just "resume" the old request; we call api(originalRequest).

The Update: Because api() creates a brand new HTTP call, the browser looks at the "Cookie Jar" again. It finds the New Token placed there by the Manager's refresh call.


## Why we use originalRequest._retry ?

### 1. The "Dead End" Scenario
Imagine your access_token is expired. The interceptor catches the 401 and says: "No problem, I'll go get a new one!" But what if your refresh_token is also expired (e.g., the user hasn't logged in for 2 weeks)?

**Request 1** (/profile) fails with 401.

**Interceptor** starts api.post('/auth/refresh-token').

**The Disaster**: The refresh call also returns a 401 because the refresh token is dead.

**Without _retry**: The interceptor would see that 401, think it's a normal expired token, and try to call /auth/refresh-token again.

**The Loop**: This repeats 100 times per second until your browser crashes or the server blocks your IP.

## 2. How _retry Acts as a "Stamp"
By setting originalRequest._retry = true, we are essentially "stamping" the request blueprint.

**First Attempt**: The stamp is missing. The interceptor says: "Okay, I'm allowed to try a refresh once."

**Second Attempt** (The Retry): If the request comes back to the interceptor a second time with a 401, the interceptor looks at the blueprint and sees the _retry: true stamp.

**The Decision**: It says: "Wait, I already tried to fix this once and it's still failing. I must stop now and send the user to the Login page."