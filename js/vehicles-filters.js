document.addEventListener('DOMContentLoaded', function () {
  var searchInput = document.getElementById('vehicleSearch');
  var typeCheckboxes = Array.from(document.querySelectorAll('.vehicle-type-checkbox'));
  var acSelect = document.getElementById('vehicleAC');
  var passengersInput = document.getElementById('vehiclePassengers');
  var resetBtn = document.getElementById('resetVehicleFilters');
  var grid = document.getElementById('vehiclesGrid');
  var cards = grid ? Array.from(grid.querySelectorAll('.vehicle-card')) : [];
  var filterToggle = document.getElementById('vehicleFilterToggle');
  var filterPanel = document.querySelector('.filter-panel');
  var closeFilter = document.getElementById('closeVehicleFilter');
  var overlay = document.getElementById('vehicleFilterOverlay');
  var resultCount = document.getElementById('vehicleResultCount');
  var debounceTimer = null;

  function applyFilters() {
    var q = (searchInput && searchInput.value || '').trim().toLowerCase();
    var selectedTypes = typeCheckboxes.filter(function(c){ return c.checked; }).map(function(c){ return (c.value||'').toLowerCase(); });
    var ac = (acSelect && acSelect.value || '').toLowerCase();
    var minPassengers = parseInt(passengersInput && passengersInput.value, 10) || 0;

    var visible = 0;
    cards.forEach(function (col) {
      var title = (col.querySelector('.card-title')?.textContent || '').toLowerCase();
      var text = (col.querySelector('.card-text')?.textContent || '').toLowerCase();
      var itemType = (col.getAttribute('data-type') || '').toLowerCase();
      var itemAc = (col.getAttribute('data-ac') || '').toLowerCase();
      var itemPassengers = parseInt(col.getAttribute('data-passengers') || '0', 10);

      var matchesQuery = !q || title.includes(q) || text.includes(q);
      var matchesType = selectedTypes.length === 0 || selectedTypes.indexOf(itemType) !== -1;
      var matchesAc = !ac || ac === itemAc;
      var matchesPassengers = !minPassengers || itemPassengers >= minPassengers;

      if (matchesQuery && matchesType && matchesAc && matchesPassengers) {
        col.style.display = '';
        visible++;
      } else {
        col.style.display = 'none';
      }
    });
    if (resultCount) resultCount.textContent = 'Showing ' + visible + ' of ' + cards.length;
  }

  if (searchInput) searchInput.addEventListener('input', function () { clearTimeout(debounceTimer); debounceTimer = setTimeout(applyFilters, 200); });
  typeCheckboxes.forEach(function(cb){ cb.addEventListener('change', applyFilters); });
  if (acSelect) acSelect.addEventListener('change', applyFilters);
  if (passengersInput) passengersInput.addEventListener('input', function(){ clearTimeout(debounceTimer); debounceTimer = setTimeout(applyFilters, 200); });
  if (resetBtn) resetBtn.addEventListener('click', function(){ if (searchInput) searchInput.value=''; typeCheckboxes.forEach(function(c){ c.checked=false; }); if (acSelect) acSelect.value=''; if (passengersInput) passengersInput.value=''; applyFilters(); });

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
