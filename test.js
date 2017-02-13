import test from 'ava';
import fn from './index';

test('title', t => {
  t.is(fn('unicorns'), 'Hello, unicorns');
});
