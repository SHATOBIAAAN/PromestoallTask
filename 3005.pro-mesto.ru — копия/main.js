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

let slider = document.querySelector('.mobile-slider'),
    sliderList = slider.querySelector('.mobile-slider-list'),
    sliderTrack = slider.querySelector('.slider-track'),
    slides = slider.querySelectorAll('.slide'),
    slideWidth = slides[0].offsetWidth,
    slideIndex = 0,
    posInit = 0,
    posX1 = 0,
    posX2 = 0,
    posY1 = 0,
    posY2 = 0,
    posFinal = 0,
    isSwipe = false,
    isScroll = false,
    allowSwipe = true,
    transition = true,
    nextTrf = 0,
    prevTrf = 0,
    lastTrf = --slides.length * slideWidth,
    posThreshold = slides[0].offsetWidth * 0.35,
    trfRegExp = /([-0-9.]+(?=px))/,
    swipeStartTime,
    swipeEndTime,
    getEvent = function () {
        return event.type.search('touch') !== -1 ? event.touches[0] : event
    },
    slide = function () {
        if (transition) {
            sliderTrack.style.transition = 'transform .5s'
        }
        sliderTrack.style.transform = `translate3d(-${
            slideIndex * slideWidth
        }px, 0px, 0px)`
    },
    swipeStart = function () {
        let evt = getEvent()

        if (allowSwipe) {
            swipeStartTime = Date.now()

            transition = true

            nextTrf = (slideIndex + 1) * -slideWidth
            prevTrf = (slideIndex - 1) * -slideWidth

            posInit = posX1 = evt.clientX
            posY1 = evt.clientY

            sliderTrack.style.transition = ''

            document.addEventListener('touchmove', swipeAction)
            document.addEventListener('mousemove', swipeAction)
            document.addEventListener('touchend', swipeEnd)
            document.addEventListener('mouseup', swipeEnd)

            sliderList.classList.remove('grab')
            sliderList.classList.add('grabbing')
        }
    },
    swipeAction = function () {
        let evt = getEvent(),
            style = sliderTrack.style.transform,
            transform = +style.match(trfRegExp)[0]

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
            if (slideIndex === 0) {
                if (posInit < posX1) {
                    setTransform(transform, 0)
                    return
                } else {
                    allowSwipe = true
                }
            }

            // запрет ухода вправо на последнем слайде
            if (slideIndex === --slides.length) {
                if (posInit > posX1) {
                    setTransform(transform, lastTrf)
                    return
                } else {
                    allowSwipe = true
                }
            }

            if (
                (posInit > posX1 && transform < nextTrf) ||
                (posInit < posX1 && transform > prevTrf)
            ) {
                reachEdge()
                return
            }

            sliderTrack.style.transform = `translate3d(${
                transform - posX2
            }px, 0px, 0px)`
        }
    },
    swipeEnd = function () {
        posFinal = posInit - posX1

        isScroll = false
        isSwipe = false

        document.removeEventListener('touchmove', swipeAction)
        document.removeEventListener('mousemove', swipeAction)
        document.removeEventListener('touchend', swipeEnd)
        document.removeEventListener('mouseup', swipeEnd)

        sliderList.classList.add('grab')
        sliderList.classList.remove('grabbing')

        if (allowSwipe) {
            swipeEndTime = Date.now()
            if (
                Math.abs(posFinal) > posThreshold ||
                swipeEndTime - swipeStartTime < 300
            ) {
                if (posInit < posX1) {
                    slideIndex--
                } else if (posInit > posX1) {
                    slideIndex++
                }
            }

            if (posInit !== posX1) {
                allowSwipe = false
                slide()
            } else {
                allowSwipe = true
            }
        } else {
            allowSwipe = true
        }
    },
    setTransform = function (transform, comapreTransform) {
        if (transform >= comapreTransform) {
            if (transform > comapreTransform) {
                sliderTrack.style.transform = `translate3d(${comapreTransform}px, 0px, 0px)`
            }
        }
        allowSwipe = false
    },
    reachEdge = function () {
        transition = false
        swipeEnd()
        allowSwipe = true
    }

sliderTrack.style.transform = 'translate3d(0px, 0px, 0px)'
sliderList.classList.add('grab')

sliderTrack.addEventListener('transitionend', () => (allowSwipe = true))
slider.addEventListener('touchstart', swipeStart)
slider.addEventListener('mousedown', swipeStart)
