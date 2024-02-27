'use strict';

import getImages from './js/pixabay-api';
import renderImages from './js/render-functions';

import iziToast from "izitoast";
import "izitoast/dist/css/iziToast.min.css";

const STORAGE_KEY = 'image-tag';

const refs = {
    imgTagInput: document.querySelector('#search-img'),
    searchBtn: document.querySelector('.form'),
    imageElem: document.querySelector('.gallery'),
    btnLoadMore: document.querySelector('.load-btn'),
    loader: document.querySelector('.backdrop'),
};

let userImgTag;
let page;
let maxPage;

refs.imgTagInput.addEventListener('input', onFormInput);
refs.searchBtn.addEventListener('submit', onSearchImg);
refs.btnLoadMore.addEventListener('click', onLoadMoreClick);

async function onSearchImg(evt) {
    evt.preventDefault();
    userImgTag = refs.imgTagInput.value.trim();
    page = 1;

    if (userImgTag === '') {
        enterTag();
        return false;
    } else {
        showLoader();
    };

    try {
        const data = await getImages(userImgTag, page);
        maxPage = Math.ceil(data.totalHits / 15);

        refs.imageElem.innerHTML = '';
        showImages(data.hits);
    } catch (error) {
        console.log(error.message);
    }

    localStorage.removeItem(STORAGE_KEY);
    hideLoader();
    checkBtnVisibleStatus();
    refs.searchBtn.reset();
}

async function onLoadMoreClick() {
    page += 1;
    showLoader();
    const data = await getImages(userImgTag, page);
    showImages(data.hits);

    hideLoader();
    checkBtnVisibleStatus();
  
    const height = refs.imageElem.firstElementChild.getBoundingClientRect().height;
  
    scrollBy({
      behavior: 'smooth',
      top: height * 2,
    });
}

function saveToLS(key, value) {
    const archive = JSON.stringify(value);
    localStorage.setItem(key, archive);
}

function onFormInput() {
  const tag = refs.imgTagInput.value.trim();

  const data = {
      tag,
  };

  saveToLS(STORAGE_KEY, data);
}

function loadFromLS(key) {
    const archive = localStorage.getItem(key);

    try {
        return JSON.parse(archive);
    } catch (error) {
        console.error('Error parsing JSON from localStorage:', error);
        return {};
    }
}

function init() {
    const data = loadFromLS(STORAGE_KEY) || {};
    refs.imgTagInput.value = data.tag || '';
}

init();


function showImages(images) {
    const markup = renderImages(images);
    showLoadBtn();
}


function showLoadBtn() {
    refs.btnLoadMore.classList.remove('hidden');
}

function hideLoadBtn() {
    refs.btnLoadMore.classList.add('hidden');
}
  
function showLoader() {
    refs.loader.classList.add('is-open');
}

function hideLoader() {
    refs.loader.classList.remove('is-open');
}

function checkBtnVisibleStatus() {
    if (page >= maxPage) {
      hideLoadBtn();
      endAlert();
    }
}


const enterTag = () => 
    iziToast.error({
        message: 'Please enter a search tag',
        titleColor: 'white',
        titleSize: '16px',
        messageColor: 'white',
        messageSize: '16px',
        backgroundColor: '#ef4040',
        iconUrl: '/img/error.svg',
        iconColor: 'white',
        position: 'topRight',
    });

const endAlert = () =>
    iziToast.info({
        message: "We're sorry, but you've reached the end of search results.",
        messageSize: '16px',
        position: 'bottomCenter',
    });