import iziToast from "izitoast";
import "izitoast/dist/css/iziToast.min.css";
import axios from 'axios';
import { createGalleryMarkup } from './render-functions.js';
import { lightbox } from '../main.js';

const API_KEY = '42334631-07f239856d3b6a49db441bfb9';
let totalHits = 0;
let imagesShown = 0;

// Функция дебаунсинга
function debounce(func, delay) {
    let debounceTimer;
    return function (...args) {
        const context = this;
        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(() => func.apply(context, args), delay);
    };
}

// Функция прокрутки
function scrollGallery() {
    const galleryCard = document.querySelector('.photo-card');
    const cardHeight = galleryCard.getBoundingClientRect().height;
    window.scrollBy({ top: cardHeight * 2, behavior: 'smooth' });
}

// Дебаунсинговая версия функции прокрутки
const debouncedScrollGallery = debounce(scrollGallery, 100);

export async function fetchImages(query, page) {
    const loader = document.querySelector('.loader');
    const loadMoreButton = document.querySelector('#load-more');
    loadMoreButton.style.display = 'none'; // Скрываем кнопку Load more во время загрузки
    loader.style.display = 'block';
    try {
        const response = await axios.get(`https://pixabay.com/api/?key=${API_KEY}&q=${encodeURIComponent(query)}&image_type=photo&orientation=horizontal&safesearch=true&per_page=15&page=${page}`); // Добавлены параметры per_page и page
        totalHits = response.data.totalHits;
        imagesShown += response.data.hits.length;
        console.log(response.data);
        loader.style.display = 'none';
        if (response.data.hits.length === 0) {
            if (totalHits === 0) {
                iziToast.info({
                    title: 'Info',
                    message: 'Sorry, there are no images matching your search query. Please try again!'
                });
            } else if (imagesShown >= totalHits) {
                iziToast.info({
                    title: 'Info',
                    message: 'We are sorry, but you have reached the end of search results.'
                });
            }
        } else {
            createGalleryMarkup(response.data.hits);
            lightbox.refresh();
            debouncedScrollGallery(); //Дебаунсинговая функция
            loadMoreButton.style.display = 'block'; // Показываем кнопку Load more после загрузки
        }
    } catch (error) {
        console.error('Error fetching images:', error);
        loader.style.display = 'none';
        iziToast.error({
            title: 'Error',
            message: 'Failed to fetch images. Please try again later.'
        });
    }
}