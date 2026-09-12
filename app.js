const grid = document.querySelector('.tile-grid');
if (grid) {
  for (let index = 0; index < 60; index += 1) {
    const tile = document.createElement('i');
    tile.style.setProperty('--delay', `${-(index % 17) * 1.1}s`);
    tile.style.setProperty('--duration', `${12 + (index % 7) * 1.6}s`);
    grid.appendChild(tile);
  }
}
