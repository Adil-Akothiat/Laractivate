import http from 'k6/http';
import { sleep, check } from 'k6';

// Define the workload options
export const options = {
    stages: [
        { duration: '30s', target: 20 },  // Ramp up to 20 users
        { duration: '1m', target: 20 },   // Stay at 20 users (stress test)
        { duration: '30s', target: 0 },   // Ramp down to 0
    ],
};

export default function () {
    // 1. Fire the request
    // https://legendary-rotary-phone-rprxww65vxw3xv4j-8000.app.github.dev/
    const res = http.get('https://legendary-rotary-phone-rprxww65vxw3xv4j-8000.app.github.dev/api/billing/pricing');

    // 2. Validate the response status is 200
    check(res, {
        'status is 200': (r) => r.status === 200,
    });
}


// export const options = {
//     stages: [
//         { duration: '30s', target: 20 },  // Ramp up to 20 users
//         { duration: '1m', target: 20 },   // Stay at 20 users (stress test)
//         { duration: '30s', target: 0 },   // Ramp down to 0
//     ],
// };