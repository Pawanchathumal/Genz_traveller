document.addEventListener('DOMContentLoaded', function () {
  var searchInput = document.getElementById('locationSearch');
  var typeCheckboxes = Array.from(document.querySelectorAll('.type-checkbox'));
  var resetBtn = document.getElementById('resetFilters');
  var grid = document.getElementById('locationsGrid');
  var cards = Array.from(grid.querySelectorAll('.location-card'));
  var filterToggle = document.getElementById('filterToggle');
  var filterPanel = document.querySelector('.filter-panel');
  var closeFilter = document.getElementById('closeFilter');
  var overlay = document.getElementById('filterOverlay');
  var resultCount = document.getElementById('resultCount');
  var debounceTimer = null;

  function applyFilters() {
    var q = (searchInput.value || '').trim().toLowerCase();
    var selectedTypes = typeCheckboxes.filter(function(c){ return c.checked; }).map(function(c){ return (c.value||'').toLowerCase(); });

    var visible = 0;
    cards.forEach(function (col) {
      var title = (col.querySelector('.card-title')?.textContent || '').toLowerCase();
      var text = (col.querySelector('.card-text')?.textContent || '').toLowerCase();
      var itemType = (col.getAttribute('data-type') || '').toLowerCase();

      var matchesQuery = !q || title.includes(q) || text.includes(q);
      var matchesType = selectedTypes.length === 0 || selectedTypes.indexOf(itemType) !== -1;

      if (matchesQuery && matchesType) {
        col.style.display = '';
        visible++;
      } else {
        col.style.display = 'none';
      }
    });
    updateCount(visible, cards.length);
  }

  function updateCount(visible, total) {
    if (!resultCount) return;
    resultCount.textContent = 'Showing ' + visible + ' of ' + total;
  }

  // Debounced search for better UX
  if (searchInput) searchInput.addEventListener('input', function () {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(applyFilters, 220);
  });
  typeCheckboxes.forEach(function(cb){ cb.addEventListener('change', applyFilters); });
  if (resetBtn) {
    resetBtn.addEventListener('click', function () {
        if (searchInput) searchInput.value = '';
        typeCheckboxes.forEach(function(cb){ cb.checked = false; });
      applyFilters();
    });
  }

  // Toggle filter panel for small screens
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

  if (filterToggle) filterToggle.addEventListener('click', function (e) { e.preventDefault(); openPanel(); });
  if (closeFilter) closeFilter.addEventListener('click', function (e) { e.preventDefault(); closePanelFunc(); });
  if (overlay) overlay.addEventListener('click', closePanelFunc);

  // Initialize Count + filters
  applyFilters();
});
