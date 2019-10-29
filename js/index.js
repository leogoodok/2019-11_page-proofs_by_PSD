/**
 * Обёртка jQuery для избежания конфликтов  при использовании
 * псевдонима $ с другими JS библиотеками
 */
jQuery( function($) {
/**
 * Перехват события прокрутки слайдов "Каруселью Header-а"
 * Изменение состояния (нажата/отжата) кнопок управления сменой слайдов
 */
$('#carouselHeader').on('slide.bs.carousel', function(event) {
  const target_container = $(event.currentTarget).data('targetControlButton');
  if (!target_container) { return; }
  $(target_container).find('button[data-slide-to]').each(function(i,elem) {
    if (event.from == $(this).attr('data-slide-to')) {
      $(this).removeClass('active');
    } else if (event.to == $(this).attr('data-slide-to')) {
      $(this).addClass('active');
    }
  });
});


/**
 *  Выполнить после построения страницы
 */
$(document).ready(function() {
  /**
   *  Назначение обработчика события клика на кнопках
   * "управления сменой слайдов Каруселью Header-а"
   */
  $('.carousel').each(function(j,elem_carousel) {
    const target_container = $(elem_carousel).data('targetControlButton');
    if (target_container) {
      $(target_container).find('button[data-slide-to]').each(function(i,elem) {
        $(this).click( function() {
          $($(this).data('target')).carousel($(this).data('slideTo'));
        });
      });
    }
  });


  /**
   * Формирование гл.массива элементов с эффектом "Паралакса"
   */
  window.elem_parallax = [];
  $('body').find('div[data-parallax]').each(function(i,elem) {
    if ($(elem).attr('id')) {
      window.elem_parallax.push('#' + $(elem).attr('id'));
    }
  });


  /**
   * Обработчик прокрутки страницы
   * Добавление эффекта Паралакса
   */
  $(window).scroll(function () {
    //В цикле по элементам с эффектом "Паралакса"
    for (let i = 0; i < window.elem_parallax.length; i++) {
      if ($(window.elem_parallax[i]).data('bgImgHeight')) {
        let elem_top = $(window.elem_parallax[i]).offset().top;
        let elem_height = $(window.elem_parallax[i]).innerHeight();
        let img_height = $(window.elem_parallax[i]).data('bgImgHeight');
        let window_height = window.innerHeight;
        let start_path_elem = (window_height > elem_top) ? (window_height - elem_top) : 0;
        let path_elem = -start_path_elem + window_height + elem_height;
        let path_img = img_height - elem_height;
        let coeff = path_img / path_elem;
        let offset_scroll = (elem_top > window_height) ? (elem_top - window_height) : 0;
        let scroll_y = $(this).scrollTop();
        path_img = Math.floor(path_img);
        if (scroll_y > offset_scroll && scroll_y <= (elem_top + elem_height)) {
          let movement = -Math.floor((scroll_y - offset_scroll) * coeff);
          //! Проверка не обязательна! movement расчитывается корректно.
          if (movement > 0) movement = 0;
          if (movement < -path_img) movement = -path_img;
          $(window.elem_parallax[i]).css({
            backgroundPosition: 'center ' + movement + 'px'
          });
        }
      }
    }
  });


  /**
   * Прокрутка страницы до Якоря
   */
  $("a[data-scroll-to-anchor]").click(function(e) {
    $("html, body").animate({
      scrollTop: $($(this).attr("href")).offset().top + "px"
    }, {
      duration: 1000,
      easing: "swing"
    });
    e.preventDefault();
    return false;
  });
});
});
