function imgTemplate(hit) {
    const {
      largeImageURL,
      webformatURL,
      tags,
      likes,
      views,
      comments,
      downloads,
    } = hit;
    return `<li class="list-item"><a href="${largeImageURL}">
            <img class="item-img" src="${webformatURL}" alt="${tags}" ></a><div class="container"><p><b>Likes: </b><br>${likes}</p><p><b>Views: </b><br>${views}</p><p><b>Comments: </b><br>${comments}</p><p><b>Downloads: </b><br>${downloads}</p>
            </div></li>`;
  }
  
  export function imgsTemplate(hits) {
    return hits.map(imgTemplate).join('');
  }