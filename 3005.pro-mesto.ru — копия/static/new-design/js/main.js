let win = $(window)
let modals_bg = $('.modals-bg')
let mob_menu_wr = $('#mob-menu-wr')

// mobmenu
function m_menu_hiding() {
    mob_menu_wr.removeClass('active')
    modals_bg.fadeOut(200)
    $('body').removeClass('oh')
}
$('#burger-btn').on('click', function () {
    mob_menu_wr.addClass('active')
    modals_bg.fadeIn(200)
    $('body').addClass('oh')
})
$('#close-btn').on('click', m_menu_hiding)

document.addEventListener('DOMContentLoaded', function () {})
document.querySelectorAll('input[type=tel]').forEach(input => {
    obj = window.intlTelInput(input, {
        allowDropdown: false,

        initialCountry: '',
        onlyCountries: ['ru'],
        showFlags: false,
        strictMode: true,
    })
    input.addEventListener('keyup', () => {
        if (input.value[0] == 8) {
            input.value = '+7' + input.value.slice(1)
        }

        input.setAttribute('is_valid', obj.isValidNumber())
    })

    //Стерлчоки на катекориях + анимашки
    const menu = document.querySelector('.slider-sm-tabs')
    if (menu) {
        const currentUrl = window.location.href
        const itemCard = document.querySelectorAll('.sm-tab')
        itemCard.forEach(item => {
            if (currentUrl.includes(item.getAttribute('href'))) {
                item.classList.add('active-menu-item-card')
            }
        })
        const itemactiveCard = document.querySelector('.active-menu-item-card')
        if (itemactiveCard) {
            itemactiveCard.scrollIntoView({
                behavior: 'smooth',
                block: 'nearest',
                inline: 'center',
            })
        }
        const leftArrow = document.querySelector('.slider-left-arrow')
        const rightArrow = document.querySelector('.slider-right-arrow')

        function updateArrowVisibility() {
            if (menu.scrollLeft <= 0) {
                leftArrow.style.display = 'none'
            } else {
                leftArrow.style.display = 'block'
            }

            if (menu.scrollLeft + menu.clientWidth >= menu.scrollWidth) {
                rightArrow.style.display = 'none'
            } else {
                rightArrow.style.display = 'block'
            }
        }

        if (leftArrow && rightArrow && menu) {
            const scrollDistance = window.innerWidth < 768 ? 260 : 520
            leftArrow.addEventListener('click', function () {
                smoothScroll(menu, -scrollDistance)
            })
            rightArrow.addEventListener('click', function () {
                smoothScroll(menu, scrollDistance)
            })

            menu.addEventListener('scroll', updateArrowVisibility)
            updateArrowVisibility()
        }

        function smoothScroll(element, distance) {
            const start = element.scrollLeft
            const startTime = performance.now()
            const duration = 300

            function scrollAnimation(currentTime) {
                const elapsed = currentTime - startTime
                const progress = Math.min(elapsed / duration, 1)
                element.scrollLeft = start + distance * progress

                if (progress < 1) {
                    requestAnimationFrame(scrollAnimation)
                } else {
                    updateArrowVisibility()
                }
            }

            requestAnimationFrame(scrollAnimation)
        }

        // window.addEventListener('resize', positionArrows)
        // window.addEventListener('DOMContentLoaded', positionArrows)
    }
})

// accordion
let item_heading = $('.item-heading')
item_heading.on('click', function () {
    item_heading.not($(this)).siblings('.item-content').slideUp(250)
    item_heading.not($(this)).closest('.accordion-item').removeClass('active')
    $(this).siblings('.item-content').slideToggle(250)
    $(this).closest('.accordion-item').toggleClass('active')
})

// modals
let modals_close = $('.modals-bg, .close-modal'),
    temp_id
function open_modal(target) {
    $('body').addClass('oh')
    let obj = $(target.attr('data-target')),
        obj_h = obj.outerHeight(),
        win_h = win.outerHeight()
    if (mob_menu_wr.hasClass('active')) {
        mob_menu_wr.removeClass('active')
    } else {
        modals_bg.fadeIn(200)
    }
    $(obj).addClass('active')
    if (!obj.hasClass('no-ofd') && win_h - obj_h < 100) {
        obj.addClass('ofd')
        obj.on('transitionend', function () {
            $(this).addClass('voila')
        })
    }
}
function close_modal() {
    $('body').removeClass('oh')
    modals_bg.fadeOut(200)
    $('.modal-cont, .slick-dots').removeClass('active mod ofd')
    $('.modal-cont').on('transitionend', function () {
        $(this).removeClass('voila')
    })
    if (temp_id !== '') {
        $('.imgs-modal .content-inner')
            .children('.slick-popup')
            .appendTo('#' + temp_id)
    }
    temp_id = ''
}
modals_close.on('click', close_modal)

$('.open-modal-btn').on('click', function (e) {
    open_modal($(this))
    e.preventDefault()
})

// // collapse search-block
// let block = $('.search-block.hdn'), block_inner = $('.search-block.hdn>*'), delta, h, h_min;
// const num = 3; // количество оставляемых строк при минимизации
// function collapse_search_block() {
// 	delta = block.innerHeight() - block.height();
// 	h = 0; h_min = 0;
// 	for (let i = 0; i < block_inner.length; i++) { h = h + $(block_inner[i]).innerHeight() }
// 	for (let i = 0; i <= num; i++) { h_min = h_min + $(block_inner[i]).innerHeight() }
// 	if (block.hasClass('minified')) { block.css('maxHeight', h_min + delta) }
// 	else { block.css('maxHeight', h + delta + 150) }
// }
// $('#filter-clps, #filter-clps2').on('click', function () {
// 	let obj, btn_inn = $('.cards-group .filters-btn .svg-icon, .cards-group .filters-btn span');
// 	if ($(this).hasClass('btn-in')) { obj = $(this).closest('.search-block.hdn') }
// 	else { obj = $(this).closest('.search-block-panel').next('.search-block.hdn') }
// 	if (obj.hasClass('minified')) { block.animate({ maxHeight: h + delta + 150 }, 400).removeClass('minified') }
// 	else { block.animate({ maxHeight: h_min + delta }, 400).addClass('minified') }
// 	btn_inn.toggleClass('mod')
// });

// page roll
let page = $('html, body')
$('a[href*="#_"]').on('click', function () {
    page.animate({ scrollTop: $($.attr(this, 'href')).offset().top }, 800)
    return false
})

// // map
// let map_wrap = $('.map-wrap');
// map_wrap.on('mouseenter', function () { $(this).children('.map-cover').fadeIn(200) });
// map_wrap.on('mouseleave', function () { $(this).children('.map-cover').fadeOut(200) });

// win resize
let win_w,
    psm = 480,
    pmd = 768,
    plg = 960,
    pxl = 1480,
    flag1 = 0,
    flag2 = 0
win.on('load resize', function () {
    win_w = win.outerWidth()
    if (win_w >= pxl) {
        flag1 = 0
    } else if (win_w >= plg) {
        flag1 = 1
    } else if (win_w >= pmd) {
        flag1 = 2
    } else if (win_w >= psm) {
        flag1 = 3
    } else {
        flag1 = 4
    }
    // collapse_search_block();
    if (flag1 !== flag2) {
        if (flag1 <= 1) {
            m_menu_hiding()
        }
        if (flag1 >= 1 && $('.imgs-modal').hasClass('active')) {
            $('.slick-dots').addClass('active')
        }
        flag2 = flag1
    }
})

//Шатобин СС 27.11.2024 Менюшка
document.querySelectorAll('.mob-rental-link, .mob-sale-link').forEach(link => {
    link.addEventListener('click', function (e) {
        e.preventDefault()
        this.classList.toggle('open')
    })
})

// /* Tag Изменение карточек  */
// window.addEventListener('load', function () {
//     function updateCards() {
//         document.querySelectorAll('.card').forEach(card => {
//             const firstImage = card.querySelector('.main-image')
//             const splitOverlay = card.querySelector('.split-overlay')
//             const dotsContainer = card.querySelector('.dots-container')
//             const imageContainer = card.querySelector('.image-split-container')

//             const allImages = card.querySelectorAll('.main-image')
//             const isMobile = window.innerWidth <= 768
//             const maxImages = isMobile ? 4 : allImages.length
//             const images = Array.from(allImages)
//                 .map(img => img.src)
//                 .slice(0, maxImages)

//             let currentImageIndex = 0

//             if (firstImage && images.length > 0) {
//                 firstImage.src = images[0]
//             }

//             if (images.length > 1) {
//                 const maxDisplayedImages = Math.min(4, images.length)
//                 const displayedImages = images.slice(0, maxDisplayedImages)

//                 displayedImages.forEach((image, index) => {
//                     const section = document.createElement('div')
//                     section.className = 'split-section'
//                     section.dataset.index = index
//                     if (index === maxDisplayedImages - 1) {
//                         section.classList.add('special-section')
//                     }

//                     splitOverlay.appendChild(section)

//                     const dot = document.createElement('span')
//                     dot.className = 'dot' + (index === 0 ? ' active' : '')
//                     dotsContainer.appendChild(dot)

//                     if (index === 3) {
//                         section.addEventListener('click', () => {
//                             const cardLink = card
//                                 .querySelector('a')
//                                 .getAttribute('href')
//                             if (cardLink) {
//                                 window.open(cardLink, '_blank')
//                             }
//                         })
//                     }

//                     if (images.length > 4 && index === 3) {
//                         section.style.cursor = 'pointer'
//                     }
//                 })

//                 const splitSections = card.querySelectorAll('.split-section')
//                 const dots = card.querySelectorAll('.dot')
//                 let delayTimeout

// function updateImage(index) {
//     if (firstImage) {
//         firstImage.src = images[index]
//     }
//     dots.forEach((dot, i) => {
//         if (i < maxDisplayedImages) {
//             dot.classList.toggle('active', i === index)
//         }
//     })
//     currentImageIndex = index
// }

//                 splitSections.forEach((section, index) => {
//                     section.addEventListener('mouseenter', () => {
//                         delayTimeout = setTimeout(() => {
//                             updateImage(index)
//                             const remainingCount =
//                                 images.length - maxDisplayedImages
//                             if (
//                                 remainingCount > 0 &&
//                                 index === maxDisplayedImages - 1
//                             ) {
//                                 const remainingOverlay =
//                                     card.querySelector('.remaining-overlay')
//                                 if (remainingOverlay) {
//                                     remainingOverlay.style.display = 'flex'
//                                     remainingOverlay.addEventListener(
//                                         'click',
//                                         e => e.stopPropagation(),
//                                         { once: true },
//                                     )
//                                 }
//                             }
//                         }, 40)
//                     })

//                     section.addEventListener('mouseleave', () => {
//                         clearTimeout(delayTimeout)
//                         const remainingOverlay =
//                             card.querySelector('.remaining-overlay')
//                         if (remainingOverlay) {
//                             remainingOverlay.style.display = 'none'
//                         }
//                     })
//                 })

//                 let touchStartX, touchEndX, swipeDirection

//                 imageContainer.addEventListener('touchstart', e => {
//                     touchStartX = e.touches[0].clientX
//                 })

//                 imageContainer.addEventListener('touchend', e => {
//                     touchEndX = e.changedTouches[0].clientX
//                     const swipeThreshold = 50
//                     const swipeDistance = touchEndX - touchStartX

//                     if (Math.abs(swipeDistance) > swipeThreshold) {
//                         swipeDirection = swipeDistance > 0 ? 'left' : 'right'
//                         const nextIndex =
//                             swipeDirection === 'right'
//                                 ? currentImageIndex + 1
//                                 : currentImageIndex - 1
//                         updateImage(
//                             nextIndex >= images.length
//                                 ? 0
//                                 : nextIndex < 0
//                                 ? images.length - 1
//                                 : nextIndex,
//                         )
//                     } else {
//                         updateImage(currentImageIndex)
//                     }
//                 })

//                 if (!isMobile && images.length > maxDisplayedImages) {
//                     const remainingCount = images.length - maxDisplayedImages
//                     const remainingDiv = document.createElement('div')
//                     remainingDiv.className = 'remaining-overlay'
//                     remainingDiv.style.display = 'none'
//                     remainingDiv.innerHTML = `<span class="remaining-text">Еще ${remainingCount} фотографии</span>`
//                     imageContainer.appendChild(remainingDiv)
//                 }
//             }
//         })
//     }

//     updateCards()

//     // Обновлять карточки при изменении размера окна

// })
