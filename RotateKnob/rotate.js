(function ($) {

    // Rotate button
    var minDeg = 0,
        maxDeg = 180,
        current = 0,
        moved,
        deg,
        snapped,
        target,
        middleX,
        middleY,
        startX,
        stopX,
        startY,
        stopY,
        distX,
        distY,
        dist,
        dir,
        mod = document.createElement('modernizr').style,
        prefix = testPrefix(),
        touch = ('ontouchstart' in window),
        START_EVENT = touch ? 'touchstart' : 'mousedown',
        MOVE_EVENT = touch ? 'touchmove' : 'mousemove',
        END_EVENT = touch ? 'touchend' : 'mouseup';

    function testPrefix() {
        var prefixes = ['Webkit', 'Moz', 'O', 'ms'],
            p;

        for (p in prefixes) {
            if (testProps([prefixes[p] + 'Transform'])) {
                return '-' + prefixes[p].toLowerCase();
            }
        }
        return '';
    }

    function testProps(props) {
        var i;
        for (i in props) {
            if (mod[props[i]] !== undefined) {
                return true;
            }
        }
        return false;
    }

    function getY(e) {
        return touch ? (e.originalEvent ? e.originalEvent.changedTouches[0].pageY : e.changedTouches[0].pageY) : e.pageY;
    }

    function getX(e) {
        return touch ? (e.originalEvent ? e.originalEvent.changedTouches[0].pageX : e.changedTouches[0].pageX) : e.pageX;
    }

    function move(e) {
        e.preventDefault();
        stopX = getX(e);
        stopY = getY(e);
        distX = stopX - startX;
        distY = stopY - startY;
        dir = 1;
        moved = true;
        if (Math.abs(distX) > Math.abs(distY)) {
            dist = distX;
            dir = stopY < middleY ? 1 : -1;
        }
        else {
            dist = distY;
            dir = stopX < middleX ? -1 : 1;
        }
        deg = current + dist * dir;
        deg = deg < minDeg ? minDeg : deg;
        deg = deg > maxDeg ? maxDeg : deg;

        // Snap to value
        var snap = Math.round(deg / 45) * 45,
            d = deg;

        if (Math.abs(deg - snapped) > 15) {
            snapped = null;
        }
        else {
            d = snapped;
        }

        if (Math.abs(deg - snap) < 15 && snap !== snapped) {
            deg = snap;
            snapped = deg;
            d = deg;

            var index = deg / 45,
            value = target.prev().find('.tt-ev-val').eq(index).attr('data-val'); //$('.tt-ev-val', target).eq(index).attr('data-val');
            target.closest('.tt-ev').find('input').val(value).change();
        }

        target.attr('style', prefix + '-transform:rotate(' + d + 'deg)');

        current = deg;
        startX = stopX;
        startY = stopY;
    }

    function end(e) {
        e.preventDefault();
        if (moved) {
            current = Math.round(deg / 45) * 45;
            target.attr('style', prefix + '-transform:rotate(' + current + 'deg);').data('current', current);
            // Get value
            var index = current / 45,
                value = target.prev().find('.tt-ev-val').eq(index).attr('data-val'); //$('.tt-ev-val', target).eq(index).attr('data-val');

            target.closest('.tt-ev').find('input').val(value).change();
        }

        $(document).unbind('.ttrotate');
    }

    $.fn.ttrotate = function () {

        // Set initial values
        var that = this;
        //value = $('input', that).val(),
        //index = $('.tt-ev-val[data-val="' + value + '"]', that).index()
        //d = index > -1 ? 0 - index * 45 : 0;

        //$('.tt-ev-knob', that).attr('style', prefix + '-transform:rotate(' + d + 'deg);').data('current', d);

        // Rotate to value on input change
        $('input', that).change(function () {
            $('.tt-ev-val', that).removeClass('tt-ev-sel');

            var value = $(this).val(),
	            index = $('.tt-ev-val[data-val="' + value + '"]', that).addClass('tt-ev-sel').index(),
	            d = index > -1 ? index * 45 : 0;

            $('.tt-ev-knob', that).attr('style', prefix + '-transform:rotate(' + d + 'deg);').data('current', d);
        }).change();

        // Got to value on tap
        $('.tt-ev-val div', that).bind(START_EVENT, function () {
            moved = false;
        }).bind(END_EVENT, function (e) {
            if (!moved) {
                $('input', that).val($(this).parent().attr('data-val')).change();
            }
        });

        $('.tt-ev-handle', that).bind(START_EVENT, function (e) {
            e.preventDefault();
            target = $(this).next();
            middleX = target.offset().left + target.outerWidth() / 2;
            middleY = target.offset().top + target.outerHeight() / 2;
            current = target.data('current');
            startX = getX(e);
            startY = getY(e);
            deg = current;
            snapped = current;

            $(document).bind(MOVE_EVENT + '.ttrotate', move).bind(END_EVENT + '.ttrotate', end);
        });
    }

})(jQuery);
