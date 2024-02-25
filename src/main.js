import SimpleLightbox from 'simplelightbox';
import iziToast from 'izitoast';
import { searchImages } from 'pixabay-api';

import 'izitoast/dist/css/iziToast.min.css';
import 'simplelightbox/dist/simple-lightbox.min.css';

import { fetchData } from './js/pixabay-api';
import { imgsTemplate } from './js/render-functions';

const refs = {
  formEl: document.querySelector('form'),
  inputEl: document.querySelector('input'),
  listEl: document.querySelector('ul'),
  loaderEl: document.querySelector('.loader'),
  btnLoad: document.querySelector('.btn-load'),
};
hideLoadBtn();

let query;
let page;
let maxPage;

refs.formEl.addEventListener('submit', onFormSubmit);
refs.btnLoad.addEventListener('click', onLoadMoreClick);

async function onFormSubmit(e) {
  e.preventDefault();
  query = refs.inputEl.value.trim();
  page = 1;

  if (!query) {
    showError('Empty field');
    return;
  }
  showLoader();

  try {
    const data = await fetchData(query, page);
    if (data.totalHits === 0) {
      showError(
        'Sorry, there are no images matching your search query. Please try again!'
      );
    }
    maxPage = Math.ceil(data.totalHits / 15);
    refs.listEl.innerHTML = '';
    renderImgs(data.hits);
    showLightBox();
  } catch (err) {
    showError(err);
  }

  hideLoader();
  checkBtnVisibleStatus();
  e.target.reset();
}

async function onLoadMoreClick() {
  page += 1;
  showLoader();
  const data = await fetchData(query, page);
  renderImgs(data.hits);
  showLightBox();
  hideLoader();
  checkBtnVisibleStatus();

  const height = refs.listEl.firstElementChild.getBoundingClientRect().height;
  scrollBy({
    behavior: 'smooth',
    top: height * 2,
  });
}

function renderImgs(hits) {
  const markup = imgsTemplate(hits);
  refs.listEl.insertAdjacentHTML('beforeend', markup);
}

function showLoader() {
  refs.loaderEl.style.display = 'flex';
}
function hideLoader() {
  refs.loaderEl.style.display = 'none';
}

function showLightBox() {
  const lightbox = new SimpleLightbox('.gallery a', {
    captions: true,
    captionSelector: 'img',
    captionPosition: 'bottom',
    captionsData: 'alt',
  });
  lightbox.on('show.simplelightbox');
  lightbox.refresh();
}

function showError(msg) {
  iziToast.error({
    title: 'Error',
    message: msg,
  });
}

function showLoadBtn() {
  refs.btnLoad.classList.remove('hidden');
}
function hideLoadBtn() {
  refs.btnLoad.classList.add('hidden');
}

function checkBtnVisibleStatus() {
  if (page >= maxPage) {
    hideLoadBtn();
    showError("We're sorry, but you've reached the end of search results.");
  } else {
    showLoadBtn();
  }
}