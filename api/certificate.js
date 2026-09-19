const { redis } = require('../lib/store');
const { send, readBody, LEARNER_ID } = require('../lib/http');
const KEY = require('../lib/answer-key');

const PASS_TOTAL = 50;      // % overall
// Latin letters (incl. accents), spaces, dot, hyphen, apostrophe. The certificate font has no Devanagari.
const NAME_OK = /^[A-Za-zÀ-ÖØ-öø-ÿ][A-Za-zÀ-ÖØ-öø-ÿ .'-]{1,59}$/;

function grade(answersA, answersB) {
  const correctA = KEY.partA.reduce((n, ans, i) => n + (answersA[i] === ans ? 1 : 0), 0);
  const partB = KEY.partB.map((k, i) => {
    const a = answersB[i] || {};
    const reasons = Array.isArray(a.reasons) ? a.reasons : [];
    const valid = reasons.filter(r => k.valid.includes(r)).length;
    const invalid = reasons.length - valid;
    return a.verdict === k.verdict && valid >= 2 && invalid === 0;
  });
  const correctB = partB.filter(Boolean).length;
  const total = Math.round((correctA / KEY.partA.length) * 60 + (correctB / KEY.partB.length) * 40);
  return { correctA, correctB, total, partB, passed: total >= PASS_TOTAL };
}

function issueDate() {
  return new Intl.DateTimeFormat('en-GB', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'Asia/Kolkata' }).format(new Date());
}

module.exports = async (req, res) => {
  if (req.method !== 'POST') return send(res, 405, { error: 'Use POST.' });
  const body = readBody(req);
  const learnerId = body.learnerId || '';
  const name = String(body.name || '').replace(/\s+/g, ' ').trim();
  if (!LEARNER_ID.test(learnerId)) return send(res, 400, { error: 'Missing learner ID.' });
  if (!Array.isArray(body.answersA) || !Array.isArray(body.answersB)) return send(res, 400, { error: 'Missing answers.' });

  const result = grade(body.answersA, body.answersB);
  if (!result.passed) return send(res, 200, { result });
  if (!NAME_OK.test(name)) return send(res, 400, { result, error: 'Use English letters only for the name (2 to 60 characters).' });

  try {
    // One certificate per learner: return the existing one instead of using a new serial.
    const existing = await redis(['GET', `cpps:cert-of:${learnerId}`]);
    if (existing) return send(res, 200, { result, certificate: JSON.parse(existing) });

    const n = await redis(['INCR', 'cpps:serial']);
    const certificate = {
      serial: `Spyrewall/CPPS/${String(n).padStart(3, '0')}`,
      name,
      date: issueDate(),
      score: result.total,
      issuedAt: new Date().toISOString(),
    };
    const saved = await redis(['SET', `cpps:cert-of:${learnerId}`, JSON.stringify(certificate), 'NX']);
    if (!saved) return send(res, 200, { result, certificate: JSON.parse(await redis(['GET', `cpps:cert-of:${learnerId}`])) });
    await redis(['SET', `cpps:cert:${String(n).padStart(3, '0')}`, JSON.stringify(certificate)]);
    send(res, 200, { result, certificate });
  } catch (e) {
    send(res, 500, { result, error: 'Certificate could not be issued. Try again in a minute.' });
  }
};
