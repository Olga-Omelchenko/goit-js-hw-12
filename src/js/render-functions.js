import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

const galleryContainer = document.querySelector('.gallery');
const loader = document.querySelector('.loader');
const loadMoreBtn = document.querySelector('.load-more');

const lightbox = new SimpleLightbox('.gallery a', {
  captionsData: 'alt',
  captionDelay: 250,
});

export function createGallery(images) {
  const markup = images.map(img => `
    <a href="${img.largeImageURL}" class="gallery-item">
      <img src="${img.webformatURL}" alt="${img.tags}" />
      <div class="info">
        <p><strong>Likes:</strong> ${img.likes}</p>
        <p><strong>Views:</strong> ${img.views}</p>
        <p><strong>Comments:</strong> ${img.comments}</p>
        <p><strong>Downloads:</strong> ${img.downloads}</p>
      </div>
    </a>
  `).join('');

  document.querySelector('.gallery').insertAdjacentHTML('beforeend', markup);
  lightbox.refresh();
}


export function clearGallery() {
  galleryContainer.innerHTML = '';
}

export function showLoader() {
  loader.classList.remove('hidden');
}

export function hideLoader() {
  loader.classList.add('hidden');
}

export function showLoadMoreButton() {
  loadMoreBtn.classList.remove('hidden');
}

export function hideLoadMoreButton() {
  loadMoreBtn.classList.add('hidden');
}
