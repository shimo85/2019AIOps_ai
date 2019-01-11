function sideBar() {
    var bkSideBar = $(".bk-sidebar"); //侧栏展开折叠
    $(".slide-switch").on("click", function() {
        bkSideBar.toggleClass("slide-close slide-open");
        if (bkSideBar.hasClass("slide-close")) {
            $(".flex-subnavs").hide();
            $(".slider-footer").hide();
            
            $(".nav-right-congent-control").css({
                'margin-left':60
            });
        }else{
            $(".slider-footer").show();
            $(".nav-right-congent-control").css({
                'margin-left':258
            });
        }
    });

    bkSideBar.on("click", "li>a", function() { //单级菜单
        if ($(this).parents(".bk-sidebar").hasClass("slide-close")) return;
        var _this = $(this).parent();
        var _thisParent = _this.siblings();
        if (_this.hasClass("pure-link")) {
            _this.addClass("open").siblings().removeClass("open");
        } else {
            _this.toggleClass("open").siblings().removeClass("open");
            _this.find(".flex-subnavs").slideToggle();
        }

        _thisParent.find(".flex-subnavs").slideUp();

    });

    bkSideBar.on("click", ".flex-subnavs a", function() { //多级菜单
        $(".flex-subnavs a").removeClass("on");
        $(this).addClass("on");
        if ($(this).parents(".bk-sidebar").hasClass("slide-close")) {
            $(this).parents("li").addClass("open").siblings().removeClass("open")
        }
    });

    //监听分辨率
    $(window).on('resize', function() {
        var width = $(window).width();
        if (width > 1366) {
            bkSideBar.removeClass("slide-close").addClass("slide-open");
             $(".slider-footer").show();
              $('.nav-right-congent-control').css({
                'margin-left':258
             })
        } else {
            bkSideBar.removeClass("slide-open").addClass("slide-close");
            $(".slider-footer").hide();
           
            $('.nav-right-congent-control').css({
                'margin-left':60
             })

        }
    });

    $(window).trigger('resize');

    $('.sort-selct-content').find('.sumoselect-sort-hover').hover(function(){
        $(this).find('.CaptionCont').css({
            'border-color': '#8f8797',
            'box-shadow': 'none'
        })
    },function(){
         $(this).find('.CaptionCont').css({
            'border-color': '#ebebeb',
            'box-shadow': 'none'
        })
    })  

    $('.SlectBox').on('sumo:opened', function(sumo) {   //控制下来选框的样式
        $(this).closest('.sort-selct-content').find('.CaptionCont label i').css({
            '-moz-transform': 'rotate(180deg)',
            '-webkit-transform': 'rotate(180deg)',
            ' -o-transform': 'rotate(180deg)',
            'transform': 'rotate(180deg)'
        });
        $(this).closest('.sort-selct-content').find('.CaptionCont').css({
            'border-color': '#8f8797'
        });
    });

    $('.SlectBox').on('sumo:closed', function(sumo) {    //控制下来选框的样式
        $(this).closest('.sort-selct-content').find('.CaptionCont label i').css({
            '-moz-transform': 'rotate(0deg)',
            '-webkit-transform': 'rotate(0deg)',
            ' -o-transform': 'rotate(0deg)',
            'transform': 'rotate(0deg)'
        });
        $(this).closest('.sort-selct-content').find('.CaptionCont').css({
            'border-color': '#ebebeb'
        });
    }); 
};
sideBar();

