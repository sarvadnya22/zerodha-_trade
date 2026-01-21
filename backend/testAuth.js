// Test signup and login
const axios = require('axios');

async function testAuth() {
    try {
        console.log('Testing Signup...');
        const signupRes = await axios.post('http://localhost:3002/signup', {
            email: 'testuser@example.com',
            password: 'testpass123',
            username: 'TestUser'
        }, { withCredentials: true });

        console.log('Signup Response:', signupRes.data);

        console.log('\nTesting Login...');
        const loginRes = await axios.post('http://localhost:3002/login', {
            email: 'testuser@example.com',
            password: 'testpass123'
        }, { withCredentials: true });

        console.log('Login Response:', loginRes.data);
    } catch (error) {
        console.error('Error:', error.message);
        if (error.response) {
            console.error('Response data:', error.response.data);
        }
    }
}

testAuth();
