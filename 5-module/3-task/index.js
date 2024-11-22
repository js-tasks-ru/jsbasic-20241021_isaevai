function initCarousel() {
  let btnNext = document.querySelector(".carousel__arrow_right");
  let btnPrev = document.querySelector(".carousel__arrow_left");
  let carousel = document.querySelector(".carousel__inner");
  let width = carousel.querySelector(".carousel__slide").offsetWidth;
  let currentSlide = 1;
  btnPrev.style.display = 'none';

  btnNext.onclick = () => {
    btnPrev.style.display = '';
    carousel.style.transform = `translateX(-${width*currentSlide}px)`;
    currentSlide++;
    if(currentSlide === 4)
      btnNext.style.display = 'none';
  }

  btnPrev.onclick = () => {
    btnNext.style.display = '';
    currentSlide--; 
    console.log(currentSlide)
    carousel.style.transform = `translateX(-${width*currentSlide-width}px)`;       
    if(currentSlide === 1)
      btnPrev.style.display = 'none';
  }
}
