import Target from '../classes/Target'

function jsIncrementsTarget(options = {}) {
  return new Target(options, { max: 100 }).valid
}

/**
 * Target tests
 */

test('Selector not found', () => {
  expect(() => jsIncrementsTarget({ type: 'style' })).toThrow('SELECTOR_NOT_FOUND');
});

test('No DOM element for the selector', () => {
  expect(() => jsIncrementsTarget({ selector: '.fake' })).toThrow('NO_DOM_ELEMENT_FOUND_FOR_THE_SELECTOR');
});

test('Invalid type', () => {
  document.body.innerHTML = '<div id="fake"></div>';
  expect(() => jsIncrementsTarget({ type: 'fake', selector: '#fake' })).toThrow('INVALID_TARGET_TYPE');
});

test('No CSS prop provided', () => {
  document.body.innerHTML = '<div id="fake"></div>';
  expect(() => jsIncrementsTarget({ type: 'css', selector: '#fake', property: false })).toThrow('INVALID_TARGET_TYPE');
});

