var jk = (window.jk || {});

jk.favoriteInit = function(list, trigger) {
    var $list = $(list);

    if (!$list.length) {
        throw new Error("Sorry, but there was a problem initializing the favorites functionality.");
    }

    $list.on("click", trigger, function favoriteClickHandler(e) {
        e.preventDefault();
        jk.toggleFavorite($(this));
    });
};

jk.toggleFavorite = function($el, callback) {
    var beerId;

    $el = $($el); // ensure element is a jQuery wrapped node
    callback = (callback || $.noop);

    if (!$el || !$el.length) {
        jk.notify("Unable to determine which beer to mark as favorite!");
        callback(null);
        return;
    }

    beerId = Number($el.data("beerid"));

    if (!beerId) {
        jk.notify("Please select a valid beer to mark as favorite!");
        callback(null);
        return;
    }

    $.ajax({
        url: "data/favorite/" + beerId,
        dataType: "json",
        success: function favoriteSuccessHandler(data) {
            jk.toggleFavoriteIcon($el, data.beer && data.beer.favorite);
            callback(data.beer);
        },
        error: function favoriteErrorHandler() {
            jk.notify("Sorry, but that favorite action failed!");
            callback(null);
        }
    });
};

jk.toggleFavoriteIcon = function($el, isFavorite) {
    var img = (isFavorite) ? "assets/star-filled.png" : "assets/star-empty.png";
    
    // ensure element is a jQuery wrapped node or fail silently
    $el = $($el);
    if (!$el || !$el.length || !$el.is("img")) { return false; }

    $el.attr("src", img);
    return img;
};