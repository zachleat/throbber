class Throbber extends HTMLElement {
	static tagName = "throb-ber";

	static register(tagName, registry) {
		if(!registry && ("customElements" in globalThis)) {
			registry = globalThis.customElements;
		}

		registry?.define(tagName || this.tagName, this);
	}

	static attr = {
		pause: "pause", // even if an image load event fires, don’t resolve yet (datauri to real url swapping)
	};

	static classes = {
		throbber: "throbber",
		active: "active",
	};

	static css = `
@keyframes rainbow {
	0% { background-position: 0% 50%; }
	100% { background-position: 100% 50%; }
}
:host {
	display: block;
	position: var(--throbber-position, relative); /* Allow other parents to be stacking context */
}

.${Throbber.classes.throbber},
.${Throbber.classes.throbber}:before {
	position: absolute;
	inset: 0;
	bottom: auto;
	z-index: 1;
	pointer-events: none;
	height: var(--throbber-height, .5em);
}
:host(:not(.${Throbber.classes.active})) .${Throbber.classes.throbber}:before {
	opacity: 0;
}
.${Throbber.classes.throbber}:before {
	content: "";
	display: block;
	opacity: .8;
	transition: opacity .3s;
	background-image: linear-gradient(238deg, #ff0000, #ff8000, #ffff00, #80ff00, #00ff00, #00ff80, #00ffff, #0080ff, #0000ff, #8000ff, #ff0080);
	background-size: 1200% 1200%;
	background-position: 2% 80%;
	animation: rainbow 4s ease-out alternate infinite;
}
@media (prefers-reduced-motion: reduce) {
	.${Throbber.classes.throbber} {
		animation: none;
	}
}
`;

	useAnimation() {
		return "matchMedia" in window && !window.matchMedia('(prefers-reduced-motion: reduce)').matches;
	}

	connectedCallback() {
		// https://caniuse.com/mdn-api_cssstylesheet_replacesync
		if(this.shadowRoot || !("replaceSync" in CSSStyleSheet.prototype) || !this.useAnimation()) {
			return;
		}

		let shadowroot = this.attachShadow({ mode: "open" });
		let sheet = new CSSStyleSheet();
		sheet.replaceSync(Throbber.css);
		shadowroot.adoptedStyleSheets = [sheet];

		let slot = document.createElement("slot");
		shadowroot.appendChild(slot);

		let throbber = document.createElement("div");
		throbber.classList.add(Throbber.classes.throbber);
		// feature?: click to remove
		// throbber.addEventListener("click", () => {
		// 	this.removeIndicator();
		// })
		shadowroot.appendChild(throbber);

		let promises = [];
		let images = this.querySelectorAll("img");
		if(images.length > 0) {
			this.addIndicator();

			for(let img of images) {
				promises.push(new Promise((resolve, reject) => {
					// resolve on error on on load
					img.addEventListener("load", () => {
						if(!this.hasAttribute(Throbber.attr.pause)) {
							resolve()
						}
					});
					img.addEventListener("error", () => {
						if(!this.hasAttribute(Throbber.attr.pause)) {
							resolve()
						}
					});
				}));
			}
		}

		this.ready = Promise.all(promises).then(() => {
			this.finished = true;
			this.removeIndicator();
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
