import Counter from '../classes/Counter'

function jsIncrements(options = {}) {
  return new Counter(options).start()
}

/**
 * Counter tests
 */

test('No valid targets', () => {
  expect(() => jsIncrements()).toThrow('NO_VALID_TARGETS');
});

test('To greater than from', () => {
  document.body.innerHTML = '<div id="fake"></div>';
  expect(() => jsIncrements({
    to: 10,
    from: 11,
    target: { selector: '#fake' } 
  })).toThrow('TO_MUST_BE_GREATER_THAN_FROM');
});