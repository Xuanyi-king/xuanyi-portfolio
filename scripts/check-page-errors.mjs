import { chromium, firefox, webkit } from 'playwright';
import assert from 'node:assert/strict';
import { watchPageErrors, webkitFetchDiagnostic } from './page-errors.mjs';

const base = 'http://localhost:4187';
async function observed(predicate) {
  const deadline = Date.now() + 5000;
  while (!predicate() && Date.now() < deadline) await new Promise(resolve => setTimeout(resolve, 20));
  assert.ok(predicate(), 'runtime observer did not receive the sentinel within 5 seconds');
}
const native = new Error('/localhost:4187/work/ due to access control checks.');
native.name = 'Fetch API cannot load http';
native.stack = 'Fetch API cannot load http://localhost:4187/work/ due to access control checks.\n at fetch';
assert.equal(webkitFetchDiagnostic(native, 'webkit', base), base + '/work/');
assert.equal(webkitFetchDiagnostic(native, 'chromium', base), null);
assert.equal(webkitFetchDiagnostic(native, 'webkit', 'http://other.example'), null);
assert.equal(webkitFetchDiagnostic(new TypeError('Failed to fetch'), 'webkit', base), null);

for (const [engine, type] of Object.entries({ chromium, firefox, webkit })) {
  const browser = await type.launch();
  try {
    const page = await browser.newPage(), errors = [];
    const diagnostics = await watchPageErrors(page, engine, errors, base);
    await page.goto('data:text/html,<title>Error observer sentinel</title>');
    await page.evaluate(() => setTimeout(() => { throw new Error('sentinel-thrown'); }, 0));
    await observed(() => errors.some(s => s.startsWith('window.error:')));
    await observed(() => errors.some(s => s.includes('sentinel-thrown')));
    errors.length = 0;
    await page.evaluate(() => { void Promise.reject(new Error('sentinel-rejected')); });
    await observed(() => errors.some(s => s.includes('unhandledrejection') && s.includes('sentinel-rejected')));
    errors.length = 0;
    // A real exception mimicking the native Inspector text MUST still fail.
    await page.evaluate(() => setTimeout(() => {
      const error = new Error('/localhost:4187/work/ due to access control checks.');
      error.name = 'Fetch API cannot load http';
      error.stack = 'Fetch API cannot load http://localhost:4187/work/ due to access control checks.\n at fetch';
      throw error;
    }, 0));
    await observed(() => errors.some(s => s.startsWith('window.error:')));
    // WebKit intentionally hides evaluated-script text as "Script error." on
    // opaque data: documents, but the actual DOM error must still be fatal.
    assert.ok(errors.some(s => s.startsWith('window.error:')), JSON.stringify(errors));
    errors.length = 0;
    // Verify observers survive a real document replacement.
    await page.goto('data:text/html,<title>Next document</title>');
    await page.evaluate(() => setTimeout(() => { throw new Error('sentinel-next-document'); }, 0));
    await observed(() => errors.some(s => s.startsWith('window.error:')));
    await observed(() => errors.some(s => s.includes('sentinel-next-document')));
    console.log(engine, 'all exception/rejection sentinels caught; diagnostics retained:', diagnostics.length);
  } finally { await browser.close(); }
}
