#!/usr/bin/env node
const util = require('util');
const exec = util.promisify(require('child_process').exec);

function log(...args) { console.log('[migrate]', ...args); }
function err(...args) { console.error('[migrate][ERROR]', ...args); }

async function run(cmd, opts = {}){
  log(cmd);
  try{
    const res = await exec(cmd, { maxBuffer: 10 * 1024 * 1024, ...opts });
    if (res.stdout) process.stdout.write(res.stdout);
    if (res.stderr) process.stderr.write(res.stderr);
    return { code: 0, stdout: res.stdout, stderr: res.stderr };
  } catch(e) {
    const code = e.code || 1;
    if (e.stdout) process.stdout.write(e.stdout);
    if (e.stderr) process.stderr.write(e.stderr);
    err(cmd, 'exit code', code);
    return { code, stdout: e.stdout || '', stderr: e.stderr || String(e) };
  }
}

async function waitForDb(maxAttempts = 30, intervalMs = 2000){
  for(let i=1;i<=maxAttempts;i++){
    log(`Checking DB readiness (attempt ${i}/${maxAttempts})`);
    const r = await run('docker-compose exec db pg_isready -U db_user');
    if (r.code === 0) { log('DB is ready'); return true; }
    await new Promise(r => setTimeout(r, intervalMs));
  }
  return false;
}

async function main(){
  const args = process.argv.slice(2);
  const keep = args.includes('--keep');

  log('Bringing up Postgres (docker-compose up -d db)');
  await run('docker-compose up -d db');

  const ready = await waitForDb(30, 2000);
  if (!ready){
    err('Database did not become ready in time');
    process.exit(1);
  }

  log('Running TypeORM migrations (yarn migrate)');
  const mig = await run('yarn migrate');
  if (mig.code !== 0){
    err('Migrations command failed');
    // do not exit immediately; let user inspect logs
  }

  log('Checking for expected tables...');
  const tables = await run('docker-compose exec -T db psql -U db_user -d db_api -c "\\dt"');
  const out = (tables.stdout || '') + (tables.stderr || '');
  if (/gallery_item|peca_item/.test(out)){
    log('Expected tables found');
  } else {
    err('Expected tables not found in DB output. Inspect logs.');
  }

  if (!keep){
    log('Tearing down docker-compose (docker-compose down)');
    await run('docker-compose down');
  } else {
    log('Keeping docker containers running (use --no-keep to stop)');
  }

  process.exit(mig.code === 0 ? 0 : 1);
}

main().catch(e => { err('Unhandled error', e); process.exit(1); });
