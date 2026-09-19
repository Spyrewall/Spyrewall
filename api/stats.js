const { redis } = require('../lib/store');
const { send } = require('../lib/http');

module.exports = async (req, res) => {
  try {
    const [enrolled, certified] = await redis(['MGET', 'cpps:enrolled', 'cpps:serial']);
    send(res, 200, { enrolled: Number(enrolled || 0), certified: Number(certified || 0) });
  } catch (e) {
    send(res, 500, { error: 'Could not load live numbers right now.' });
  }
};
