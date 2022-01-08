/* ************************************************************************************************
 *                                                                                                *
 * Please read the following tutorial before implementing tasks:                                   *
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Object_initializer *
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object        *
 *                                                                                                *
 ************************************************************************************************ */


/**
 * Returns the rectangle object with width and height parameters and getArea() method
 *
 * @param {number} width
 * @param {number} height
 * @return {Object}
 *
 * @example
 *    const r = new Rectangle(10,20);
 *    console.log(r.width);       // => 10
 *    console.log(r.height);      // => 20
 *    console.log(r.getArea());   // => 200
 */
function Rectangle(width, height) {
  return {
    width,
    height,
    getArea() { return width * height; },
  };
}


/**
 * Returns the JSON representation of specified object
 *
 * @param {object} obj
 * @return {string}
 *
 * @example
 *    [1,2,3]   =>  '[1,2,3]'
 *    { width: 10, height : 20 } => '{"height":10,"width":20}'
 */
function getJSON(obj) {
  return JSON.stringify(obj);
}


/**
 * Returns the object of specified type from JSON representation
 *
 * @param {Object} proto
 * @param {string} json
 * @return {object}
 *
 * @example
 *    const r = fromJSON(Circle.prototype, '{"radius":10}');
 *
 */
function fromJSON(proto, json) {
  return Object.setPrototypeOf(JSON.parse(json), proto);
}


/**
 * Css selectors builder
 *
 * Each complex selector can consists of type, id, class, attribute, pseudo-class
 * and pseudo-element selectors:
 *
 *    element#id.class[attr]:pseudoClass::pseudoElement
 *              \----/\----/\----------/
 *              Can be several occurrences
 *
 * All types of selectors can be combined using the combination ' ','+','~','>' .
 *
 * The task is to design a single class, independent classes or classes hierarchy
 * and implement the functionality to build the css selectors using the provided cssSelectorBuilder.
 * Each selector should have the stringify() method to output the string representation
 * according to css specification.
 *
 * Provided cssSelectorBuilder should be used as facade only to create your own classes,
 * for example the first method of cssSelectorBuilder can be like this:
 *   element: function(value) {
 *       return new MySuperBaseElementSelector(...)...
 *   },
 *
 * The design of class(es) is totally up to you, but try to make it as simple,
 * clear and readable as possible.
 *
 * @example
 *
 *  const builder = cssSelectorBuilder;
 *
 *  builder.id('main').class('container').class('editable').stringify()
 *    => '#main.container.editable'
 *
 *  builder.element('a').attr('href$=".png"').pseudoClass('focus').stringify()
 *    => 'a[href$=".png"]:focus'
 *
 *  builder.combine(
 *      builder.element('div').id('main').class('container').class('draggable'),
 *      '+',
 *      builder.combine(
 *          builder.element('table').id('data'),
 *          '~',
 *           builder.combine(
 *               builder.element('tr').pseudoClass('nth-of-type(even)'),
 *               ' ',
 *               builder.element('td').pseudoClass('nth-of-type(even)')
 *           )
 *      )
 *  ).stringify()
 *    => 'div#main.container.draggable + table#data ~ tr:nth-of-type(even)   td:nth-of-type(even)'
 *
 *  For more examples see unit tests.
 */

class CssSelectorBuilder {
  constructor() {
    this.previousSelector = '';
    this.cssArray = [];
    this.order = -1;
  }

  stringify() {
    let str = '';
    str = this.cssArray.join('');
    this.previousSelector = '';
    this.cssArray = [];
    return str;
  }

  element(value) {
    if (this.previousSelector === 'element') { throw new Error('Element, id and pseudo-element should not occur more then one time inside the selector'); } // eslint-disable-line
    if (this.order > 0) { throw new Error('Selector parts should be arranged in the following order: element, id, class, attribute, pseudo-class, pseudo-element'); } // eslint-disable-line
    this.previousSelector = 'element';
    this.cssArray.push(`${value}`);
    this.order = 0;
    return this;
  }

  id(value) {
    if (this.previousSelector === 'id') { throw new Error('Element, id and pseudo-element should not occur more then one time inside the selector'); } // eslint-disable-line
    if (this.order > 1) { throw new Error('Selector parts should be arranged in the following order: element, id, class, attribute, pseudo-class, pseudo-element'); } // eslint-disable-line
    this.previousSelector = 'id';
    this.cssArray.push(`#${value}`);
    this.order = 1;
    return this;
  }

  class(value) {
    if (this.order > 2) { throw new Error('Selector parts should be arranged in the following order: element, id, class, attribute, pseudo-class, pseudo-element'); } // eslint-disable-line
    this.previousSelector = '';
    this.cssArray.push(`.${value}`);
    this.order = 2;
    return this;
  }

  attr(value) {
    if (this.order > 3) { throw new Error('Selector parts should be arranged in the following order: element, id, class, attribute, pseudo-class, pseudo-element'); } // eslint-disable-line
    this.previousSelector = '';
    this.cssArray.push(`[${value}]`);
    this.order = 3;
    return this;
  }

  pseudoClass(value) {
    if (this.order > 4) { throw new Error('Selector parts should be arranged in the following order: element, id, class, attribute, pseudo-class, pseudo-element'); } // eslint-disable-line
    this.previousSelector = '';
    this.cssArray.push(`:${value}`);
    this.order = 4;
    return this;
  }

  pseudoElement(value) {
    if (this.previousSelector === 'pseudoElement') { throw new Error('Element, id and pseudo-element should not occur more then one time inside the selector'); }// eslint-disable-line
    this.previousSelector = 'pseudoElement';
    this.cssArray.push(`::${value}`);
    this.order = 5;
    return this;
  }
  combine(selector1, combinator, selector2) { // eslint-disable-line
    this.cssArray = this.cssArray.concat(selector1.cssArray).concat([` ${combinator} `]).concat(selector2.cssArray);
    return this;
  }
}

const cssSelectorBuilder = {
  element(value) {
    const cssSelector = new CssSelectorBuilder();
    cssSelector.element(value);
    return cssSelector;
  },
  id(value) {
    const cssSelector = new CssSelectorBuilder();
    cssSelector.id(value);
    return cssSelector;
  },
  class(value) {
    const cssSelector = new CssSelectorBuilder();
    cssSelector.class(value);
    return cssSelector;
  },
  attr(value) {
    const cssSelector = new CssSelectorBuilder();
    cssSelector.attr(value);
    return cssSelector;
  },
  pseudoClass(value) {
    const cssSelector = new CssSelectorBuilder();
    cssSelector.pseudoClass(value);
    return cssSelector;
  },
  pseudoElement(value) {
    const cssSelector = new CssSelectorBuilder();
    cssSelector.pseudoElement(value);
    return cssSelector;
  },
  combine(selector1, combinator, selector2) { // eslint-disable-line
    const cssSelector = new CssSelectorBuilder();
    cssSelector.combine(selector1, combinator, selector2);
    return cssSelector;
  },
};


module.exports = {
  Rectangle,
  getJSON,
  fromJSON,
  cssSelectorBuilder,
};
