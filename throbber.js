class Throbber extends HTMLElement {
	static tagName = "throb-ber";

	static register(tagName, registry) {
		if(!registry && ("customElements" in globalThis)) {
			registry = globalThis.customElements;
		}

		registry?.define(tagName || this.tagName, this);
	}

	static attr = {
		delay: "delay"
	};

	static classes = {
		active: "active",
	};

	static css = `
@keyframes rainbow {
	0% { background-position: 0% 50%; }
	100% { background-position: 100% 50%; }
}
:host {
	display: grid;
}
:host(.${Throbber.classes.active}) ::slotted(*),
:host(.${Throbber.classes.active}):after {
	grid-area: 1 / 1;
}
:host(.${Throbber.classes.active}):after {
	content: "";
	opacity: .4;
	background-image: linear-gradient(238deg, #ff0000, #ff8000, #ffff00, #80ff00, #00ff00, #00ff80, #00ffff, #0080ff, #0000ff, #8000ff, #ff0080);
	background-size: 1200% 1200%;
	background-position: 2% 80%;
	animation: rainbow 4s ease-out alternate infinite;
}
@media (prefers-reduced-motion: reduce) {
	:host(.${Throbber.classes.active}):after {
		animation: none;
	}
}
`;

	get delay() {
		return parseInt(this.getAttribute(Throbber.attr.delay), 10) || 200;
	}

	connectedCallback() {
		// https://caniuse.com/mdn-api_cssstylesheet_replacesync
		// TODO we already prefers-reduced-motion above but maybe also skip out early here too
		if(this.shadowRoot || !("replaceSync" in CSSStyleSheet.prototype)) {
			return;
		}

		let shadowroot = this.attachShadow({ mode: "open" });
		let sheet = new CSSStyleSheet();
		sheet.replaceSync(Throbber.css);
		shadowroot.adoptedStyleSheets = [sheet];

		let slot = document.createElement("slot");
		shadowroot.appendChild(slot);

		let images = this.querySelectorAll("img");
		// Add a delay
		if(this.delay) {
			setTimeout(() => {
				this.addIndicator();
			}, this.delay)
		} else {
			this.addIndicator();
		}

		let promises = [];
		for(let img of images) {
			promises.push(new Promise((resolve, reject) => {
				// resolve on error on on load
				img.addEventListener("load", () => resolve());
				img.addEventListener("error", () => resolve());
			}));
		}

		Promise.all(promises).then(() => {
			this.finished = true;
			this.removeIndicator()
		});
	}

	addIndicator() {
		if(this.finished) {
			return;
		}
		this.classList.add(Throbber.classes.active);
	}

	removeIndicator() {
		this.classList.remove(Throbber.classes.active);
	}
}

Throbber.register();

export { Throbber }
