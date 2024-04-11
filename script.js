/*Util Classes*/

const clone = (jsonObject) => { return JSON.parse(JSON.stringify(jsonObject)); };
const swapClasses = (target, c1, c2) => { target.classList.remove(c1); target.classList.add(c2); };

// var child = document.getElementById('my_element');
// var parent = child.parentNode;
// The equivalent of parent.children.indexOf(child)
// var index = Array.prototype.indexOf.call(parent.children, child);

function siblingIndex(child) {
  const parent = child.parentNode;
  return Array.prototype.indexOf.call(parent.children, child);
}

/* DOM Elements */

const titleSVG = document.getElementById("title-svg");
const navBar = document.querySelector(".nav-bar");
const navButtons = document.querySelectorAll(".btn-nav");
const panelGroup = document.querySelector(".panel-col");

/* State */

let activePanelIndex = 0;

/* Title SVG */

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
  const newShadow = getShadowParams(shadowElement);
  newShadow.x = radius * Math.sin(radians);
  newShadow.y = radius * Math.cos(radians);
  newShadow.range = range;
  setShadowParams(shadowElement, newShadow);
  // console.log("shadow: ", shadow);

}

let titleShadow;
let shadowAngle = 359;
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
  return -1 * (Math.atan(opposite / adjacent) * (180 / Math.PI)) + 0;
}

function setOtherShadows(refElement, target, setting) {
  const unit = "px";
  const shadow = getShadowParams(refElement);
  const x = shadow.x;
  const y = shadow.y;
  const range = shadow.range;

  if (setting === "inset") {
    target.style.boxShadow = `inset rgba(0, 0, 0, 0.5) ${x}${unit} ${y}${unit} ${range}${unit}`;
  } else {
    target.style.boxShadow = `rgba(0, 0, 0, 0.2) ${x}${unit} ${y}${unit} ${range}${unit}`;
  }
}

// drop-shadow(rgba(0, 0, 0, 0.4) 4vw 3vw 2vw);
document.addEventListener('DOMContentLoaded', (event) => {
  titleShadow = getShadowParams(titleSVG);
});


// setInterval(() => {
//   if (titleShadow.y < 3) {
//     incrementShadow(titleSVG, -0.005, 0.01, 0.007);
//     titleShadow = getShadowParams(titleSVG);
//     console.log("titleShadow: ", titleShadow);
//   }
// }, 2);

setInterval(() => {
  if (shadowAngle > 0) {
    setShadowAngle(titleSVG, .3, shadowAngle, 0.3);
    titleShadow = getShadowParams(titleSVG);
    // console.log("titleShadow: ", titleShadow);
    shadowAngle = (shadowAngle % 360) - 10;

  } else {
    setShadowAngle(titleSVG, .3, getTitleAngle(), 0.3);
    titleShadow = getShadowParams(titleSVG);
    // setInsetShadows(titleSVG, document.querySelector(".main-panel"))
  }

  document.querySelectorAll(".shadow-inset").forEach(element => {
    setOtherShadows(titleSVG, element, "inset");
  });

  document.querySelectorAll(".shadow-outset").forEach(element => {
    setOtherShadows(titleSVG, element, "outset");
  });

}, 20);

/* Nav Buttons */

function navButtonReset(element) {
  swapClasses(element, "shadow-inset", "shadow-outset");
  swapClasses(element, "btn-nav-depressed", "blank");
}

function navButtonDepress(element) {
  swapClasses(element, "shadow-outset", "shadow-inset");
  swapClasses(element, "blank", "btn-nav-depressed");
}

navButtons.forEach(navButton => {
  navButton.addEventListener('click', () => {

    const activePanel = panelGroup.children[activePanelIndex];
    const newPanelIndex = siblingIndex(navButton);
    const newPanel = panelGroup.children[newPanelIndex];

    navButtons.forEach(nb => {
      navButtonReset(nb);
    });
    navButtonDepress(navButton);
    const panelClasses = "panel-container ";
    if (newPanelIndex > activePanelIndex) {
      newPanel.className = panelClasses + "panel-enter-right active-panel";
      activePanel.className = panelClasses + "panel-exit-left";
    } else if (newPanelIndex < activePanelIndex) {
      newPanel.className = panelClasses + "panel-enter-left active-panel";
      activePanel.className = panelClasses + "panel-exit-right";
    }

    activePanelIndex = newPanelIndex;

  });
});

/*Display Content*/

function newElement(tag, classes) {
  const newElem = document.createElement(tag);
  newElem.className = classes;
  return newElem;
}

const projectTemplate = document.getElementById("project-template");

function renderFromTemplate(projectName, projectInfo) {
  let template = projectTemplate.cloneNode(true).content;

  template.querySelector(".project-name").innerText = projectInfo.name;
  template.querySelector(".project-info").innerText = projectInfo.info;
  template.querySelector(".project-image").src = projectInfo.image;
  template.querySelector(".project-demo").href = projectInfo.demo;
  template.querySelector(".project-code").href = projectInfo.code;
  template.querySelector(".project-video").href = projectInfo.video;

  // project-icons
  const iconBox = template.querySelector(".project-icons")
  iconBox.textContent = "";
  projectInfo.icons.forEach(iconName => {
    const newIcon = newElement("img", "project-icon");
    newIcon.src = `svg/${iconName}.svg`;
    iconBox.append(newIcon);
  });

  document.getElementById(projectName).append(template);
}
console.log(window.location.host);
async function fetchProjects() {
  const response = await fetch("/projects.json");
  const projects = await response.json();
  console.log(projects);

  Object.keys(projects).forEach( projectName => {
    renderFromTemplate(projectName, projects[projectName]);
  });
}

fetchProjects();
