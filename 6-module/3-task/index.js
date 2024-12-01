import createElement from '../../assets/lib/create-element.js';

export default class Carousel {
  slides;
  elem;

  constructor(slides) {
    this.slides = slides;
    this.elem = this.#render();
    this.#initCarousel();
  }

  get elem() {
    return this.elem;
  } 

  #createSlide() {
    let slide = createElement(`
    <!--Корневой элемент карусели-->
    <div class="carousel">
      <!--Кнопки переключения-->
      <div class="carousel__arrow carousel__arrow_right">
        <img src="/assets/images/icons/angle-icon.svg" alt="icon">
      </div>
      <div class="carousel__arrow carousel__arrow_left">
        <img src="/assets/images/icons/angle-left-icon.svg" alt="icon">
      </div>
    
      <div class="carousel__inner">` +
      this.slides.map(slide => `
      <div class="carousel__slide" data-id=${slide.id}
        <img src="/assets/images/carousel/${slide.image}" class="carousel__img" alt="slide">
        <div class="carousel__caption">
          <span class="carousel__price">€${slide.price.toFixed(2)}/span>
          <div class="carousel__title">${slide.name}</div>
          <button type="button" class="carousel__button">
            <img src="/assets/images/icons/plus-icon.svg" alt="icon">
           </button>
      </div>
    </div>`).join("") + `</div>`);

    return slide;
  }

  #render(){
    this.elem = this.#createSlide();

    //Событие при клике на "+"
    for (let button of this.elem.getElementsByClassName('carousel__button'))
      button.addEventListener('click', this.#onAddClick);

    return this.elem;
  }

  #onAddClick = (event) => {
      const target = event.target;
      const slide = target.closest('.carousel__slide');
    
      let addProductEvent = new CustomEvent("product-add", {
        detail: slide.dataset.id, 
        bubbles: true 
      });
    
      this.elem.dispatchEvent(addProductEvent);
  };

  #initCarousel() {
    const carousel = this.elem.querySelector('.carousel__inner');
    const leftArrow = this.elem.querySelector('.carousel__arrow_left');
    const rightArrow = this.elem.querySelector('.carousel__arrow_right');

    leftArrow.style.display = 'none';
    rightArrow.style.display = '';

    let slideNumber = 0;
    const lastSlideNumber = carousel.childElementCount - 1;

    function moveSlide(slideNumber, slideWidth) {
      carousel.style.transform = 'translateX(-' + slideWidth * slideNumber + 'px)';
    }

    leftArrow.addEventListener("click", () => {
      slideNumber--;
      moveSlide(slideNumber, carousel.offsetWidth);
      if (slideNumber == 0) leftArrow.style.display = 'none'
      if (rightArrow.style.display == 'none') rightArrow.style.display = ''
    })

    rightArrow.addEventListener("click", () => {
      slideNumber++;
      moveSlide(slideNumber, carousel.offsetWidth);
      if (slideNumber == lastSlideNumber) rightArrow.style.display = 'none'
      if (leftArrow.style.display == 'none') leftArrow.style.display = ''
    })
  }
}