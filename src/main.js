import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';

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
let isLoading = false;



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
  if (isLoading) return;
  isLoading = true;

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
    scrollPage();
  } catch (error) {
    iziToast.error({
      message: 'Something went wrong. Please try again.',
      position: 'topRight',
    });
  } finally {
    isLoading = false;
    hideLoader();
  }
});

function scrollPage() {
  const galleryItem = document.querySelector('.gallery-item');
  if (!galleryItem) return;
  
  const { height: cardHeight } = galleryItem.getBoundingClientRect();
  window.scrollBy({
    top: cardHeight * 1.5,
    behavior: 'smooth',
  });
}
