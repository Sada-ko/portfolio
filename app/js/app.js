// Fill-Box
$(document).ready(function () {
	(function ($, window, document) {
		$.fn.fillBox = function () {
			this.each(function () {
				var el = $(this),
				src = el.attr('src'),
				parent = el.parent();
				parent.addClass('filled');
				parent.css({
					'background-image': 'url(' + src + ')',
					'background-size': 'cover',
					'background-position': 'center'
				});
				el.hide();
			});
		};
	}(jQuery, window, document));

	$('.fill-box').fillBox();
});

// TYPOGRAF
$(document).ready(function () {
	var tp = new Typograf({locale: ['ru', 'en-US']});
	$( ".typographed" ).each(function() {
		$(this).html(tp.execute($(this).html()));
	});

// BIRMANIZER
$(document).birmanizeAnchors(true);

// DOUBLE HOVER
doubleHover('a', 'hover');

});