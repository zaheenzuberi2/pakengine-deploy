/* PakEngine offline licence key minter
 *
 * Keys are ECDSA P-256 signatures over "<SHOWROOM-ID>|<startOrd>|<span>".
 * The app carries only the PUBLIC key and verifies offline. The private key
 * lives in _build/license-private.jwk on this machine and is gitignored.
 * Without it nobody can forge or guess a valid key.
 *
 *   One-time setup:
 *     node _build/mint-key.mjs --init
 *       -> writes _build/license-private.jwk
 *       -> prints the LICENSE_PUBKEY_JWK block to paste into index.html
 *
 *   Issue a key when a showroom pays:
 *     node _build/mint-key.mjs PES-ABC234 monthly            (this month)
 *     node _build/mint-key.mjs PES-ABC234 monthly 2026-10    (a chosen start month)
 *     node _build/mint-key.mjs PES-ABC234 annual             (12 months from this month)
 */

import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = dirname(fileURLToPath(import.meta.url));
const PRIV_PATH = resolve(HERE, 'license-private.jwk');
const ALG = { name: 'ECDSA', namedCurve: 'P-256' };
const SIGN_ALG = { name: 'ECDSA', hash: 'SHA-256' };

const b64url = (buf) =>
  Buffer.from(buf).toString('base64').replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');

function ordFromYearMonth(y, m0) { return y * 12 + m0; }        // m0 = 0..11
function labelFromOrd(ord) {
  const M = ['January','February','March','April','May','June','July','August','September','October','November','December'];
  return M[ord % 12] + ' ' + Math.floor(ord / 12);
}

async function init() {
  if (existsSync(PRIV_PATH)) {
    console.error('Refusing to overwrite an existing ' + PRIV_PATH + '.\n' +
      'Delete it by hand first if you really mean to rotate the signing key\n' +
      '(every key already issued to a customer stops verifying when you do).');
    process.exit(1);
  }
  const pair = await crypto.subtle.generateKey(ALG, true, ['sign', 'verify']);
  const priv = await crypto.subtle.exportKey('jwk', pair.privateKey);
  const pub = await crypto.subtle.exportKey('jwk', pair.publicKey);
  writeFileSync(PRIV_PATH, JSON.stringify(priv, null, 2) + '\n', 'utf8');
  const pubLiteral =
    '  var LICENSE_PUBKEY_JWK = {\n' +
    "    kty: 'EC', crv: 'P-256',\n" +
    "    x: '" + pub.x + "',\n" +
    "    y: '" + pub.y + "'\n" +
    '  };';
  console.log('\nWrote ' + PRIV_PATH + ' (gitignored, never commit it).\n');
  console.log('Paste this into index.html, replacing the existing LICENSE_PUBKEY_JWK:\n');
  console.log(pubLiteral + '\n');
}

async function loadSigningKey() {
  if (!existsSync(PRIV_PATH)) {
    console.error('No signing key yet. Run:  node _build/mint-key.mjs --init');
    process.exit(1);
  }
  const jwk = JSON.parse(readFileSync(PRIV_PATH, 'utf8'));
  return crypto.subtle.importKey('jwk', jwk, ALG, false, ['sign']);
}

async function mint(showroomId, plan, startArg) {
  showroomId = String(showroomId || '').trim().toUpperCase();
  if (!/^PES-[A-Z0-9]{4,10}$/.test(showroomId)) {
    console.error('Showroom ID looks wrong: "' + showroomId + '"  (expected e.g. PES-ABC234)');
    process.exit(1);
  }
  plan = String(plan || '').trim().toLowerCase();
  const span = plan === 'annual' || plan === 'year' || plan === 'yearly' ? 12
             : plan === 'monthly' || plan === 'month' ? 1 : 0;
  if (!span) { console.error('Plan must be "monthly" or "annual".'); process.exit(1); }

  let startOrd;
  if (startArg) {
    const m = /^(\d{4})-(\d{2})$/.exec(startArg.trim());
    if (!m) { console.error('Start month must be YYYY-MM, e.g. 2026-10.'); process.exit(1); }
    startOrd = ordFromYearMonth(+m[1], +m[2] - 1);
  } else {
    const now = new Date();
    startOrd = ordFromYearMonth(now.getFullYear(), now.getMonth());
  }

  const payload = showroomId + '|' + startOrd + '|' + span;
  const key = await loadSigningKey();
  const sig = await crypto.subtle.sign(SIGN_ALG, key, new TextEncoder().encode(payload));
  const keyString = 'PE1.' + b64url(new TextEncoder().encode(payload)) + '.' + b64url(sig);

  const endOrd = startOrd + span - 1;
  const coverage = span === 1 ? labelFromOrd(startOrd)
                              : labelFromOrd(startOrd) + ' to ' + labelFromOrd(endOrd);
  console.log('\n  Showroom : ' + showroomId);
  console.log('  Plan     : ' + (span === 12 ? 'Annual (12 months)' : 'Monthly'));
  console.log('  Covers   : ' + coverage);
  console.log('\n  Activation key (send this to the customer):\n');
  console.log('    ' + keyString + '\n');
}

const [a, b, c] = process.argv.slice(2);
if (a === '--init') init();
else if (a) mint(a, b, c);
else {
  console.log('Usage:\n' +
    '  node _build/mint-key.mjs --init\n' +
    '  node _build/mint-key.mjs <PES-ID> <monthly|annual> [YYYY-MM]');
}
