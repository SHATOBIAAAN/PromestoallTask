document.addEventListener('DOMContentLoaded', function () {
    document.querySelectorAll('.thumb1').forEach(card => {
        card.addEventListener('click', function () {
            changeSlide(0, this)
        })
        document.querySelectorAll('input[type="radio"]').forEach(radio => {
            radio.checked = false
        })
    })
})

//Функция для переключения слайдов
let currentSlide = 0
let activeThumb1img = document.querySelector('.thumb1 img')
let activeThumb1 = document.querySelector('.thumb1')
;[activeThumb1img, activeThumb1].forEach(el =>
    el.classList.add(
        el === activeThumb1img ? 'active-thumb1' : 'thumb1-active-thumb1',
    ),
)

function changeSlide(direction, clickedCard = null) {
    const slides = document.querySelectorAll('.slide')
    slides[currentSlide].classList.remove('active-slide')

    currentSlide = clickedCard
        ? Array.from(document.querySelectorAll('.thumb1')).indexOf(clickedCard)
        : (currentSlide + direction + slides.length) % slides.length

    slides[currentSlide].classList.add('active-slide')
    updateActiveThumb(currentSlide)
    document.querySelector(
        `input[name="r"][id="r${currentSlide + 1}"]`,
    ).checked = true
}

function updateActiveThumb(slideIndex) {
    ;[activeThumb1img, activeThumb1].forEach(el =>
        el.classList.remove(
            el === activeThumb1img ? 'active-thumb1' : 'thumb1-active-thumb1',
        ),
    )

    activeThumb1img = document.querySelector(
        `.thumb1:nth-child(${slideIndex + 1}) img`,
    )
    activeThumb1 = document.querySelector(
        `.thumb1:nth-child(${slideIndex + 1})`,
    )
    ;[activeThumb1img, activeThumb1].forEach(el =>
        el.classList.add(
            el === activeThumb1img ? 'active-thumb1' : 'thumb1-active-thumb1',
        ),
    )
}

function openModal(modalId, imageUrl) {
    const modal = document.getElementById(modalId)
    if (modal) {
        modal.querySelector('.modal-main-image').src = imageUrl
        modal.style.display = 'flex'
        document.body.style.overflow = 'hidden'

        updateActiveThumbnail(imageUrl)
    }
}

function updateActiveThumbnail(imageUrl) {
    const thumbnails = document.querySelectorAll('.gallery-row-modal img');
    thumbnails.forEach(thumbnail => {
        thumbnail.classList.toggle(
            'active-thumb1',
            thumbnail.src === imageUrl
        );
    });
}
const changeImage = src => (document.getElementById('main-image').src = src)

function closeModal(modalId) {
    const modal = document.getElementById(modalId)
    if (modal) {
        modal.style.display = 'none'
        document.body.style.overflow = ''

        const mainImageSrc = document.getElementById('main-image').src
        const thumbnails = document.querySelectorAll('.thumb1 img')
        thumbnails.forEach((thumbnail, index) => {
            if (thumbnail.src === mainImageSrc) {
                changeSlide(
                    null,
                    document.querySelector(`.thumb1:nth-child(${index + 1})`),
                )
            }
        })
    }
}

let currentIndex = 0
function changePhoto(direction, clickedIndex = null) {
    const thumbnails = document.querySelectorAll('.gallery-row-modal img')
    thumbnails[currentIndex].classList.remove('active-thumb1')

    currentIndex =
        clickedIndex !== null
            ? clickedIndex
            : (currentIndex + direction + thumbnails.length) % thumbnails.length

    document.getElementById('main-image').src = thumbnails[currentIndex].src
    updateActiveThumbnail(thumbnails[currentIndex].src)
}

const thumbnails = document.querySelectorAll(
    '.image-gallery .gallery-row .thumb1 img',
)
const galleryRowModal = document.getElementById('gallery-row-modal')

thumbnails.forEach((img, index) => {
    const wrapper = document.createElement('div')
    wrapper.className = 'thumbnail-wrapper'

    const label = document.createElement('label')
    label.className = 'thumbnail'
    label.setAttribute('for', `r${index + 1}`)
    label.setAttribute('tabindex', '0')

    const newImg = document.createElement('img')
    newImg.src = img.src
    newImg.onclick = () => {
        changeImage(newImg.src)
        changePhoto(null, index)
    }

    label.appendChild(newImg)
    wrapper.appendChild(label)
    galleryRowModal.appendChild(wrapper)
})

document.querySelectorAll('.slide-foreground').forEach(foreground => {
    foreground.addEventListener('click', function (event) {
        const imageUrl = this.querySelector('img').src
        openModal('modal-5', imageUrl)
    })
})
