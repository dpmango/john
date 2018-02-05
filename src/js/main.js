$(document).ready(function(){

  //////////
  // Global variables
  //////////

  var _window = $(window);
  var _document = $(document);

  function isRetinaDisplay() {
    if (window.matchMedia) {
        var mq = window.matchMedia("only screen and (min--moz-device-pixel-ratio: 1.3), only screen and (-o-min-device-pixel-ratio: 2.6/2), only screen and (-webkit-min-device-pixel-ratio: 1.3), only screen  and (min-device-pixel-ratio: 1.3), only screen and (min-resolution: 1.3dppx)");
        return (mq && mq.matches || (window.devicePixelRatio > 1));
    }
  }

  var _mobileDevice = isMobile();
  // detect mobile devices
  function isMobile(){
    if( /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ) {
      return true
    } else {
      return false
    }
  }

  function msieversion() {
    var ua = window.navigator.userAgent;
    var msie = ua.indexOf("MSIE ");

    if (msie > 0 || !!navigator.userAgent.match(/Trident.*rv\:11\./)) {
      return true
    } else {
      return false
    }
  }

  if ( msieversion() ){
    $('body').addClass('is-ie');
  }

  // BREAKPOINT SETTINGS
  var bp = {
    mobileS: 375,
    mobile: 568,
    tablet: 768,
    desktop: 1024,
    wide: 1336,
    hd: 1680
  }

  //////////
  // DEVELOPMENT HELPER
  //////////
  function setBreakpoint(){
    var wWidth = _window.width();

    var content = "<div class='dev-bp-debug'>"+wWidth+"</div>";

    $('.page').append(content);
    setTimeout(function(){
      $('.dev-bp-debug').fadeOut();
    },1000);
    setTimeout(function(){
      $('.dev-bp-debug').remove();
    },1500)
  }

  _window.on('resize', debounce(setBreakpoint, 200))

  ////////////
  // READY - triggered when PJAX DONE
  ////////////
  function pageReady(){
    legacySupport();

    setPageNavClass();
    headerScrollListener();
    _window.on('scroll', throttle(headerScrollListener, 10));
    revealFooter();
    _window.on('resize', throttle(revealFooter, 100));

    // initPopups();
    // initSliders();
    initScrollMonitor();
    // initRellax();
    initValidation();
    // initMasks();
    setScheduleProgress();

    // temp - developer
    _window.on('resize', debounce(setBreakpoint, 200))
  }

  pageReady();


  //////////
  // HANDLERBARS
  //////////
  // var source   = document.getElementById("js-homepage").innerHTML;
  // var template = Handlebars.compile(source);
  // var context = (function () {
  //   var context = null;
  //   $.ajax({
  //     'async': false,
  //     'global': false,
  //     'url': 'json/home.json',
  //     'dataType': "json",
  //     'success': function (data) {
  //       context = data;
  //     }
  //   });
  //   return context;
  // })();
  // var html = template(context);
  //
  // $("#js-homepage").prepend(html);

  //////////
  // COMMON
  //////////
  function legacySupport(){
    // svg support for laggy browsers
    svg4everybody();

    // Viewport units buggyfill
    window.viewportUnitsBuggyfill.init({
      force: false,
      refreshDebounceWait: 250,
      appendToBody: true
    });
  }

 	// CLICK HANDLERS
	_document
    // prevent empty # hash links behaviour
    .on('click', '[href="#"]', function(e) {
  		e.preventDefault();
  	})
  	// Smoth scroll to section
  	.on('click', 'a[href^="#section"]', function() {
      var el = $(this).attr('href');
      $('body, html').animate({
          scrollTop: $(el).offset().top}, 1000);
      return false;
  	})
    .on('click', '[js-scrollTo]', function(){
      var el = $(this).data('target');
      if (el){
        $('body, html').animate({
            scrollTop: $(el).offset().top}, 1000);
        return false;
      }
    })


  // HAMBURGER TOGGLER
  _document.on('click', '[js-hamburger]', function(){
    $(this).toggleClass('is-active');
    $('.page-nav').toggleClass('is-active');

    // toggle header stae back
    var vScroll = _window.scrollTop();
    var header = $('.header').not('.header--static');
    var headerHeight = header.height();
    var heroHeight = _document.find('.barba-container').children().first().outerHeight() - headerHeight;
    if ( vScroll > headerHeight ){
      header.toggleClass('header--transformed');
    }

    blockScroll();
  });

  var preventKeys = {
    37: 1, 38: 1, 39: 1, 40: 1
  };

  function preventDefault(e) {
    e = e || window.event;
    if (e.preventDefault)
      e.preventDefault();
    e.returnValue = false;
  }

  function preventDefaultForScrollKeys(e) {
    if (preventKeys[e.keyCode]) {
      preventDefault(e);
      return false;
    }
  }

  function disableScroll() {
    if (window.addEventListener) // older FF
      window.addEventListener('DOMMouseScroll', preventDefault, false);
    window.onwheel = preventDefault; // modern standard
    window.onmousewheel = document.onmousewheel = preventDefault; // older browsers, IE
    window.ontouchmove = preventDefault; // mobile
    document.onkeydown = preventDefaultForScrollKeys;
  }

  function enableScroll() {
    if (window.removeEventListener)
      window.removeEventListener('DOMMouseScroll', preventDefault, false);
    window.onmousewheel = document.onmousewheel = null;
    window.onwheel = null;
    window.ontouchmove = null;
    document.onkeydown = null;
  }

  function blockScroll(unlock) {
    if ($('[js-hamburger]').is('.is-active')) {
      disableScroll();
    } else {
      enableScroll();
    }

    if (unlock) {
      enableScroll();
    }
  };

  function closeMenu() {
    blockScroll(true); // true is for the unlock option
    $('[js-hamburger]').removeClass('is-active');
    $('.page-nav').removeClass('is-active');
  }


  // FOOTER REVEAL
  function revealFooter() {
    var footer = $('[js-reveal-footer]');
    if (footer.length > 0) {
      var footerHeight = footer.outerHeight();
      var maxHeight = _window.height() - footerHeight > 100;
      if (maxHeight && !msieversion() ) {
        $('body').css({
          'margin-bottom': footerHeight
        });
        footer.css({
          'position': 'fixed',
          'z-index': -10
        });
      } else {
        $('body').css({
          'margin-bottom': 0
        });
        footer.css({
          'position': 'static',
          'z-index': 10
        });
      }
    }
  }

  // HEADER SCROLL
  // add .header-static for .page or body
  // to disable sticky header
  function headerScrollListener(){
    if ( _document.height() / _window.height() > 2.5 ){
      var vScroll = _window.scrollTop();
      var header = $('.header').not('.header--static');
      var headerHeight = header.height();
      var heroHeight = _document.find('.barba-container').children().first().outerHeight() - headerHeight;

      if ( vScroll > headerHeight ){
        header.addClass('header--transformed');
      } else {
        header.removeClass('header--transformed');
      }

      if ( vScroll > heroHeight - headerHeight){
        header.addClass('header--fixed');
      } else {
        header.removeClass('header--fixed');
      }
    }
  }

  // SET ACTIVE CLASS IN HEADER
  // * could be removed in production and server side rendering
  // user .active for li instead
  function setPageNavClass(){
    $('.page-nav__menu li').each(function(i,val){
      if ( $(val).find('a').attr('href') == window.location.pathname.split('/').pop() ){
        $(val).addClass('is-active');
      } else {
        $(val).removeClass('is-active')
      }
    });
  }

  // shedule progress
  function setScheduleProgress(){
    $('.schedule-card__progress').each(function(i, el){
      var width = $(el).data('progress');
      $(el).css({'width': width + '%'})
    })
  }


  //////////
  // SLIDERS
  //////////

  // function initSliders(){
  //   $('.trending__wrapper').slick({
  //     autoplay: true,
  //     dots: false,
  //     arrows: false,
  //     infinite: true,
  //     speed: 300,
  //     slidesToShow: 1,
  //     centerMode: true,
  //     variableWidth: true
  //   });
  // }
  //
  // //////////
  // // MODALS
  // //////////
  //
  // function initPopups(){
  //   // Magnific Popup
  //   // var startWindowScroll = 0;
  //   $('.js-popup').magnificPopup({
  //     type: 'inline',
  //     fixedContentPos: true,
  //     fixedBgPos: true,
  //     overflowY: 'auto',
  //     closeBtnInside: true,
  //     preloader: false,
  //     midClick: true,
  //     removalDelay: 300,
  //     mainClass: 'popup-buble',
  //     callbacks: {
  //       beforeOpen: function() {
  //         // startWindowScroll = _window.scrollTop();
  //         // $('html').addClass('mfp-helper');
  //       },
  //       close: function() {
  //         // $('html').removeClass('mfp-helper');
  //         // _window.scrollTop(startWindowScroll);
  //       }
  //     }
  //   });
  //
  //   $('[js-popup-gallery]').magnificPopup({
  // 		delegate: 'a',
  // 		type: 'image',
  // 		tLoading: 'Загрузка #%curr%...',
  // 		mainClass: 'popup-buble',
  // 		gallery: {
  // 			enabled: true,
  // 			navigateByImgClick: true,
  // 			preload: [0,1]
  // 		},
  // 		image: {
  // 			tError: '<a href="%url%">The image #%curr%</a> could not be loaded.'
  // 		}
  // 	});
  // }


  ////////////
  // UI
  ////////////

  // textarea autoExpand
  $(document)
    .one('focus.autoExpand', 'textarea.autoExpand', function(){
        var savedValue = this.value;
        this.value = '';
        this.baseScrollHeight = this.scrollHeight;
        this.value = savedValue;
    })
    .on('input.autoExpand', 'textarea.autoExpand', function(){
        var minRows = this.getAttribute('data-min-rows')|5, rows;
        this.rows = minRows;
        rows = Math.ceil((this.scrollHeight - this.baseScrollHeight) / 17);
        this.rows = minRows + rows;
    });

  // FLOATING LABELS
  // focus in
  _document.on('focus', '.ui-input-dynamic', function(){
    $(this).addClass('is-focused');
  })

  // focus out
  _document.on('blur', '.ui-input-dynamic', function(){
    var thisVal = $(this).find('input, textarea').val();
    if ( thisVal !== "" ){
      $(this).addClass('is-focused');
    } else {
      $(this).removeClass('is-focused');
    }
  })

  // Masked input
  // function initMasks(){
  //   $(".js-dateMask").mask("99.99.99",{placeholder:"ДД.ММ.ГГ"});
  //   $("input[type='tel']").mask("+7 (000) 000-0000", {placeholder: "+7 (___) ___-____"});
  // }



  ////////////
  // SCROLLMONITOR - WOW LIKE
  ////////////
  function initScrollMonitor(){
    $('.wow').each(function(i, el){

      var elWatcher = scrollMonitor.create( $(el) );

      var delay;
      if ( $(window).width() < 768 ){
        delay = 0
      } else {
        delay = $(el).data('animation-delay');
      }

      var animationClass

      if ( $(el).data('animation-class') ){
        animationClass = $(el).data('animation-class');
      } else {
        animationClass = "wowFadeUp"
      }

      var animationName

      if ( $(el).data('animation-name') ){
        animationName = $(el).data('animation-name');
      } else {
        animationName = "wowFade"
      }

      elWatcher.enterViewport(throttle(function() {
        $(el).addClass(animationClass);
        $(el).css({
          'animation-name': animationName,
          'animation-delay': delay,
          'visibility': 'visible'
        });
      }, 100, {
        'leading': true
      }));
      // elWatcher.exitViewport(throttle(function() {
      //   $(el).removeClass(animationClass);
      //   $(el).css({
      //     'animation-name': 'none',
      //     'animation-delay': 0,
      //     'visibility': 'hidden'
      //   });
      // }, 100));
    });

    $('.schedule-card').each(function(i, el){
      var elWatcher = scrollMonitor.create( $(el) );

      elWatcher.enterViewport(throttle(function() {
        setTimeout(function(){
          $(el).addClass('has-entered');
        }, 250)
      }, 100, {
        'leading': true
      }));

      elWatcher.exitViewport(throttle(function() {
        setTimeout(function(){
          $(el).removeClass('has-entered');
        }, 150)

      }, 100));

    });
  }


  //////////
  // PARALLAX
  //////////

  function initRellax(){
    var rellax

    if (rellax){rellax.destroy();}

    if (_document.find('[js-rellax]').length > 0){
      rellax = new Rellax('[js-rellax]', {
        speed: -2,
        mousePower: 8,
        center: true,
        horizontal: true
      });
    }
  }

  //////////
  // BARBA PJAX
  //////////

  Barba.Pjax.Dom.containerClass = "barba-container";

  var FadeTransition = Barba.BaseTransition.extend({
    start: function() {
      Promise
        .all([this.newContainerLoading, this.fadeOut()])
        .then(this.fadeIn.bind(this));
    },

    fadeOut: function() {
      return $(this.oldContainer).animate({ opacity: .5 }, 200).promise();
    },

    fadeIn: function() {
      var _this = this;
      var $el = $(this.newContainer);

      $(this.oldContainer).hide();

      $el.css({
        visibility : 'visible',
        opacity : .5
      });

      $el.animate({ opacity: 1 }, 200, function() {
        document.body.scrollTop = 0;
        _this.done();
      });
    }
  });

  Barba.Pjax.getTransition = function() {
    return FadeTransition;
  };

  Barba.Prefetch.init();
  Barba.Pjax.start();

  Barba.Dispatcher.on('newPageReady', function(currentStatus, oldStatus, container, newPageRawHTML) {
    pageReady();
    // close mobile menu
    closeMenu();

    _window.trigger('scroll');
    _window.scrollTop(2);
  });


  ////////////////
  // FORM VALIDATIONS
  ////////////////
  function initValidation(){
    // jQuery validate plugin
    // https://jqueryvalidation.org


    // GENERIC FUNCTIONS
    ////////////////////

    var validateErrorPlacement = function(error, element) {
      error.addClass('ui-validation');
      error.appendTo(element.parent("div"));
    }
    var validateHighlight = function(element) {
      $(element).parent('div').addClass("has-error");
    }
    var validateUnhighlight = function(element) {
      $(element).parent('div').removeClass("has-error");
    }
    var validateSubmitHandler = function(form) {
      $(form).addClass('loading');
      $.ajax({
        type: "POST",
        url: $(form).attr('action'),
        data: $(form).serialize(),
        success: function(response) {
          $(form).removeClass('loading');
          var data = $.parseJSON(response);
          if (data.status == 'success') {
            // do something I can't test
          } else {
              $(form).find('[data-error]').html(data.message).show();
          }
        }
      });
    }

    // var validatePhone = {
    //   required: true,
    //   normalizer: function(value) {
    //       var PHONE_MASK = '+X (XXX) XXX-XXXX';
    //       if (!value || value === PHONE_MASK) {
    //           return value;
    //       } else {
    //           return value.replace(/[^\d]/g, '');
    //       }
    //   },
    //   minlength: 11,
    //   digits: true
    // }

    ////////
    // FORMS


    /////////////////////
    // REGISTRATION FORM
    ////////////////////
    $("[js-contact-form]").validate({
      errorPlacement: validateErrorPlacement,
      highlight: validateHighlight,
      unhighlight: validateUnhighlight,
      submitHandler: validateSubmitHandler,
      rules: {
        name: "required",
        time: "required",
        email: {
          required: true,
          email: true
        },
        message: "required"
        // phone: validatePhone
      },
      messages: {
        name: "This field is required",
        time: "This field is required",
        email: {
            required: "This field is required",
            email: "Email is invalid"
        },
        message: "This field is required",
      }
    });

  }


});
