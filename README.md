# throbber

A web component to add a little baby rainbow gradient overlay until all of the images nested inside have finished loading. Works best with expensive dynamically generated images (like screenshots).

* [Demos](https://zachleat.github.io/throbber/demo.html)
* Used on the registration flow for [`conf.11ty.dev`](https://conf.11ty.dev/)

## Features

* Customize minimum `delay` before the loading indicator is shown.
* Customize loading indicator bar height.

## Installation

You can install via `npm` ([`@zachleat/throbber`](https://www.npmjs.com/package/@zachleat/throbber)) or download the `throbber.js` JavaScript file manually.

```shell
npm install @zachleat/throbber --save
```

Add `throbber.js` to your site’s JavaScript assets.

## Usage

```html
<throb-ber>
	<img src="myimage.png" alt="" width="600" height="400">
</throb-ber>
```

### Change minimum delay

The minimum time before the loading indicator is shown. `delay` is in milliseconds (0.5 seconds shown).

```html
<throb-ber delay="500">
	<img src="myimage.png" alt="" width="600" height="400">
</throb-ber>
```

### Customize appearance

Dark background while the image is loading, loading indicator fills up the component:

```html
<throb-ber style="background-color: #666; --throbber-height: 100%;">
	<img src="myimage.png" alt="" width="600" height="400">
</throb-ber>
```

Use your own custom gradient:

```html
<throb-ber style="--throbber-image: linear-gradient(to right, white, rebeccapurple); --throbber-opacity: 1">
	<img src="myimage.png" alt="" width="600" height="400">
</throb-ber>
```
