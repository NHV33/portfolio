const clone = (jsonObject) => { return JSON.parse(JSON.stringify(jsonObject)); };

/* Title SVG */

const titleSVG = document.getElementById("title-svg");

function getShadowParams(shadowElement) {
  const unit = "vw";
  const shadowStyle = window.getComputedStyle(shadowElement, null).filter;
  const shadowParams = shadowStyle.split(") ")[1].replace(")", "").split(" ");
  let shadow = {
    x:      parseFloat(shadowParams[0]),
    y:      parseFloat(shadowParams[1]),
    range:  parseFloat(shadowParams[2])
  };
  return shadow;
}

function setShadowParams(shadowElement, shadow) {
  const unit = "vw";
  const x = shadow.x;
  const y = shadow.y;
  const range = shadow.range;
  // console.log(x, y, range);
  const styleString = `drop-shadow(rgba(0, 0, 0, 0.5) ${x}${unit} ${y}${unit} ${range}${unit}`;
  // console.log("styleString: ", styleString);

  shadowElement.style.filter = styleString;
}

function incrementShadow(shadowElement, x, y, range) {
  const shadow = getShadowParams(shadowElement);
  let newShadow = {
    x: shadow.x + x,
    y: shadow.y + y,
    range: shadow.range + range
  }
  // console.log("newShadow: ", newShadow);

  setShadowParams(shadowElement, newShadow);
}

function setShadowAngle(shadowElement, radius, angle, range) {
  const radians = angle * (Math.PI / 180);
  // console.log("radians: ", radians);
  const newShadow = clone(getShadowParams(shadowElement));
  newShadow.x = radius * Math.sin(radians);
  newShadow.y = radius * Math.cos(radians);
  newShadow.range = range;
  setShadowParams(shadowElement, newShadow);
  // console.log("shadow: ", shadow);

}

let titleShadow;
let shadowAngle = 0;
let cursorX;
let cursorY;

document.addEventListener('mousemove', (event) => {
  cursorX = event.clientX;
  cursorY = event.clientY;
});

function getTitleAngle() {
  const ww = window.innerWidth;
  const wh = window.innerHeight;
  const opposite = 1 * ((ww / 2) - cursorX);
  const adjacent = 1 * ((wh) - cursorY);
  return -1 * (Math.atan(opposite / adjacent) * (180 / Math.PI)) + 180;
}

// drop-shadow(rgba(0, 0, 0, 0.4) 4vw 3vw 2vw);
document.addEventListener('DOMContentLoaded', (event) => {
  titleShadow = getShadowParams(titleSVG);

  // setInterval(() => {
  //   if (titleShadow.y < 3) {
  //     incrementShadow(titleSVG, -0.005, 0.01, 0.007);
  //     titleShadow = getShadowParams(titleSVG);
  //     console.log("titleShadow: ", titleShadow);
  //   }
  // }, 2);

  setInterval(() => {
    if (shadowAngle < 360) {
      setShadowAngle(titleSVG, .3, shadowAngle, 0.3);
      titleShadow = getShadowParams(titleSVG);
      // console.log("titleShadow: ", titleShadow);
      shadowAngle = (shadowAngle % 360) + 10;
    } else {
      setShadowAngle(titleSVG, .3, getTitleAngle(), 0.3);
    }

  }, 20);
});

/*  */
