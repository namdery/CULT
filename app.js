const grid = document.querySelector('.tile-grid');
if (grid) {
  for (let index = 0; index < 360; index += 1) {
    const tile = document.createElement('i');
    tile.style.setProperty('--delay', `${-(index % 19) * 0.18}s`);
    tile.style.setProperty('--duration', `${3.2 + (index % 7) * 0.45}s`);
    grid.appendChild(tile);
  }
}
