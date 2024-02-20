const windows =  [... document.querySelectorAll("[data-window]")];
const triggers = [... document.querySelectorAll("[data-window-trigger]")];
const errors = [... document.querySelectorAll("[data-error-trigger]")];
const root = document.querySelector(':root');

const desktop = document.querySelector("#icons");
desktop.addEventListener("click", e => {
	triggers.forEach(trigger=>{
		trigger.classList.remove("active");
	});
});

let order = 0;
let layer = 10;
triggers.forEach(trigger=>{
	let name = trigger.getAttribute("data-name");
	let window = document.querySelector(`#window-${name}`);
	let inside = window.querySelector(".window-inside");
	let tab = document.querySelector(`.tab-${name}`);
	let menu = window.querySelector("[data-menu]");
	let max = document.querySelector(`#${name}-maximize`);
	let drag;
	window.addEventListener("click", e => {
		if(!trigger.classList.contains("active")) {
			triggers.forEach(trigger=>{
				trigger.classList.remove("active");
			});
			trigger.classList.add("active");
		}
	});
	trigger.addEventListener("click", e => {
		if(trigger.checked) {
			trigger.setAttribute("checked", "");
			triggers.forEach(trigger=>{
				trigger.classList.remove("active");
			});
			trigger.classList.add("active");
			order = order + 1;
			if(tab) tab.style.order = order;
			layer = layer + 1;
			window.style.zIndex = layer;
			window.setAttribute("data-index", layer);
			drag = new Draggabilly(window, {
				handle: ".window-nav",
				containment: true
			});
		} else {
			trigger.classList.remove("active");
			trigger.removeAttribute("checked");
			inside.removeAttribute("style");
			window.removeAttribute("data-index");
			if(drag != undefined) drag.destroy();
			window.removeAttribute("style");
			if(menu) {
				menu.checked = false;
				menu.removeAttribute("checked");
			}
			if(max) max.checked = false;
		}
	});
});

const minimizers = [... document.querySelectorAll("[data-minimize]")];
minimizers.forEach((minimizer, index)=>{
	let name = minimizer.getAttribute("data-name");
	let trigger = document.querySelector(`#${name}`);
	let tab = document.querySelector(`.tab-${name} .activate`);
	let window = document.querySelector(`#window-${name}`);
	tab.addEventListener("click", e => {
		triggers.forEach(trigger=>{
			trigger.classList.remove("active");
		});
		trigger.classList.add("active");
		let layers = [... document.querySelectorAll("[data-index]")];
		if(layers.length > 1 && !minimizer.checked) {
			let values = [];
			layers.forEach(layer=>{
				values.push(layer.getAttribute("data-index"));
			});
			let highest = Math.max(...values) + 1;
			window.style.zIndex = highest;
			window.setAttribute("data-index", highest);
		}
	});
	minimizer.addEventListener("click", e => {
		if(minimizer.checked) {
			minimizer.setAttribute("checked", "");
			trigger.classList.remove("active");
		} else {
			minimizer.removeAttribute("checked");
			triggers.forEach(trigger=>{
				trigger.classList.remove("active");
			});
			trigger.classList.add("active");
		}
	});
});

windows.forEach(window=>{
	let menu = window.querySelector("[data-menu]");
	let toggle = window.querySelector("[data-toggle]");
	let labels =  [... window.querySelectorAll("[data-label]")];
	if(toggle) {
		toggle.addEventListener("pointerdown", e => {
			menu.checked = true;
			menu.setAttribute("checked", "");
		});
	}
	if(labels.length > 0) {
		labels.forEach(label => {
			label.addEventListener("click", e => {
				menu.checked = false;
				menu.removeAttribute("checked");
			});
		});
	}
});

const time = document.querySelector(".clock");
const updateTime = () => {
	let date = luxon.DateTime.fromJSDate(new Date()).toLocaleString(luxon.DateTime.TIME_SIMPLE);
	time.innerHTML = date;
}
updateTime();
setInterval(() => updateTime(), 1000);


const body = document.querySelector('body');
const date = new Date();
const hour = date.getHours();

const updateColors = () => {
	let interfaceColor = "hsl("+(150-(hour*2))+","+(54+(hour*0.5))+"%,"+(50-(hour*0.6))+"%)";
	body.style.backgroundImage = "linear-gradient(0deg, hsla(359, 98%, 22%,"+((hour-1)*0.02)+"), hsla(0, 93%, 24%,"+((hour-1)*0.035)+"), hsla(0, 95%, 24%,"+((hour-1)*0.04166)+"), hsla(0, 100%, 40%,"+((hour-1)*0.037)+")), url('images/silviakeyimage-2.png')"; 
	root.style.setProperty('--interface-color', interfaceColor);
}
updateColors();
setInterval(() => updateColors(), 1000);
