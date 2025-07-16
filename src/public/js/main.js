const getCookie = (name) => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
};

const getImageId = () => {
    const image = document.querySelector('.container__image img');
    return image?.src.split('/').pop().split('.')[0];
};

const likeButton = document.querySelector('.container__button-like');

const updateLikeButton = (liked) => {
    if (!likeButton) return;
    likeButton.classList.toggle('-pink', liked === true || liked === 'true');
};

const handleLikeButtonClick = () => {
    const imageId = getImageId();
    if (!imageId) return;

    fetch('/setLike', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: imageId })
    })
    .then(response => response.json())
    .then(data => {
        updateLikeButton(data.liked);
        console.log('Cookie set:', data.liked);
    })
    .catch(console.error);
};

document.addEventListener('DOMContentLoaded', () => {
    const imageId = getImageId();
    if (!imageId) return;

    const isImageLiked = getCookie(imageId);
    updateLikeButton(isImageLiked);

    if (likeButton) {
        likeButton.addEventListener('click', handleLikeButtonClick);
    }
});
