document.addEventListener('DOMContentLoaded', function () {
  var searchInput = document.getElementById('hotelSearch');
  var typeCheckboxes = Array.from(document.querySelectorAll('.hotel-type-checkbox'));
  var resetBtn = document.getElementById('resetHotelFilters');
  var grid = document.getElementById('hotelsGrid');
  var cards = grid ? Array.from(grid.querySelectorAll('.hotel-card')) : [];
  var filterToggle = document.getElementById('hotelFilterToggle');
  var filterPanel = document.querySelector('.filter-panel');
  var closeFilter = document.getElementById('closeHotelFilter');
  var overlay = document.getElementById('hotelFilterOverlay');
  var resultCount = document.getElementById('hotelResultCount');
  var debounceTimer = null;

  function applyFilters() {
    var q = (searchInput && searchInput.value || '').trim().toLowerCase();
    var selectedTypes = typeCheckboxes.filter(function(c){ return c.checked; }).map(function(c){ return (c.value||'').toLowerCase(); });
    var visible = 0;
    cards.forEach(function (col) {
      var title = (col.querySelector('.card-title')?.textContent || '').toLowerCase();
      var text = (col.querySelector('.card-text')?.textContent || '') .toLowerCase();
      var itemType = (col.getAttribute('data-type') || '').toLowerCase();
      var matchesQuery = !q || title.includes(q) || text.includes(q);
      var matchesType = selectedTypes.length === 0 || selectedTypes.indexOf(itemType) !== -1;
      if (matchesQuery && matchesType) { col.style.display = ''; visible++; } else { col.style.display = 'none'; }
    });
    if (resultCount) resultCount.textContent = 'Showing ' + visible + ' of ' + cards.length;
  }

  if (searchInput) searchInput.addEventListener('input', function () { clearTimeout(debounceTimer); debounceTimer = setTimeout(applyFilters, 200); });
  typeCheckboxes.forEach(function(cb){ cb.addEventListener('change', applyFilters); });
  if (resetBtn) resetBtn.addEventListener('click', function(){ if (searchInput) searchInput.value=''; typeCheckboxes.forEach(function(c){ c.checked=false; }); applyFilters(); });

  function openPanel() {
    if (!filterPanel) return;
    filterPanel.classList.remove('closed');
    filterPanel.classList.add('open');
    if (overlay) overlay.classList.add('show');
    document.body.style.overflow = 'hidden';
    document.body.classList.add('filter-open');
  }
  function closePanelFunc() {
    if (!filterPanel) return;
    filterPanel.classList.remove('open');
    filterPanel.classList.add('closed');
    if (overlay) overlay.classList.remove('show');
    document.body.style.overflow = '';
    document.body.classList.remove('filter-open');
  }

  if (filterToggle) filterToggle.addEventListener('click', function(e){ e.preventDefault(); openPanel(); });
  if (closeFilter) closeFilter.addEventListener('click', function(e){ e.preventDefault(); closePanelFunc(); });
  if (overlay) overlay.addEventListener('click', closePanelFunc);

  applyFilters();
});
