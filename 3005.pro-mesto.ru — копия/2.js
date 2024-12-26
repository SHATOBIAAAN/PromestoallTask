let slider = document.querySelector('.mobile-slider'),
    sliderList = slider.querySelector('.mobile-slider-list'),
    sliderTrack = slider.querySelector('.mobile-slider-track'),
    slides = slider.querySelectorAll('.mobile-slide'),
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
    swipeEndTime

const getEvent = () =>
    event.type.search('touch') !== -1 ? event.touches[0] : event

const slide = () => {
    if (transition) {
        sliderTrack.style.transition = 'transform .5s'
    }
    sliderTrack.style.transform = `translate3d(-${
        slideIndex * slideWidth
    }px, 0px, 0px)`
}

const swipeStart = () => {
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
        document.addEventListener('touchend', swipeEnd)
        sliderList.classList.remove('grab')
        sliderList.classList.add('grabbing')
    }
}

const swipeAction = () => {
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
        if (slideIndex === 0 && posInit < posX1) {
            setTransform(transform, 0)
            return
        }
        if (slideIndex === --slides.length && posInit > posX1) {
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
        sliderTrack.style.transform = `translate3d(${
            transform - posX2
        }px, 0px, 0px)`
    }
}

const swipeEnd = () => {
    posFinal = posInit - posX1
    isScroll = false
    isSwipe = false
    document.removeEventListener('touchmove', swipeAction)
    document.removeEventListener('touchend', swipeEnd)
    sliderList.classList.add('grab')
    sliderList.classList.remove('grabbing')

    if (allowSwipe) {
        swipeEndTime = Date.now()
        if (
            Math.abs(posFinal) > posThreshold ||
            swipeEndTime - swipeStartTime < 300
        ) {
            slideIndex += posInit < posX1 ? -1 : 1
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
}

const setTransform = (transform, compareTransform) => {
    if (transform >= compareTransform && transform > compareTransform) {
        sliderTrack.style.transform = `translate3d(${compareTransform}px, 0px, 0px)`
    }
    allowSwipe = false
}

const reachEdge = () => {
    transition = false
    swipeEnd()
    allowSwipe = true
}

sliderTrack.style.transform = 'translate3d(0px, 0px, 0px)'
sliderList.classList.add('grab')
sliderTrack.addEventListener('transitionend', () => (allowSwipe = true))
slider.addEventListener('touchstart', swipeStart)

let modal = document.getElementById('modal')
let closeModal = document.querySelector('.mobile-close')
let modalHeader = document.getElementById('modalHeader')
let currentIndex = 0
let modalContentTrack = document.querySelector('.mobile-modal-content-track')

slides.forEach((slide, index) => {
    slide.addEventListener('click', function () {
        modal.style.display = 'block'
        currentIndex = index
        updateModalImage()
    })
    let slideClone = slide.cloneNode(true)
    modalContentTrack.appendChild(slideClone)
})

closeModal.addEventListener('click', function () {
    modal.style.display = 'none'
    slideIndex = currentIndex
    slide()
})

window.addEventListener('click', function (event) {
    if (event.target === modal) {
        modal.style.display = 'none'
        slideIndex = currentIndex
        slide()
    }
})

function updateModalImage() {
    modalContentTrack.style.transform = `translateX(-${currentIndex * 100}%)`
    modalHeader.textContent = `${currentIndex + 1} из ${slides.length}`
}

let startX = 0
let endX = 0
const swipeThresholdPercentage = 0.25 // 30% от ширины модального окна

modal.addEventListener('touchstart', function (event) {
    startX = event.touches[0].clientX
})

modal.addEventListener('touchmove', function (event) {
    let touch = event.touches[0]
    let moveX = touch.clientX - startX
    modalContentTrack.style.transform = `translateX(calc(-${
        currentIndex * 100
    }% + ${moveX}px))`
})

modal.addEventListener('touchend', function (event) {
    endX = event.changedTouches[0].clientX
    handleSwipe()
    modalContentTrack.style.transform = `translateX(-${currentIndex * 100}%)`
})

function handleSwipe() {
    const modalWidth = modal.offsetWidth
    const swipeThreshold = modalWidth * swipeThresholdPercentage // 25% от ширины модального окна

    if (Math.abs(startX - endX) > swipeThreshold) {
        // Проверка на 25% от ширины
        if (startX > endX && currentIndex < slides.length - 1) {
            currentIndex++
        } else if (startX < endX && currentIndex > 0) {
            currentIndex--
        }
    }
    updateModalImage()
}
