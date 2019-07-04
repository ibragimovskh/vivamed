let mediumZoom = require("medium-zoom");
let images = document.querySelectorAll("#img");

images.forEach(image => mediumZoom(image));
