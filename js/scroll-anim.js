(function(){
  // Observe all .card elements and add 'in-view' when they enter viewport
  if (!('IntersectionObserver' in window)) {
    // Fallback: simply add in-view so cards are visible
    document.querySelectorAll('.card.animate-card').forEach(function(el){ el.classList.add('in-view'); });
    return;
  }

  var observerOptions = {
    root: null,
    rootMargin: '0px 0px -8% 0px',
    threshold: 0.12
  };

  var io = new IntersectionObserver(function(entries, obs){
    entries.forEach(function(entry){
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
        // Optionally unobserve to avoid toggling
        obs.unobserve(entry.target);
      }
    });
  }, observerOptions);

  // Attach to cards (only those we want animated)
  document.addEventListener('DOMContentLoaded', function(){
    var cards = document.querySelectorAll('.card');
    cards.forEach(function(card){
      // add initial animate class so CSS can apply
      card.classList.add('animate-card');
      io.observe(card);
    });
  });
})();
