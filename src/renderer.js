import './index.css';
import { setImageSource, getTitle } from './assets.js';

const animeImage = document.getElementById('anime');
const text = document.getElementById('text');
const titleLabel = document.getElementById('title');

let title

window.DEBUG = {
  ChangeTitle: () => {
    title = getTitle()
    window.windowControls.setTitle(title);
    if (titleLabel) {
      titleLabel.textContent = title;
    }

    return title
  }
}

window.DEBUG.ChangeTitle()

if (animeImage instanceof HTMLImageElement) {
  const loaded = setImageSource(animeImage, 'shy1');
}

const minBtn = document.getElementById('min');
const closeBtn = document.getElementById('x');

minBtn?.addEventListener('click', () => {
  window.windowControls.minimize();
});

closeBtn?.addEventListener('click', () => {
  window.windowControls.close();
});

