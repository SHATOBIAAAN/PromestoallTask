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
    const thumbnails = document.querySelectorAll('.gallery-row-modal img')
    thumbnails.forEach(thumbnail => {
        thumbnail.classList.toggle('active-thumb1', thumbnail.src === imageUrl)
        thumbnail.style.opacity = thumbnail.src === imageUrl ? 1 : 0.8
    })
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

// slider in mobile

let mobileSlider = document.querySelector('.mobile-slider')
let mobileSliderList = mobileSlider.querySelector('.mobile-slider-list')
let mobileSliderTrack = mobileSlider.querySelector('.mobile-slider-track')
let mobileSlides = mobileSlider.querySelectorAll('.mobile-slide')
let mobileSlideWidth = mobileSlides[0].offsetWidth
let mobileSlideIndex = 0
let posInit = 0
let posX1 = 0
let posX2 = 0
let posY1 = 0
let posY2 = 0
let posFinal = 0
let isSwipe = false
let isScroll = false
let allowSwipe = true
let transition = true
let nextTrf = 0
let prevTrf = 0
let lastTrf = -((mobileSlides.length - 1) * mobileSlideWidth)
let posThreshold = mobileSlideWidth * 0.35
let trfRegExp = /([-0-9.]+(?=px))/
let swipeStartTime
let swipeEndTime

const getEvent = event =>
    event.type.includes('touch') ? event.touches[0] : event

const mobileSlide = () => {
    if (transition) {
        mobileSliderTrack.style.transition = 'transform 0.5s'
    }
    mobileSliderTrack.style.transform = `translate3d(-${
        mobileSlideIndex * mobileSlideWidth
    }px, 0px, 0px)`
}

const mobileSwipeStart = event => {
    let evt = getEvent(event)
    if (allowSwipe) {
        swipeStartTime = Date.now()
        transition = true
        nextTrf = (mobileSlideIndex + 1) * -mobileSlideWidth
        prevTrf = (mobileSlideIndex - 1) * -mobileSlideWidth
        posInit = posX1 = evt.clientX
        posY1 = evt.clientY
        mobileSliderTrack.style.transition = 'none'
        document.addEventListener('touchmove', mobileSwipeAction)
        document.addEventListener('touchend', mobileSwipeEnd)
        mobileSliderList.classList.remove('grab')
        mobileSliderList.classList.add('grabbing')
    }
}

const mobileSwipeAction = event => {
    let evt = getEvent(event),
        style = mobileSliderTrack.style.transform,
        transformMatch = style.match(trfRegExp)

    if (!transformMatch) return
    let transform = parseInt(transformMatch[0])

    posX2 = posX1 - evt.clientX
    posX1 = evt.clientX
    posY2 = posY1 - evt.clientY
    posY1 = evt.clientY

    if (!isSwipe && !isScroll) {
        let posY = Math.abs(posY2)
        if (posY > 7 || posX2 === 0) {
            isScroll = true
            allowSwipe = false
        } else if (posY < 7) {
            isSwipe = true
        }
    }

    if (isSwipe) {
        if (mobileSlideIndex === 0 && posInit < posX1) {
            setTransform(transform, 0)
            return
        }
        if (mobileSlideIndex === mobileSlides.length - 1 && posInit > posX1) {
            setTransform(transform, lastTrf)
            return
        }
        if (
            (posInit > posX1 && transform < nextTrf) ||
            (posInit < posX1 && transform > prevTrf)
        ) {
            reachEdge()
            return
        }
        mobileSliderTrack.style.transform = `translate3d(${
            transform - posX2
        }px, 0px, 0px)`
    }
}

const mobileSwipeEnd = () => {
    posFinal = posInit - posX1
    isScroll = false
    isSwipe = false
    document.removeEventListener('touchmove', mobileSwipeAction)
    document.removeEventListener('touchend', mobileSwipeEnd)
    mobileSliderList.classList.add('grab')
    mobileSliderList.classList.remove('grabbing')

    if (allowSwipe) {
        swipeEndTime = Date.now()
        if (
            Math.abs(posFinal) > posThreshold ||
            swipeEndTime - swipeStartTime < 300
        ) {
            mobileSlideIndex += posInit < posX1 ? -1 : 1
            mobileSlideIndex = Math.max(
                0,
                Math.min(mobileSlideIndex, mobileSlides.length - 1),
            )
        }
        if (posInit !== posX1) {
            allowSwipe = false
            mobileSlide()
        } else {
            allowSwipe = true
        }
    } else {
        allowSwipe = true
    }
}

const setTransform = (transform, compareTransform) => {
    if (transform > compareTransform) {
        mobileSliderTrack.style.transform = `translate3d(${compareTransform}px, 0px, 0px)`
    }
    allowSwipe = false
}

const reachEdge = () => {
    transition = false
    mobileSwipeEnd()
    allowSwipe = true
}

mobileSliderTrack.style.transform = 'translate3d(0px, 0px, 0px)'
mobileSliderList.classList.add('grab')
mobileSliderTrack.addEventListener('transitionend', () => (allowSwipe = true))
mobileSlider.addEventListener('touchstart', mobileSwipeStart)
mobileSlider.addEventListener('mousedown', mobileSwipeStart)

let desktopModal = document.getElementById('modal')
let mobileCloseModal = document.querySelector('.mobile-close')
let modalHeader = document.getElementById('modalHeader')
let mobileCurrentIndex = 0
let modalContentTrack = document.querySelector('.mobile-modal-content-track')

mobileSlides.forEach((slide, index) => {
    slide.addEventListener('click', function () {
        desktopModal.style.display = 'block'
        mobileCurrentIndex = index
        updateModalImage()
        document.body.style.overflow = 'hidden'
    })
    let slideClone = slide.cloneNode(true)
    modalContentTrack.appendChild(slideClone)
})

mobileCloseModal.addEventListener('click', function () {
    desktopModal.style.display = 'none'
    mobileSlideIndex = mobileCurrentIndex
    mobileSlide()
    document.body.style.overflow = ''
})

window.addEventListener('click', function (event) {
    if (event.target === desktopModal) {
        desktopModal.style.display = 'none'
        mobileSlideIndex = mobileCurrentIndex
        mobileSlide()
        document.body.style.overflow = ''
    }
})

function updateModalImage() {
    modalContentTrack.style.transform = `translateX(-${
        mobileCurrentIndex * 100
    }%)`
    modalHeader.textContent = `${mobileCurrentIndex + 1} из ${
        mobileSlides.length
    }`
}

let startX = 0
let endX = 0
const swipeThresholdPercentage = 0.25 // 25% от ширины модального окна

desktopModal.addEventListener('touchstart', function (event) {
    startX = event.touches[0].clientX
})

desktopModal.addEventListener('touchmove', function (event) {
    let touch = event.touches[0]
    let moveX = touch.clientX - startX
    modalContentTrack.style.transform = `translateX(calc(-${
        mobileCurrentIndex * 100
    }% + ${moveX}px))`
})

desktopModal.addEventListener('touchend', function (event) {
    endX = event.changedTouches[0].clientX
    handleSwipe()
    modalContentTrack.style.transform = `translateX(-${
        mobileCurrentIndex * 100
    }%)`
})

function handleSwipe() {
    const modalWidth = desktopModal.offsetWidth
    const swipeThreshold = modalWidth * swipeThresholdPercentage

    if (Math.abs(startX - endX) > swipeThreshold) {
        if (startX > endX && mobileCurrentIndex < mobileSlides.length - 1) {
            mobileCurrentIndex++
        } else if (startX < endX && mobileCurrentIndex > 0) {
            mobileCurrentIndex--
        }
    }
    updateModalImage()
}
