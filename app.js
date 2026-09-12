const grid = document.querySelector('.tile-grid');
if (grid) {
  for (let index = 0; index < 60; index += 1) {
    const tile = document.createElement('i');
    tile.style.setProperty('--delay', `${-(index % 11) * 0.63}s`);
    tile.style.setProperty('--duration', `${6 + (index % 5) * 0.8}s`);
    grid.appendChild(tile);
  }
}
