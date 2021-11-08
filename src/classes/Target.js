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

      if (this.options.type == 'text' && this.options.percentage && (!this.counterOptions.max || this.counterOptions.max < this.counterOptions.to))
        throw new Error('The max value is invalid, missing, or less than `to`');

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

export default Target;