const grid = document.querySelector('.tile-grid');
if (grid) {
  for (let index = 0; index < 810; index += 1) {
    const tile = document.createElement('i');
    tile.style.setProperty('--delay', `${-(Math.random() * 0.5).toFixed(3)}s`);
    tile.style.setProperty('--duration', `${(0.38 + Math.random() * 0.24).toFixed(3)}s`);
    grid.appendChild(tile);
  }
}
