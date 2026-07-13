import Swiper from './swiper-bundle.min.js';

export default function decorate(block) {
  block.classList.add('swiper');
  const swipperwrapper = document.createElement('div');
  swipperwrapper.classList.add('swiper-wrapper');
  Array.from(block.children).forEach((eleChild) => {
    eleChild.classList.add('swiper-slide');
    swipperwrapper.append(eleChild);
  });
  block.append(swipperwrapper);
  const blockClassList = Array.from(block.classList);

  function handleResolution() {
    const objConfig = {};
    if (window.innerWidth < 768) {
      // Mobile
      if (blockClassList.indexOf('mobile-auto-scroll') !== -1) {
        objConfig.loop = true;
        objConfig.autoplay = true;
      }
      if (blockClassList.indexOf('one-point-five-view') !== -1) {
        objConfig.slidesPerView = 1.5;
        objConfig.spaceBetween = 10;
      }
      if (blockClassList.indexOf('two-point-five-view') !== -1) {
        objConfig.slidesPerView = 2.5;
        objConfig.spaceBetween = 20;
      }
      if (blockClassList.indexOf('three-point-five-view') !== -1) {
        objConfig.slidesPerView = 3.5;
        objConfig.spaceBetween = 30;
      }
      if (blockClassList.indexOf('mobile-one-point-five-view') !== -1) {
        objConfig.slidesPerView = 1.5;
        objConfig.spaceBetween = 10;
      }
      if (blockClassList.indexOf('mobile-one-point-two-view') !== -1) {
        objConfig.slidesPerView = 1.2;
        objConfig.spaceBetween = 16;
      }
      if (blockClassList.indexOf('mobile-one-point-three-view') !== -1) {
        objConfig.slidesPerView = 1.3;
        objConfig.spaceBetween = 10;
      }
      if (blockClassList.indexOf('center-view') !== -1) {
        objConfig.slidesPerView = 'auto';
        objConfig.centeredSlides = true;
        objConfig.spaceBetween = 30;
      }
      if (blockClassList.indexOf('mobile-pagination') !== -1) {
        const paginationDots = document.createElement('div');
        paginationDots.classList.add('swiper-pagination');
        block.append(paginationDots);
        objConfig.pagination = {
          el: paginationDots,
          clickable: true,
        };
      }
      if (blockClassList.indexOf('mobile-left-right-navigation-btn') !== -1) {
        let navNextbtn;
        let navPrevbtn;
        if (blockClassList.indexOf('card-slider-main') !== -1) {
          const swiperBtn = document.createElement('div');
          swiperBtn.classList.add('btn-wrapper');
          navPrevbtn = document.createElement('div');
          navPrevbtn.classList.add('swiper-button-prev');

          navNextbtn = document.createElement('div');
          navNextbtn.classList.add('swiper-button-next');

          swiperBtn.append(navPrevbtn);
          swiperBtn.append(navNextbtn);
          block.append(swiperBtn);
        } else {
          navNextbtn = document.createElement('div');
          navNextbtn.classList.add('swiper-button-next');
          block.append(navNextbtn);

          navPrevbtn = document.createElement('div');
          navPrevbtn.classList.add('swiper-button-prev');
          block.append(navPrevbtn);
        }
        objConfig.navigation = {
          nextEl: navNextbtn,
          prevEl: navPrevbtn,
        };
      }
      if (blockClassList.indexOf('mobile-loop') !== -1) {
        objConfig.loop = true;
      }
    } else {
      // DeskTop
      if (blockClassList.indexOf('desk-pagination') !== -1) {
        const paginationDots = document.createElement('div');
        paginationDots.classList.add('swiper-pagination');
        block.append(paginationDots);
        objConfig.pagination = {
          el: paginationDots,
          clickable: true,
        };
      }

      if (blockClassList.indexOf('left-right-navigation-btn') !== -1) {
        let navNextbtn;
        let navPrevbtn;
        if (blockClassList.indexOf('card-slider-main') !== -1) {
          const swiperBtn = document.createElement('div');
          swiperBtn.classList.add('btn-wrapper');
          navPrevbtn = document.createElement('div');
          navPrevbtn.classList.add('swiper-button-prev');

          navNextbtn = document.createElement('div');
          navNextbtn.classList.add('swiper-button-next');

          swiperBtn.append(navPrevbtn);
          swiperBtn.append(navNextbtn);
          block.append(swiperBtn);
        } else {
          navNextbtn = document.createElement('div');
          navNextbtn.classList.add('swiper-button-next');
          block.append(navNextbtn);

          navPrevbtn = document.createElement('div');
          navPrevbtn.classList.add('swiper-button-prev');
          block.append(navPrevbtn);
        }
        objConfig.navigation = {
          nextEl: navNextbtn,
          prevEl: navPrevbtn,
        };
      }
      if (blockClassList.indexOf('three-point-view') !== -1) {
        objConfig.slidesPerView = 3;
        objConfig.spaceBetween = 30;
      }
      if (blockClassList.indexOf('one-point-five-view') !== -1) {
        objConfig.slidesPerView = 1.5;
        objConfig.spaceBetween = 10;
      }
      if (blockClassList.indexOf('desk-two-point-five-view') !== -1) {
        objConfig.loop = true;
        // objConfig.autoplay = true;
        objConfig.slidesPerView = 2.5;
        objConfig.spaceBetween = 30;
      }
      if (blockClassList.indexOf('auto-scroll') !== -1) {
        objConfig.loop = true;
        objConfig.slidesPerView = 3.2;
        objConfig.spaceBetween = 10;
      }
      if (blockClassList.indexOf('loop') !== -1) {
        objConfig.loop = true;
      }
    }
    Swiper(block, objConfig);
    // JSON.stringify(objConfig) !== '{}'? SwipperText(block, objConfig) : ''
  }

  // Call it on load
  handleResolution();

  window.addEventListener('resize', handleResolution);
}
