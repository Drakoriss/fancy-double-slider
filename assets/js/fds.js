window.FDS = {};

/**
 * Method for avoiding `window.onload` re-assigning.
 *
 * @param {function} func
 */
FDS.addLoadEvent = function addLoadEvent(func) {

    let oldOnLoad = window.onload;

    if (typeof oldOnLoad !== "function") {
        window.onload = func;
    } else {
        window.onload = () => {
            oldOnLoad();
            func();
        };
    }
};

/**
 * Sliders `oninput` method.
 *
 * @param {function} [link] A setter of instance that require value updates from sliders
 */
FDS.getFDSValues = function getFDSValues(link) {

    let parent = this.parentNode,
        slides = parent.getElementsByTagName("input"),
        slide1 = parseFloat(slides[0].value),
        slide2 = parseFloat(slides[1].value);

    // Neither slider will clip the other, so make sure we determine which is larger
    if (slide1 > slide2) {
        [slide1, slide2] = [slide2, slide1];
    }

    if (typeof link === "function") {
        link(slide1, slide2);
    }

    let displayElement = parent.getElementsByClassName("fds-range-values")[0];

    displayElement.innerHTML = slide1 + " - " + slide2;
};

/**
 * Compose range input from provided settings.
 *
 * @param {object} [config={}] Slider config
 * @param {number} [config.min=0] Minimum possible number
 * @param {number} [config.max=1] Maximum possible number
 * @param {number} [config.step=0.1] Slider intervals
 * @param {number} [config.value=0.5] Initial value
 * @param {function} [link] A setter of some instance that require value updates from slider
 * @returns {HTMLElement}
 */
FDS.createInputElement = function createInputElement(config = {}, link) {

    let element = document.createElement("input");

    element.type = "range";
    element.min = config.min || 0;
    element.max = config.max || 1;
    element.step = config.step || .1;
    element.value = config.value || .5;

    if (typeof link === "function") {
        element.oninput = FDS.getFDSValues.bind(element, link);
    } else {
        element.oninput = FDS.getFDSValues;
    }

    return element;
};

/**
 * Compose FancyDoubleSlider control and puts it inside `container` node if such
 * provided. Also you can provide a setter method if you need to catch slider
 * values.
 *
 * @example
 *     let particle = new Particle();
 *
 *     function particleLifeSetter(a, b) {
 *         this.life.min = a;
 *         this.life.max = b;
 *     }
 *
 *     let controlsList = document.createElement("div");
 *
 *     FDS.create(
 *         { min: 0, max: 4, step: 1, value: 1 },
 *         controlsList,
 *         particleLifeSetter.bind(particle)
 *     );
 *
 * @param {object} [config={}] Slider config (look at {@link FDS#createInputElement})
 * @param {HTMLElement} [container] To which node append this control
 * @param {function} [link] A setter of some instance that require value updates from slider
 * @returns {HTMLElement}
 */
FDS.create = function create(config, container, link) {

    let section = document.createElement("section");

    section.className = "fancy-double-slider";

    // Visible only for Firefox, represents slider background
    section.appendChild(document.createElement("div"));

    // Represents numeric values of both thumb
    let indicator = document.createElement("span");

    indicator.className = "fds-range-values";
    section.appendChild(indicator);

    // Two sliders that visually merged into one
    section.appendChild(FDS.createInputElement(config, link));
    section.appendChild(FDS.createInputElement(config, link));

    if (container instanceof HTMLElement) {
        container.appendChild(section);
    }

    // Manually trigger event first time to display values
    section.children[3].oninput();

    return section;
};

// Initialization of all existing FDS
FDS.addLoadEvent(() => {

    let sliderSections = document.getElementsByClassName("fancy-double-slider");

    for (let section = 0; section < sliderSections.length; section++) {

        let sliders = sliderSections[section].getElementsByTagName("input");

        for (let slider = 0; slider < sliders.length; slider++) {

            if (sliders[slider].type === "range") {
                sliders[slider].oninput = FDS.getFDSValues;

                // Manually trigger event first time to display values
                sliders[slider].oninput();
            }
        }
    }
});
