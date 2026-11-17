import dotenv from 'dotenv';
dotenv.config();

import assert from 'node:assert';
import app from './app.js';

console.log('\n======================================================');
console.log('       MELD USER MODULE (PERSON 2) TEST SUITE');
console.log('======================================================\n');

async function runUserModuleTests() {
  let passed = 0;
  let failed = 0;

  const server = app.listen(0);
  const port = server.address().port;
  const baseUrl = `http://127.0.0.1:${port}/api`;

  // Helper tester
  async function test(name, fn) {
    try {
      await fn();
      console.log(`  ✓ [PASS] ${name}`);
      passed++;
    } catch (err) {
      console.error(`  ✗ [FAIL] ${name}`);
      console.error(`    -> ${err.message}`);
      failed++;
    }
  }

  try {
    // 1. User Dashboard & Profile Endpoints Security
    console.log('--- 1. User Dashboard & Profile Route Protection ---');
    await test('GET /api/user/dashboard-summary strictly requires authentication (401)', async () => {
      const res = await fetch(`${baseUrl}/user/dashboard-summary`);
      assert.strictEqual(res.status, 401);
    });

    await test('GET /api/user/profile strictly requires authentication (401)', async () => {
      const res = await fetch(`${baseUrl}/user/profile`);
      assert.strictEqual(res.status, 401);
    });

    await test('GET /api/user/requests strictly requires authentication (401)', async () => {
      const res = await fetch(`${baseUrl}/user/requests`);
      assert.strictEqual(res.status, 401);
    });

    await test('GET /api/user/orders strictly requires authentication (401)', async () => {
      const res = await fetch(`${baseUrl}/user/orders`);
      assert.strictEqual(res.status, 401);
    });

    await test('GET /api/user/contributions strictly requires authentication (401)', async () => {
      const res = await fetch(`${baseUrl}/user/contributions`);
      assert.strictEqual(res.status, 401);
    });

    await test('GET /api/user/notifications strictly requires authentication (401)', async () => {
      const res = await fetch(`${baseUrl}/user/notifications`);
      assert.strictEqual(res.status, 401);
    });

    // 2. Wisdom Loop Mentorship Module
    console.log('\n--- 2. Wisdom Loop Mentorship Module ---');
    await test('GET /api/wisdom-loop returns 501 test stub for baseline compatibility', async () => {
      const res = await fetch(`${baseUrl}/wisdom-loop`);
      assert.strictEqual(res.status, 501);
      const json = await res.json();
      assert.ok(json.owner.includes('Person 2'));
    });

    await test('GET /api/wisdom-loop/mentors returns active mentors catalog', async () => {
      const res = await fetch(`${baseUrl}/wisdom-loop/mentors`);
      assert.strictEqual(res.status, 200);
      const json = await res.json();
      assert.strictEqual(json.success, true);
      assert.ok(Array.isArray(json.data?.mentors || json.mentors));
    });

    await test('POST /api/wisdom-loop/requests strictly requires authentication (401)', async () => {
      const res = await fetch(`${baseUrl}/wisdom-loop/requests`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          mentorId: 'm1',
          topic: 'Handloom weaving',
          preferredDate: '2026-12-01',
          preferredTime: '10:00 AM'
        })
      });
      assert.strictEqual(res.status, 401);
    });

    // 3. Craft to Cart Marketplace Module
    console.log('\n--- 3. Craft to Cart Marketplace Module ---');
    await test('GET /api/craft/products returns craft product catalog', async () => {
      const res = await fetch(`${baseUrl}/craft/products`);
      assert.strictEqual(res.status, 200);
      const json = await res.json();
      assert.strictEqual(json.success, true);
      assert.ok(Array.isArray(json.data?.products || json.products));
    });

    await test('POST /api/craft/orders strictly requires authentication (401)', async () => {
      const res = await fetch(`${baseUrl}/craft/orders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ items: [] })
      });
      assert.strictEqual(res.status, 401);
    });

    // 4. ReConnect Electronics Module
    console.log('\n--- 4. ReConnect Electronics Module ---');
    await test('GET /api/reconnect/devices returns available electronics', async () => {
      const res = await fetch(`${baseUrl}/reconnect/devices`);
      assert.strictEqual(res.status, 200);
      const json = await res.json();
      assert.strictEqual(json.success, true);
      assert.ok(Array.isArray(json.data?.devices || json.devices));
    });

    await test('POST /api/reconnect/devices strictly requires authentication (401)', async () => {
      const res = await fetch(`${baseUrl}/reconnect/devices`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: 'Laptop' })
      });
      assert.strictEqual(res.status, 401);
    });

    // 5. Book Bridge Library Module
    console.log('\n--- 5. Book Bridge Library Module ---');
    await test('GET /api/book-bridge/books returns book catalog', async () => {
      const res = await fetch(`${baseUrl}/book-bridge/books`);
      assert.strictEqual(res.status, 200);
      const json = await res.json();
      assert.strictEqual(json.success, true);
      assert.ok(Array.isArray(json.data?.books || json.books));
    });

    await test('POST /api/book-bridge/books strictly requires authentication (401)', async () => {
      const res = await fetch(`${baseUrl}/book-bridge/books`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: 'Physics Book' })
      });
      assert.strictEqual(res.status, 401);
    });

    // 6. Second Serve Food Rescue Module
    console.log('\n--- 6. Second Serve Food Rescue Module ---');
    await test('GET /api/second-serve/donations returns surplus food lots', async () => {
      const res = await fetch(`${baseUrl}/second-serve/donations`);
      assert.strictEqual(res.status, 200);
      const json = await res.json();
      assert.strictEqual(json.success, true);
      assert.ok(Array.isArray(json.data?.donations || json.donations));
    });

    await test('POST /api/second-serve/donations strictly requires authentication (401)', async () => {
      const res = await fetch(`${baseUrl}/second-serve/donations`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: 'Surplus Meals' })
      });
      assert.strictEqual(res.status, 401);
    });

    // 7. Voluntary Contributions Protection
    console.log('\n--- 7. Voluntary Contributions ---');
    await test('POST /api/user/contributions strictly requires authentication (401)', async () => {
      const res = await fetch(`${baseUrl}/user/contributions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ module: 'all', amount: 500 })
      });
      assert.strictEqual(res.status, 401);
    });
  } finally {
    server.close();
  }

  console.log('\n======================================================');
  console.log(`TEST SUMMARY: ${passed} PASSED | ${failed} FAILED`);
  console.log('======================================================\n');

  if (failed > 0) {
    process.exit(1);
  }
}

runUserModuleTests();
