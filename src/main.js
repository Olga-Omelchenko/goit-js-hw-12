import { getImagesByQuery } from './js/pixabay-api';
import {
  createGallery,
  clearGallery,
  showLoader,
  hideLoader,
  showLoadMoreButton,
  hideLoadMoreButton,
} from './js/render-functions';

const form = document.querySelector('.search-form');
const gallery = document.querySelector('.gallery');
const loadMoreBtn = document.querySelector('.load-more');
const loader = document.querySelector('.loader');
const input = document.querySelector('.search-input');

let currentPage = 1;
let currentQuery = '';
let totalImages = 0;

form.addEventListener('submit', async e => {
  e.preventDefault();
  currentQuery = input.value.trim();

  if (currentQuery === '') return;

  clearGallery();
  hideLoadMoreButton();
  currentPage = 1;

  showLoader();
  try {
    const data = await getImagesByQuery(currentQuery, currentPage);

    totalImages = data.totalHits;
    if (data.hits.length === 0) {
      iziToast.info({
        message: 'No images found. Try another search.',
        position: 'topRight',
      });
      return;
    }

    createGallery(data.hits);
    if (totalImages > 15) {
      showLoadMoreButton();
    }
  } catch (error) {
    console.error(error);
  } finally {
    hideLoader();
  }
});

loadMoreBtn.addEventListener('click', async () => {
  currentPage += 1;
  showLoader();

  try {
    const data = await getImagesByQuery(currentQuery, currentPage);
    createGallery(data.hits);

    const totalLoaded = gallery.querySelectorAll('.gallery-item').length;
    if (totalLoaded >= totalImages) {
      hideLoadMoreButton();
      iziToast.info({
        message: "We're sorry, but you've reached the end of search results.",
        position: 'topRight',
      });
    }
  } catch (error) {
    console.error(error);
  } finally {
    hideLoader();
  }
});

