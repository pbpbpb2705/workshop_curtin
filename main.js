// Landing navigation logic — handles button clicks and keyboard activation
(function(){
  const cards = document.querySelectorAll('.nav-card');
  function go(href){
    if (href && typeof href === 'string') location.assign(href);
  }
  for (const card of cards){
    const href = card.getAttribute('data-href');
    card.addEventListener('click', () => go(href));
    card.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); go(href); }
    });
    card.setAttribute('role', 'link');
    card.setAttribute('tabindex', '0');
    card.setAttribute('title', `Open ${href}`);
  }
})();