"use strict";

$(function() {
  let lastTop = $(window).scrollTop();

  $("#mob-open").click(function(e){
    $("body").addClass("body-mob-menu");
  });

  $("#mob-close").click(function(e){
    $("body").removeClass("body-mob-menu");
  });

  $(window).resize(function(e){

    if(!$(".mob-menu").is(":visible")) {
      $("body").removeClass("body-mob-menu");
      $("header.head").removeClass("head-hide");
    }
  });

  $(window).scroll(function(e){
    const currTop = $(window).scrollTop()

    // mob menu visible, top change
    if(lastTop < currTop && $(".mob-menu").is(":visible")) {
      if(currTop > $("header.head").outerHeight()) {
        $("header.head").addClass("head-hide");
        console.log("hide");
      }
    }

    else {
      $("header.head").removeClass("head-hide");
    }

    lastTop = currTop;
  });

  // change email to prevent bot
  $(".email").each(function() {
    $(this).append(`<a href="mailto:sales@leadcap.com.ph">sales@leadcap.com.ph</a>`);
  });

  // focus on first input
  $("input:eq(0)").focus();

  $("form").submit(function(e) {
    e.preventDefault();
    
    alert("thanks!");
  });

  // find a new carousel... 
  $(".vertical-center").slick({
    infinite:true,
    speed:300,
    autoplay:true,
    autoplaySpeed:5000,
    adaptiveHeight: true,
    responsive: [
      {
        breakpoint: 1000,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1
        }
      },
      {
        breakpoint: 800,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1
        }
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1
        }
      }
      // You can unslick at a given breakpoint now by adding:
      // settings: "unslick"
      // instead of a settings object
    ]
  });
});