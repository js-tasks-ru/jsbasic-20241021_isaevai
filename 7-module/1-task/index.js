import createElement from '../../assets/lib/create-element.js';

export default class RibbonMenu {
  categories;
  elem;

  constructor(categories) {
    this.categories = categories;
    this.elem = this.#render();
  }

  get elem() {
    return this.elem;
  } 

  #createCategories() {
    let categories = createElement(`
    <!--Корневой элемент RibbonMenu-->
    <div class="ribbon">
      <!--Кнопка прокрутки влево-->
      <button class="ribbon__arrow ribbon__arrow_left ribbon__arrow_visible">
        <img src="/assets/images/icons/angle-icon.svg" alt="icon">
      </button>
      <!--Ссылки на категории-->
      <nav class="ribbon__inner">` +
      this.categories.map(category => `
      <a href="#" class="ribbon__item" data-id="${category.id}">${category.name}</a>`).join("") + `
      </nav>
  
      <!--Кнопка прокрутки вправо-->
      <button class="ribbon__arrow ribbon__arrow_right">
        <img src="/assets/images/icons/angle-icon.svg" alt="icon">
      </button></div>`);

    return categories;
  }

  #render() {
    this.elem = this.#createCategories();

    //скрываем левую стрелку
    this.elem.getElementsByClassName('ribbon__arrow_left')[0].classList.remove('ribbon__arrow_visible');
    //делаем активной первую категорию из списка
    this.elem.getElementsByClassName('ribbon__item')[0].classList.add('ribbon__item_active');

    this.elem.getElementsByClassName('ribbon__arrow_right')[0].addEventListener('click',this.#onRibbonArrowRightClick);
    this.elem.getElementsByClassName('ribbon__arrow_left')[0].addEventListener('click',this.#onRibbonArrowLeftClick);
    this.elem.getElementsByClassName('ribbon__inner')[0].addEventListener('scroll',this.#onRibbonInnerScroll);
    
    for (let link of this.elem.getElementsByClassName('ribbon__item'))
        link.addEventListener('click',this.#onLinkClick); 

    return this.elem;
  }

  #onRibbonArrowRightClick = () => 
    this.elem.getElementsByClassName('ribbon__inner')[0].scrollBy(350, 0);

  #onRibbonArrowLeftClick = () => 
    this.elem.getElementsByClassName('ribbon__inner')[0].scrollBy(-350, 0);

  #onRibbonInnerScroll = () => {
    let ribbonInner = this.elem.getElementsByClassName('ribbon__inner')[0];
    let ribbonArrowLeft = this.elem.getElementsByClassName('ribbon__arrow_left')[0];
    let ribbonArrowRight = this.elem.getElementsByClassName('ribbon__arrow_right')[0];

    let scrollLeft = ribbonInner.scrollLeft;
    let scrollWidth = ribbonInner.scrollWidth;
    let clientWidth = ribbonInner.clientWidth;
    let scrollRight = scrollWidth - scrollLeft - clientWidth;   

    if (scrollLeft == 0)  {
      ribbonArrowLeft.classList.remove('ribbon__arrow_visible');
      if (!ribbonArrowRight.contains("ribbon__arrow_visible")) 
        ribbonArrowRight.classList.add('ribbon__arrow_visible')
    }

    if (scrollRight < 1)  {
      ribbonArrowRight.classList.remove('ribbon__arrow_visible');
      if (!ribbonArrowLeft.contains("ribbon__arrow_visible")) 
        ribbonArrowLeft.classList.add('ribbon__arrow_visible')
    }
  }

  #onLinkClick = (event) => {
    event.preventDefault();

    const target = event.target;
    const activeCategory = target.closest('.ribbon__item');

    for (let category of this.elem.getElementsByClassName('ribbon__item'))
      category.classList.remove('ribbon__item_active');

    activeCategory.classList.add('ribbon__item_active');
  
    let clickOnLinkEvent = new CustomEvent('ribbon-select', { 
      detail: activeCategory.dataset.id, 
      bubbles: true
    })

    this.elem.dispatchEvent(clickOnLinkEvent);
  };
}