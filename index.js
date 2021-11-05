/**
 * class to validate, structure and assign the action of each target
 */

class Target {
  constructor(params, counterOptions) {
    const defaults = {
      selector: null,
      property: 'width',
      type: 'text',
      unit: '%',
      percentage: true,
    };

    this.counterOptions = counterOptions
    this.options = { ...defaults, ...params };
  }

  /**
   * Update DOM element as counter updates
   */

  get update() {
    switch (this.options.type) {
      case 'text':
        return function (value) {
          const _value = this.options.percentage ? (value * 100 / this.counterOptions.max) : value
          this.element.textContent = `${Math.round(_value)} ${this.options.percentage ? '%' : ''}`
        }

      case 'style':
        return function (value) {
          this.element.style.setProperty(this.options.property, (value * 100 / this.counterOptions.max) + this.options.unit);
        }
    }
  }

  /**
   * Returns the target's DOM element
   */

  get element() {
    return document.querySelector(this.options.selector)
  }

  /**
   * Returns if target is valid
   */

  get valid() {

    try {
      if (!this.options.selector)
        throw new Error('Selector not found');

      if (!this.element)
        throw new Error('No DOM element found for selector ' + this.options.selector);

      if (!['text', 'style'].includes(this.options.type))
        throw new Error('Invalid target type' + this.options.type);

      if (this.options.type == 'text' && this.options.percentage && !this.counterOptions.max)
        throw new Error('No maximum value provided for percentage calculation');

      if (this.options.type == 'style' && !this.options.property)
        throw new Error('No CSS property provided');
    }
    catch (error) {
      console.error(this, error.message)
      return;
    }
    return true
  }
}

/**
 * Counter Main Class
 */

class Counter {
  constructor(params) {
    const defaults = {
      from: 0,
      to: 100,
      interval: 50,
      wait: 0,
      max: 100,
      step: 1,

      target: false,
      targets: [],

      onStart: null,
      onUpdate: null,
      onFinish: null,
    };

    this.options = { ...defaults, ...params };
    this.targets = [];

    if (this.options.target) this.options.targets.push(this.options.target)

    this.options.targets.forEach(target => {
      const targetInstance = new Target(target, this.options)
      if (targetInstance.valid)
        this.targets.push(targetInstance)
    });
  }

  /**
   * Start the counter
   */

  start() {

    if (!this.targets.length) {
      throw new Error('There are no valid targets')
    }

    this._fireEvent('onStart')

    //start progress with `from` value
    this.counter = this.options.from;
    this._updateElement()

    // execute counter
    const vm = this
    setTimeout(function () {
      var id = setInterval(function () {
        if (vm.counter === vm.options.to) {
          clearInterval(id);
          vm._fireEvent('onFinish')
        } else {
          // `to` is not a multiple of `step`
          if (vm.options.to && (vm.counter + vm.options.step) > vm.options.to) {
            vm.counter = vm.options.to
          }
          else {
            vm.counter += vm.options.step;
          }
          vm._updateElement()
        }
      }, vm.options.interval);
    }, vm.options.wait)
  }

  /**
   * Update the element with counter value
   */

  _updateElement() {
    this._fireEvent('onUpdate')

    this.targets.forEach(target => {
      target.update(this.counter)
    });
  }

  /**
   * Triggers user event callbacks
   * @param {String} event 
   */

  _fireEvent(event) {
    if (this.options.hasOwnProperty(event) && typeof this.options[event] == 'function') {
      this.options[event](this)
    }
  }

}

window.JsCounter = Counter

