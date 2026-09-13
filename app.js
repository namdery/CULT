const grid = document.querySelector('.tile-grid');
if (grid) {
  for (let index = 0; index < 810; index += 1) {
    const tile = document.createElement('i');
    tile.style.setProperty('--delay', `${-(index % 23) * 0.08}s`);
    tile.style.setProperty('--duration', '0.5s');
    grid.appendChild(tile);
  }
}
