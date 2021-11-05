# JSCounter
A small library with the logic needed to increment counters and progress bars

![Size](https://img.shields.io/github/size/mauricio-testa/js-counter/dist/index.min.js)
![Language](https://img.shields.io/github/languages/top/mauricio-testa/js-counter)
![Last commit](https://img.shields.io/github/last-commit/mauricio-testa/js-counter)

## How to use

> If you think it is better to learn from examples, download this project to your computer and open `/examples/index.html`.

1. Add to your document 
```html
<script src="PATH_TO_LIB/dist/index.min.js"></script>
```
2. Configure options

```js
const counter = new JsCounter({
  from: 0, 
  to: 100,
  max: 100,
  step: 1,
  interval: 100, 
  wait: 0,
  target: {
    selector: '#progressText',
    type: 'text',
  },
});
```
3. Start!

```js
counter.start()
```

> Tip: You can store the counter instance in a variable to programmatically start (as above), or start the counter without having to assign it to a variable: `new JsCounter(options).start()`

## Counter Options

Option | Type | Default | Description
--- | --- | --- | --- |
`from` | `Number` | 0 | The number that the counter should start
`to` | `Number` |100 | The number that the counter must stop
`interval` | `Number` | 50 | Time interval between increments
`wait` | `Number` | 0 | Time to wait before starting
`max` | `Number` | 100 | Reference to the maximum number of the counter. Useful when working with percentages
`step` | `Number` | 1 | How many numbers to advance with each increment
`target` | `Boolean` or `Object` | false | [See bellow](#target-options)
`targets` | `Array`  | [] | Same as `target`. But an array
`onStart` | `null` or `function` | null | Function when run on startup
`onUpdate` | `null` or `function` | null | Function when increment
`onFinish` | `null` or `function` | null | Function when finished

> The `onStart`, `onUpdate` and `onFinish` callbacks receives the counter instance as a parameter
```
onUpdate: (data) => {
  console.log('updated', data.counter)
},
```
## Target Options

Option | Type | Default | Description
--- | --- | --- | --- |
`selector` | `String` | `null` | DOM element selector that should be manipulated. Something like `#progress` or `.counter`
`type` | `String` | `'text'` | Kind of manipulation. `style` or `text`
`property` | `String` | `'width'` | CSS property that must be changed (will be manipulated with `setProperty`)
`unit` | `String` | `'%'` | CSS property unit
`percentage` | `Boolean` | `true` | Whether you want to display the number in percentage or the real number. For example: a progress bar containing the steps of a wizard that goes from 0 to 5. When you get halfway through the progress bar, do you want to display 3 or 50%?

### Example for manipulating a progress bar
```js
const target = {
  selector: '#progressBar #bar',
  property: 'width',
  type: 'style',
  unit: '%'
},
```

### Example for manipulating a text
```js
const target = {
  selector: '#progressCircle text',
  type: 'text',
  percentage: true
},
```