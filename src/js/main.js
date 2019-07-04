let mediumZoom = require("medium-zoom");
let images = document.querySelectorAll("#img");
// let $ = require("jquery");

images.forEach(image => mediumZoom(image));

lazyload(images);
