import Target from './Target'

/**
 * Counter Main Class
 */

class Counter {
  constructor(params) {
    const defaults = {
      from: 0,
      to: 100,
      duration: 5000,
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

    if (!this.valid) return;

    this._destroyRelatedInstances()

    this._fireEvent('onStart')

    //start progress with `from` value
    this.counter = this.options.from;
    this._updateElement()

    // execute counter
    const vm = this

    setTimeout(function () {
      const interval = (vm.options.duration / (vm.options.to - vm.options.from)) * vm.options.step 

      vm.id = setInterval(function () {
        if (vm.counter === vm.options.to) {
          vm.stop()
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
      }, interval);

      vm._registerInstance()

    }, vm.options.wait)
  }

  /**
   * Stop the counter
   */
  stop() {
    clearInterval(this.id);
    this._fireEvent('onFinish')
  }

  /**
   * If you have other running counters related to any target of this counter, 
   * destroy the active instance
   */

  _destroyRelatedInstances() {
    const instances = window.jsIncrementsInstances ?? []
    instances.forEach((instance, index) => {
      const instanceSelectors = instance.targets.map(i => i.options.selector)
      if (this.targets.some(target => instanceSelectors.includes(target.options.selector))) {
        window.jsIncrementsInstances.splice(index, 1);
        instance.stop()
      }
    })
  }

  /**
   * Register a new increments instance on a window
   */

  _registerInstance() {
    if (typeof window.jsIncrementsInstances == 'undefined') {
      window.jsIncrementsInstances = []
    }
    window.jsIncrementsInstances.push(this)
  }

  /**
   * Update the element with counter value
   */

  _updateElement() {
    this._fireEvent('onUpdate')

    this.targets.forEach(target => {
      // treatment if the element is removed from the DOM later
      if (target.element) {
        target.update(this.counter)
      }
      else {
        this.stop()
      }
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

  get valid() {

    const mustBeNumber = ['from', 'to', 'duration', 'wait', 'max', 'step']
    mustBeNumber.forEach(key => {
      if (isNaN(this.options[key])) {
        throw new Error(key.toUpperCase() + '_IS_NAN');
      }
      else {
        this.options[key] = parseInt(this.options[key])
      }
    })

    if (!this.targets.length)
      throw new Error('NO_VALID_TARGETS')

    if (this.options.to < this.options.from)
      throw new Error('TO_MUST_BE_GREATER_THAN_FROM');

    if (!this.options.max || this.options.max < this.options.to)
      this.options.max = this.options.to

    return true
  }

}

export default Counter

