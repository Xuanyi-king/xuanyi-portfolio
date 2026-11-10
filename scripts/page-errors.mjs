// WebKit's Inspector reports native Fetch diagnostics through the same protocol
// channel as JavaScript exceptions (Playwright wkPage._onConsoleMessage).
// Observe real DOM exceptions/rejections independently; never suppress them.
export function webkitFetchDiagnostic(error, engine, base) {
  if (engine !== 'webkit' || !/^Fetch API cannot load https?$/.test(error.name)) return null;
  const first = error.stack?.split('\n')[0] ?? '';
  const match = /^Fetch API cannot load (https?:\/\/\S+) due to access control checks\.$/.exec(first);
  if (!match) return null;
  try {
    const url = new URL(match[1]);
    return url.origin === new URL(base).origin ? url.href : null;
  } catch { return null; }
}

export async function watchPageErrors(page, engine, errors, base) {
  const fetchDiagnostics = [];
  await page.exposeBinding('__xuanyiRuntimeError', (_source, kind, message) => {
    errors.push(`${kind}: ${message}`);
  });
  await page.addInitScript(() => {
    addEventListener('error', event => {
      if (typeof event.message === 'string')
        void globalThis.__xuanyiRuntimeError('window.error', event.message);
    });
    addEventListener('unhandledrejection', event => {
      void globalThis.__xuanyiRuntimeError('unhandledrejection', String(event.reason));
    });
  });
  page.on('pageerror', error => {
    const url = webkitFetchDiagnostic(error, engine, base);
    if (url) fetchDiagnostics.push({ url, message: error.stack, observedAt: page.url() });
    else errors.push(error.message);
  });
  return fetchDiagnostics;
}
