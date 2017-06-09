# fancy-double-slider
A slider with two thumbs for operating range values.

## usage
You can use `FDS.create` method to obtain FDS control that reflects it's changes into some instance:
```javascript
let particle = new Particle();
 
function particleLifeSetter(a, b) {
  this.life.min = a;
  this.life.max = b;
}

let controlsList = document.createElement("div");

FDS.create(
  { min: 0, max: 4, step: 1, value: 1 },
  controlsList,
  particleLifeSetter.bind(particle)
);
```

Tested on Chrome (58.0.3029.110 64-bit) and Firefox (53.0.3 32-bit).
