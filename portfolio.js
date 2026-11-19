const filters = document.querySelector('.filters');
if (filters) {
  filters.hidden = false;
  const buttons = [...filters.querySelectorAll('button')];
  function filterProjects() {
    const requested = new URLSearchParams(location.search).get('type');
    const selected = buttons.some(b => b.dataset.filter === requested) ? requested : 'all';
    for (const button of buttons) button.setAttribute('aria-pressed', String(selected === button.dataset.filter));
    for (const card of document.querySelectorAll('[data-kind]')) card.hidden = selected !== 'all' && selected !== card.dataset.kind;
  }
  for (const button of buttons) button.addEventListener('click', () => {
    const url = new URL(location.href);
    if (button.dataset.filter === 'all') url.searchParams.delete('type');
    else url.searchParams.set('type',button.dataset.filter);
    url.hash = 'projects';
    history.pushState(null,'',url);
    filterProjects();
  });
  window.addEventListener('popstate',filterProjects);
  filterProjects();
}

const dialog = document.querySelector('.lightbox');
if (dialog && typeof dialog.showModal === 'function') {
  const links = [...document.querySelectorAll('[data-zoom]')];
  const image = dialog.querySelector('.expanded');
  let index = 0;
  function show(i) {
    index = (i + links.length) % links.length;
    image.src = links[index].href;
    image.alt = links[index].querySelector('img').alt;
    const caption = links[index].parentElement.querySelector('figcaption').textContent;
    dialog.querySelector('[aria-live]').textContent = caption + ' · ' + (index+1) + ' / ' + links.length;
  }
  links.forEach((link,i) => link.addEventListener('click',event => {
    if (event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
    event.preventDefault();
    show(i);
    dialog.showModal();
  }));
  for (const button of dialog.querySelectorAll('[data-step]')) {
    button.hidden = links.length < 2;
    button.addEventListener('click',() => show(index + Number(button.dataset.step)));
  }
  dialog.addEventListener('keydown',event => {
    if (event.key === 'ArrowRight') show(index+1);
    if (event.key === 'ArrowLeft') show(index-1);
  });
  dialog.addEventListener('click',event => {
    if (event.target === dialog) dialog.close();
  });
}
