// Read-only discovery. Starts no model turn and executes no Skill or Hook.
const { spawn } = require('node:child_process');
const path = require('node:path');
const readline = require('node:readline');
const cwd = path.resolve(__dirname, '../../..');
const names = new Set(['design-taste-frontend', 'prototype', 'vercel-react-best-practices', 'impeccable']);
const child = spawn('codex', ['app-server', '--stdio'], { cwd, stdio: ['pipe', 'pipe', 'pipe'] });
const result = { cwd, skills: null, hooks: null };
let finished = false;
const send = message => child.stdin.write(JSON.stringify(message) + '\n');
function finish(error) {
  if (finished) return;
  finished = true;
  clearTimeout(timer);
  child.kill();
  if (error) {
    console.error(error);
    process.exitCode = 1;
  } else console.log(JSON.stringify(result, null, 2));
}
const timer = setTimeout(() => finish('Codex discovery timed out after 25s'), 25000);
child.on('error', () => finish('Could not start codex app-server'));
child.on('exit', () => { if (!finished) finish('Codex app-server exited before discovery completed'); });
// Do not copy process stderr or configuration to a report; they may contain local context.
child.stderr.resume();
readline.createInterface({ input: child.stdout }).on('line', line => {
  let message;
  try { message = JSON.parse(line); } catch { return; }
  if (![1, 2, 3].includes(message.id)) return;
  if (message.error) return finish('Codex discovery request failed: ' + JSON.stringify(message.error));
  if (message.id === 1) {
    send({ method: 'initialized', params: {} });
    send({ id: 2, method: 'skills/list', params: { cwds: [cwd], forceReload: true } });
  } else if (message.id === 2) {
    result.skills = message.result.data.map(row => ({
      cwd: row.cwd,
      skills: row.skills.filter(skill => names.has(skill.name)),
      errors: row.errors,
    }));
    send({ id: 3, method: 'hooks/list', params: { cwds: [cwd] } });
  } else {
    result.hooks = message.result;
    finish();
  }
});
send({ id: 1, method: 'initialize', params: {
  clientInfo: { name: 'xuanyi-skill-audit', version: '1.0.0' },
  capabilities: { experimentalApi: true },
} });
