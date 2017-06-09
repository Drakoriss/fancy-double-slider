/**
 * Method for avoiding `window.onload` re-assigning.
 *
 * @param {function} func
 */
function addLoadEvent(func) {

    let oldOnLoad = window.onload;

    if (typeof oldOnLoad !== "function") {
        window.onload = func;
    } else {
        window.onload = () => {
            oldOnLoad();
            func();
        };
    }
}

/**
 * Sliders `oninput` method.
 */
function getFDSValues() {

    let parent = this.parentNode,
        slides = parent.getElementsByTagName("input"),
        slide1 = parseFloat(slides[0].value),
        slide2 = parseFloat(slides[1].value);

    // Neither slider will clip the other, so make sure we determine which is larger
    if (slide1 > slide2) {
        [slide1, slide2] = [slide2, slide1];
    }

    let displayElement = parent.getElementsByClassName("fds-range-values")[0];

    displayElement.innerHTML = slide1 + " - " + slide2;
}

// Initialization of all existing FDS
addLoadEvent(() => {

    let sliderSections = document.getElementsByClassName("fancy-double-slider");

    for (let section = 0; section < sliderSections.length; section++) {

        let sliders = sliderSections[section].getElementsByTagName("input");

        for (let slider = 0; slider < sliders.length; slider++) {

            if (sliders[slider].type === "range") {
                sliders[slider].oninput = getFDSValues;

                // Manually trigger event first time to display values
                sliders[slider].oninput();
            }
        }
    }
});
