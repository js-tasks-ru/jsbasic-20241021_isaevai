export default class StepSlider {
  elem = null;
  #config = {};

  constructor({ steps, value = 0 }) {
    this.#config = { steps, value } || this.#config;
    this.value = this.#config.value;

    this.#createElem();
  }

  #createSteps() {
    let steps = [];

    for (let i = 0; i < this.#config.steps; i++) {
      if (i === this.value) {
        steps.push(`<span class="slider__step-active"></span>`);
      } else {
        steps.push(`<span></span>`);
      }
    }

    return steps;
  }

  #createTemplate() {
    return `
      <div class="slider__thumb">
        <span class="slider__value">0</span>
      </div>

      <div class="slider__progress"></div>

      <div class="slider__steps">
        ${this.#createSteps().join('\n')}
      </div>
    `;
  }

  #setSliderStep(num) {
    let sliderSteps = this.elem.querySelectorAll('.slider__steps span');

    sliderSteps.forEach((step, index) => {
      if (step.matches('.slider__step-active')) {
        step.classList.remove('slider__step-active');
      }

      if (index === num - 1) {
        step.classList.add('slider__step-active');
      }
    });
  }

  #elemClickHandler(e) {
    let thumb = this.elem.querySelector('.slider__thumb');
    let progress = this.elem.querySelector('.slider__progress');
    let sliderValue = this.elem.querySelector('.slider__value');

    let left = e.clientX - this.elem.getBoundingClientRect().left;
    let leftRelative = left / this.elem.offsetWidth;
    let segments = this.#config.steps - 1;
    this.value = Math.round(leftRelative * segments);
    let valuePercents = this.value / segments * 100;

    sliderValue.textContent = this.value;
    this.#setSliderStep(this.value);
    thumb.style.left = `${valuePercents}%`;
    progress.style.width = `${valuePercents}%`;

    const event = new CustomEvent('slider-change', {
      detail: this.value,
      bubbles: true
    });

    this.elem.dispatchEvent(event);
  }

  #createElem() {
    this.elem = document.createElement('div');
    this.elem.classList.add('slider');

    this.elem.insertAdjacentHTML('afterBegin', this.#createTemplate());

    this.elem.addEventListener('click', this.#elemClickHandler.bind(this));
  }
}