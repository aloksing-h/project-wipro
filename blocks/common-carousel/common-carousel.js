function buildSlide(row) {
  const slide = document.createElement('div');
  slide.classList.add('carousel-slide');

  const [imageCell, textCell, descCell] = [...row.children];

  if (imageCell) slide.append(imageCell);

  if (textCell) {
    textCell.classList.add('slide-text');
    slide.append(textCell);
  }

  if (descCell) {
    descCell.classList.add('slide-description');
    slide.append(descCell);
  }

  return slide;
}

export default function decorate(block) {
  const rows = [...block.children];

  // Build track
  const track = document.createElement('div');
  track.classList.add('carousel-track');

  rows.forEach((row) => {
    track.append(buildSlide(row));
    row.remove();
  });

  block.append(track);

  const slides = [...track.children];
  const total = slides.length;
  let current = 0;

  function goTo(index) {
    current = (index + total) % total;
    track.style.transform = `translateX(-${current * 100}%)`;
    block.querySelectorAll('.carousel-dot').forEach((dot, i) => {
      dot.classList.toggle('active', i === current);
    });
  }

  // Navigation buttons
  const nav = document.createElement('div');
  nav.classList.add('carousel-nav');

  const prev = document.createElement('button');
  prev.classList.add('carousel-btn');
  prev.setAttribute('aria-label', 'Previous slide');
  prev.innerHTML = '&#8592;';
  prev.addEventListener('click', () => goTo(current - 1));

  const next = document.createElement('button');
  next.classList.add('carousel-btn');
  next.setAttribute('aria-label', 'Next slide');
  next.innerHTML = '&#8594;';
  next.addEventListener('click', () => goTo(current + 1));

  nav.append(prev, next);
  block.append(nav);

  // Dot indicators
  if (total > 1) {
    const dots = document.createElement('div');
    dots.classList.add('carousel-dots');

    slides.forEach((_, i) => {
      const dot = document.createElement('button');
      dot.classList.add('carousel-dot');
      dot.setAttribute('aria-label', `Go to slide ${i + 1}`);
      if (i === 0) dot.classList.add('active');
      dot.addEventListener('click', () => goTo(i));
      dots.append(dot);
    });

    block.append(dots);
  }

  goTo(0);
}
