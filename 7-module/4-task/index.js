import createElement from '../../assets/lib/create-element.js';

export default class StepSlider {
  elem;
  steps;
  value;

  constructor({ steps, value = 0 }) {
    this.steps = steps;
    this.value = value;
    this.elem = this.#initSlider();
  }

  get elem() {
    return this.elem;
  } 

  get value() {
    return this.value;
  }

  get steps() {
    return this.steps;
  }

  #createSliderTemplate() {
    let template = createElement(`
    <!--Корневой элемент слайдера-->
    <div class="slider">
    
      <!--Ползунок слайдера с активным значением-->
      <div class="slider__thumb">
        <span class="slider__value"></span>
      </div>
    
      <!--Полоска слайдера-->
      <div class="slider__progress"></div>
    
      <!-- Шаги слайдера (вертикальные чёрточки) -->
      <div class="slider__steps">
      </div>
    </div>`);

    return template;
  }

  #insertSpan() {
    let template = this.#createSliderTemplate();
    let sliderSteps = template.querySelector('.slider__steps');

    for(let i=0; i<this.steps; i++) {
      let span = document.createElement('span');
      sliderSteps.appendChild(span);
    }

    return template;
  }

  #initSlider() {
    this.elem = this.#insertSpan();
    this.elem.querySelector('.slider__value').textContent = this.value;
    this.elem.querySelector('.slider__steps').firstElementChild.classList.add('slider__step-active');
    this.elem.addEventListener('click', this.#onSliderClick);
    this.elem.querySelector('.slider__thumb').addEventListener('pointerdown', this.#onPointerDown);

    return this.elem;
  }

  #getLeftRelative(event) {
    let left = event.clientX - this.elem.getBoundingClientRect().left; 
    let leftRelative = left / this.elem.offsetWidth;

    if (leftRelative < 0) {
      leftRelative = 0;
    }
    
    if (leftRelative > 1) {
      leftRelative = 1;
    }

    return leftRelative;
  }

  #setCurrentValue(leftRelative, segments) {
    let approximateValue = leftRelative * segments;
    this.value = Math.round(approximateValue);
  }

  #makeStepActive() {
    this.elem.querySelector('.slider__value').textContent = this.value;
    
    let steps = this.elem.querySelector('.slider__steps').childNodes;
    steps.forEach((step) => {
      if (step.classList && step.classList.contains('slider__step-active')) 
        step.classList.remove('slider__step-active')
    });

    steps[this.value].classList.add('slider__step-active');
  }

  #moveSlider(percent) {
    let thumb = this.elem.querySelector('.slider__thumb');
    let progress = this.elem.querySelector('.slider__progress');

    thumb.style.left = `${percent}%`;
    progress.style.width = `${percent}%`;
  }

  #onSliderClick = (event) => {
    let segments = this.steps - 1;
    let leftRelative = this.#getLeftRelative(event);
    this.#setCurrentValue(leftRelative, segments);
    let valuePercents = this.value / segments * 100;
    this.#moveSlider(valuePercents);
    this.#makeStepActive();

    let clickOnSliderEvent = new CustomEvent('slider-change', { 
      detail: this.value, 
      bubbles: true
    })

    this.elem.dispatchEvent(clickOnSliderEvent);
  }

  #onPointerMove = (event) => {
    let segments = this.steps - 1;
    let leftRelative = this.#getLeftRelative(event);
    this.#moveSlider(leftRelative * 100);
    this.#setCurrentValue(leftRelative, segments);
    this.#makeStepActive();
  }

  #onPointerDown = (event) => {
    let thumb = this.elem.querySelector('.slider__thumb');
    this.elem.classList.add('slider_dragging');
    thumb.ondragstart = () => false;
    event.preventDefault();

    document.addEventListener('pointermove', this.#onPointerMove);

    document.addEventListener('pointerup', () => {
      document.removeEventListener('pointermove', this.#onPointerMove);
      this.elem.classList.remove('slider_dragging');

      let dragOnSliderEvent = new CustomEvent('slider-change', { 
        detail: this.value, 
        bubbles: true
      })
  
      this.elem.dispatchEvent(dragOnSliderEvent);
    }, {once: true});
  }
}