import Counter from '../classes/Counter'

function jsIncrements(options = {}) {
  return new Counter(options).start()
}

/**
 * Text increment
 */

test('Text progress', done => {
  document.body.innerHTML = '<div id="text"></div>';
  function callback() {
    try {
      expect(document.getElementById('text').textContent).toBe('67%');
      done();
    } catch (error) {
      done(error);
    }
  }

  jsIncrements({
    from: 20,
    to: 100,
    max: 150,
    target: {
      selector: '#text',
      type: 'text',
    },
    onFinish: () => callback()
  })
});

/**
 * Bar increment
 */

test('DOM Bar progress', done => {
  document.body.innerHTML = '<div id="bar"></div>';
  function callback() {
    try {
      expect(document.getElementById('bar').style.width).toBe('100%');
      done();
    } catch (error) {
      done(error);
    }
  }

  jsIncrements({
    target: {
      selector: '#bar',
      property: 'width',
      type: 'style',
      unit: '%'
    },
    onFinish: () => callback()
  })
});