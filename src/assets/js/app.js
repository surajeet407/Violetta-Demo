/*
    The MIT License (MIT)
    Copyright (c) 2014 Dirk Groenen
    Permission is hereby granted, free of charge, to any person obtaining a copy of
    this software and associated documentation files (the "Software"), to deal in
    the Software without restriction, including without limitation the rights to
    use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of
    the Software, and to permit persons to whom the Software is furnished to do so,
    subject to the following conditions:
    The above copyright notice and this permission notice shall be included in all
    copies or substantial portions of the Software.
*/

(function($){
    $.fn.viewportChecker = function(useroptions){
        // Define options and extend with user
        var options = {
            classToAdd: 'visible',
            classToRemove : 'invisible',
            classToAddForFullView : 'full-visible',
            removeClassAfterAnimation: false,
            offset: 100,
            repeat: false,
            invertBottomOffset: true,
            callbackFunction: function(elem, action){},
            scrollHorizontal: false,
            scrollBox: window
        };
        $.extend(options, useroptions);

        // Cache the given element and height of the browser
        var $elem = this,
            boxSize = {height: $(options.scrollBox).height(), width: $(options.scrollBox).width()},
            scrollElem = ((navigator.userAgent.toLowerCase().indexOf('webkit') != -1 || navigator.userAgent.toLowerCase().indexOf('windows phone') != -1) ? 'body' : 'html');

        /*
         * Main method that checks the elements and adds or removes the class(es)
         */
        this.checkElements = function(){
            var viewportStart, viewportEnd;

            // Set some vars to check with
            if (!options.scrollHorizontal){
                viewportStart = $(scrollElem).scrollTop();
                viewportEnd = (viewportStart + boxSize.height);
            }
            else{
                viewportStart = $(scrollElem).scrollLeft();
                viewportEnd = (viewportStart + boxSize.width);
            }

            // Loop through all given dom elements
            $elem.each(function(){
                var $obj = $(this),
                    objOptions = {},
                    attrOptions = {};

                //  Get any individual attribution data
                if ($obj.data('vp-add-class'))
                    attrOptions.classToAdd = $obj.data('vp-add-class');
                if ($obj.data('vp-remove-class'))
                    attrOptions.classToRemove = $obj.data('vp-remove-class');
                if ($obj.data('vp-add-class-full-view'))
                    attrOptions.classToAddForFullView = $obj.data('vp-add-class-full-view');
                if ($obj.data('vp-keep-add-class'))
                    attrOptions.removeClassAfterAnimation = $obj.data('vp-remove-after-animation');
                if ($obj.data('vp-offset'))
                    attrOptions.offset = $obj.data('vp-offset');
                if ($obj.data('vp-repeat'))
                    attrOptions.repeat = $obj.data('vp-repeat');
                if ($obj.data('vp-scrollHorizontal'))
                    attrOptions.scrollHorizontal = $obj.data('vp-scrollHorizontal');
                if ($obj.data('vp-invertBottomOffset'))
                    attrOptions.scrollHorizontal = $obj.data('vp-invertBottomOffset');

                // Extend objOptions with data attributes and default options
                $.extend(objOptions, options);
                $.extend(objOptions, attrOptions);

                // If class already exists; quit
                if ($obj.data('vp-animated') && !objOptions.repeat){
                    return;
                }

                // Check if the offset is percentage based
                if (String(objOptions.offset).indexOf("%") > 0)
                    objOptions.offset = (parseInt(objOptions.offset) / 100) * boxSize.height;

                // Get the raw start and end positions
                var rawStart = (!objOptions.scrollHorizontal) ? $obj.offset().top : $obj.offset().left,
                    rawEnd = (!objOptions.scrollHorizontal) ? rawStart + $obj.height() : rawStart + $obj.width();

                // Add the defined offset
                var elemStart = Math.round( rawStart ) + objOptions.offset,
                    elemEnd = (!objOptions.scrollHorizontal) ? elemStart + $obj.height() : elemStart + $obj.width();

                if (objOptions.invertBottomOffset)
                    elemEnd -= (objOptions.offset * 2);

                // Add class if in viewport
                if ((elemStart < viewportEnd) && (elemEnd > viewportStart)){

                    // Remove class
                    $obj.removeClass(objOptions.classToRemove);
                    $obj.addClass(objOptions.classToAdd);

                    // Do the callback function. Callback wil send the jQuery object as parameter
                    objOptions.callbackFunction($obj, "add");

                    // Check if full element is in view
                    if (rawEnd <= viewportEnd && rawStart >= viewportStart)
                        $obj.addClass(objOptions.classToAddForFullView);
                    else
                        $obj.removeClass(objOptions.classToAddForFullView);

                    // Set element as already animated
                    $obj.data('vp-animated', true);

                    if (objOptions.removeClassAfterAnimation) {
                        $obj.one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function(){
                            $obj.removeClass(objOptions.classToAdd);
                        });
                    }

                // Remove class if not in viewport and repeat is true
                } else if ($obj.hasClass(objOptions.classToAdd) && (objOptions.repeat)){
                    $obj.removeClass(objOptions.classToAdd + " " + objOptions.classToAddForFullView);

                    // Do the callback function.
                    objOptions.callbackFunction($obj, "remove");

                    // Remove already-animated-flag
                    $obj.data('vp-animated', false);
                }
            });

        };

        /**
         * Binding the correct event listener is still a tricky thing.
         * People have expierenced sloppy scrolling when both scroll and touch
         * events are added, but to make sure devices with both scroll and touch
         * are handles too we always have to add the window.scroll event
         *
         * @see  https://github.com/dirkgroenen/jQuery-viewport-checker/issues/25
         * @see  https://github.com/dirkgroenen/jQuery-viewport-checker/issues/27
         */

        // Select the correct events
        if( 'ontouchstart' in window || 'onmsgesturechange' in window ){
            // Device with touchscreen
            $(document).bind("touchmove MSPointerMove pointermove", this.checkElements);
        }

        // Always load on window load
        $(options.scrollBox).bind("load scroll", this.checkElements);

        // On resize change the height var
        $(window).resize(function(e){
            boxSize = {height: $(options.scrollBox).height(), width: $(options.scrollBox).width()};
            $elem.checkElements();
        });

        // trigger inital check if elements already visible
        this.checkElements();

        // Default jquery plugin behaviour
        return this;
    };
})(jQuery);




//jquery-viewport-checker lib-----------------------------------------------------------------------------





$(document).foundation();


//preloader---------------------------------

$(window).on('load', function() {
  $('#status').fadeOut();
  $('#preloader').delay(3500).fadeOut('slow');
  $('body').delay(3500).css({'overflow':'hidden'});
})

//sticky-buttons---------------------

 $(document).ready(function() {
      jQuery('.subscribe-btn, .nav-btn').css({display:"none"});
    });
        jQuery(window).scroll(function(){
        if (jQuery(this).scrollTop() > 1) {
            jQuery('.subscribe-btn, .nav-btn').css({display:"block"});
        } else {
            jQuery('.subscribe-btn, .nav-btn').css({display:"none"});
        }
    });

//counter------------------------

$('#number,#number1,#number2').each(function () {
  $(this).prop('Counter', 0).animate({
    Counter: $(this).text()
  }, {
    duration: 50000,
    easing: 'swing',
    step: function step(now) {
      $(this).text(Math.ceil(now));
    }
  });
});



//animation effect with scrolling------------------------


 jQuery(document).ready(function() {
      jQuery('.post1a').addClass("hidden").viewportChecker({
          classToAdd: 'visible animated fadeInLeft',
          offset: 100
         });
  });
  jQuery(document).ready(function() {
      jQuery('.post1b').addClass("hidden").viewportChecker({
          classToAdd: 'visible animated fadeInDown',
          offset: 100
         });
  });
  jQuery(document).ready(function() {
      jQuery('.post1c').addClass("hidden").viewportChecker({
          classToAdd: 'visible animated fadeInRight',
          offset: 100
         });
  });
  jQuery(document).ready(function() {
      jQuery('.post2').addClass("hidden").viewportChecker({
          classToAdd: 'visible animated fadeInUp',
          offset: 100
         });
  });
  jQuery(document).ready(function() {
      jQuery('.post4').addClass("hidden").viewportChecker({
          classToAdd: 'visible animated flipInX',
          offset: 100
         });
  });
  jQuery(document).ready(function() {
      jQuery('.post5a').addClass("hidden").viewportChecker({
          classToAdd: 'visible animated zoomInLeft',
          offset: 100
         });
  });
  jQuery(document).ready(function() {
      jQuery('.post5b').addClass("hidden").viewportChecker({
          classToAdd: 'visible animated zoomIn',
          offset: 100
         });
  });
  jQuery(document).ready(function() {
      jQuery('.post5c').addClass("hidden").viewportChecker({
          classToAdd: 'visible animated zoomInRight',
          offset: 100
         });
  });
  jQuery(document).ready(function() {
      jQuery('.post6').addClass("hidden").viewportChecker({
          classToAdd: 'visible animated rollIn',
          offset: 100
         });
  });
  jQuery(document).ready(function() {
      jQuery('.post7').addClass("hidden").viewportChecker({
          classToAdd: 'visible animated flipInY',
          offset: 100
         });
  });
  jQuery(document).ready(function() {
      jQuery('.post8').addClass("hidden").viewportChecker({
          classToAdd: 'visible animated wobble',
          offset: 100
         });
  });
  jQuery(document).ready(function() {
      jQuery('.post9').addClass("hidden").viewportChecker({
          classToAdd: 'visible animated bounce',
          offset: 100
         });
  });
  jQuery(document).ready(function() {
      jQuery('.post9a').addClass("hidden").viewportChecker({
          classToAdd: 'visible animated bounceInLeft',
          offset: 100
         });
  });
  jQuery(document).ready(function() {
      jQuery('.post9b').addClass("hidden").viewportChecker({
          classToAdd: 'visible animated bounceInRight',
          offset: 100
         });
  });
  jQuery(document).ready(function() {
      jQuery('.post9c').addClass("hidden").viewportChecker({
          classToAdd: 'visible animated shake',
          offset: 100
         });
  });
   jQuery(document).ready(function() {
      jQuery('.post10').addClass("hidden").viewportChecker({
          classToAdd: 'visible animated zoomIn',
          offset: 100
         });
  });


//progress bar-------------------


$(document).ready(function () {
  $('.design-1').css('width', '60%');
  $('.developement').css('width', '80%');
  $('.brand').css('width', '70%');
  $('.javascript').css('width', '45%');
});

//dropdown------------------------

  $(document).ready(function() {
        $('.mymenu').click(function() {
            $('.dropdown').toggleClass('visible');
        });
    });


  $(document).ready(function() {
        $('.mymenu1').click(function() {
            $('.dropdown1').toggleClass('visible1');
        });
    });


  $(document).ready(function() {
        $('.mymenu2').click(function() {
            $('.dropdown2').toggleClass('visible2');
        });
    });


  $(document).ready(function() {
        $('.mymenu3').click(function() {
            $('.dropdown3').toggleClass('visible3');
        });
    });


//parallax scrolling---------------------


$(function() {
  var h = $(window).height()
  $('.bg').height(h - (h / 4))
  $('.cover').height(h)
   $(window).resize(function() {
    var h = $(window).height()
    $('.bg').height(h - (h / 4))
    $('.cover').height(h)
  })

})
$(function() {
  var h = $(window).height()
  $('.bg1').height(h - (h / 6))
  $('.cover1').height(h)
   $(window).resize(function() {
    var h = $(window).height()
    $('.bg1').height(h - (h / 6))
    $('.cover1').height(h)
  })

})

$(function() {
  var h = $(window).height()
  $('.body-bg').height(h - (h / 2))
  $('.body-cover').height(h)
   $(window).resize(function() {
    var h = $(window).height()
    $('.body-bg').height(h - (h / 2))
    $('.body-cover').height(h)
  })

})

//google-map--------------------------------------------------------------
    
    
function initMap() {
       var locations = [
            ['<div class="infobox"><h3><a href="#">our office</a></h3><span>salt lake city - ab block</span><h4>033 7890 3456</h4></div>', 22.5867, 88.4171, 2]
            ];     
            var map = new google.maps.Map(document.getElementById('map'), {
            zoom: 12,
            scrollwheel: false,
            navigationControl: true,
            mapTypeControl: false,
            scaleControl: false,
            draggable: true,
            styles: [
    {
        "featureType": "administrative",
        "elementType": "labels.text.fill",
        "stylers": [
            {
                "color": "#444444"
            }
        ]
    },
    {
        "featureType": "landscape",
        "elementType": "all",
        "stylers": [
            {
                "color": "#ffffff"
            }
        ]
    },
    {
        "featureType": "poi",
        "elementType": "all",
        "stylers": [
            {
                "visibility": "off"
            }
        ]
    },
    {
        "featureType": "road",
        "elementType": "all",
        "stylers": [
            {
                "saturation": -100
            },
            {
                "lightness": 45
            }
        ]
    },
    {
        "featureType": "road.highway",
        "elementType": "all",
        "stylers": [
            {
                "visibility": "simplified"
            }
        ]
    },
    {
        "featureType": "road.arterial",
        "elementType": "labels.icon",
        "stylers": [
            {
                "visibility": "off"
            }
        ]
    },
    {
        "featureType": "transit",
        "elementType": "all",
        "stylers": [
            {
                "visibility": "off"
            }
        ]
    },
    {
        "featureType": "water",
        "elementType": "all",
        "stylers": [
            {
                "color": "#1a1a1a"
            },
            {
                "visibility": "on"
            }
        ]
    }
],
            center: new google.maps.LatLng(22.5867, 88.4171),
            mapTypeId: google.maps.MapTypeId.ROADMAP
            });
            var infowindow = new google.maps.InfoWindow();
            var marker, i;
            for (i = 0; i < locations.length; i++) {  
            marker = new google.maps.Marker({ 
            position: new google.maps.LatLng(locations[i][1], locations[i][2]), 
            map: map ,
            icon: './assets/img/apple-touch-icon.png'
            });
            google.maps.event.addListener(marker, 'click', (function(marker, i) {
            return function() {
            infowindow.setContent(locations[i][0]);
            infowindow.open(map, marker);
            }
            })(marker, i));
        }

}
    


//page bottom-to top------------------


   $('#pageScroll').click(function(){
    $("html, body").animate({ scrollTop: 0 }, 600);
    return false;
  });
   










