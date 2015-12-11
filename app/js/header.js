'use strict';

angular.module('App')
  
$(document).ready(function() {
    $(document).on("click", ".home", function() {
        if ($(this).hasClass("menu-open")) {
            open();
        } else {
            close();
        }
    });    
    
    $(document).on("click", ".mobileOverlay", function() {
        close();
    });
    
    function open() {

        $(".main").animate({left: "255px"}, 500);
        $(".header-mobile").animate({left: "255px"}, 500);
        $(".mobileOverlay").animate({left: "255px", opacity: "0.8"}, 500);
        $(".mobileOverlay").css({display: "block"});
        
        $(".mobileOverlay").css({height: 588});

        $(".home").removeClass("menu-open");
    }

    function close() {    
        $(".main").animate({left: "0px", "opacity": "1"}, 500);
        $(".header-mobile").animate({left: "0px"}, 500);
        $(".mobileOverlay").animate({left: "0px", opacity: "0"}, 500);
    
        setTimeout(function(){ 
            $(".mobileOverlay").css({display: "none"}); 
        }, 500);

        $(".home").addClass("menu-open");
    }
});