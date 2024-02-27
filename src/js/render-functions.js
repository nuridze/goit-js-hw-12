'use strict';

import SimpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css";

const refs = {
    imageElem: document.querySelector('.gallery'),
};

const gallery = new SimpleLightbox('.gallery a', {
    captions: true,
    captionDelay: 250,
    captionsData: 'alt',
  });

export default function renderImages(pictures) {
    const markup = pictures
    .map(({ webformatURL, largeImageURL, tags, likes, views, comments, downloads }) =>
        `<li class="gallery-item">
            <a href="${largeImageURL}">
                <img src="${webformatURL}" alt="${tags}""/>
                <div class="img-info">
                    <p class="info-item"><b>Likes:</b>${likes}</p>
                    <p class="info-item"><b>Views:</b>${views}</p>
                    <p class="info-item"><b>Comments:</b>${comments}</p>
                    <p class="info-item"><b>Downloads:</b>${downloads}</p>
                </div>
            </a>
        </li>`)
    .join('');

    refs.imageElem.insertAdjacentHTML('beforeend', markup);

    gallery.refresh();
};