import { redis } from '../lib/store.js';
import { send, readBody, LEARNER_ID } from '../lib/http.js';

// Counts each learner once: the first enroll call for a learnerId increments the total.
export default async function handler(req, res) {
  if (req.method !== 'POST') return send(res, 405, { error: 'Use POST.' });
  const { learnerId } = readBody(req);
  if (!LEARNER_ID.test(learnerId || '')) return send(res, 400, { error: 'Missing learner ID.' });
  try {
    const isNew = await redis(['SET', `cpps:learner:${learnerId}`, new Date().toISOString(), 'NX']);
    const enrolled = isNew ? await redis(['INCR', 'cpps:enrolled']) : Number(await redis(['GET', 'cpps:enrolled']) || 0);
    send(res, 200, { enrolled, isNew: Boolean(isNew) });
  } catch (e) {
    send(res, 500, { error: 'Enrollment could not be saved. Try again.' });
  }
}
