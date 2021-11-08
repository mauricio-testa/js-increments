import Target from './Target'

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

export default Counter

