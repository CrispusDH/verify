import test from 'ava';
import { Verify } from '../../src/verify';

const text = 'Wow, I see you.';
const foo = async (startTime) => {
  const elapsed = Date.now() - startTime;
  if (elapsed < 800) {
    throw new Error('Elapsed time 0-800 ms');
  } else {
    return text;
  }
};

test('error message', async (t) => {
  const error = await t.throwsAsync(
    async () => {
      await Verify.stringsAreNotEqual(
        text,
        text,
        600
      );
    }
  );
  t.truthy(error.message.includes(`${text}`), `Actual error message is:\n"${error.message}"`);
});

test('should pass after 800 ms', async (t) => {
  const startTime = Date.now();
  await t.notThrowsAsync(
    async () => await Verify.stringsAreNotEqual(
      () => foo(startTime),
      `${text} is different`
    )
  );
  const elapsed = Date.now() - startTime;
  t.truthy(elapsed > 700);
});
