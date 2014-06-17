var jk = (window.jk || {});

jk.$SEARCH_RESULTS = null;

jk.searchInit = function(form, input, results) {
    var $form = $(form),
        $input = $(input);

    jk.$SEARCH_RESULTS = $(results);

    if (!$form.length || !$input.length || !jk.$SEARCH_RESULTS.length) {
        jk.$SEARCH_RESULTS = null;
        jk.notify("Sorry, but there was a problem initializing the search.");
        return;
    }

    $(form).on("submit", function submitHandler(e) {
        e.preventDefault();
        jk.doSearch($input.val());
    });
};

jk.doSearch = function(query, callback) {
    callback = (callback || $.noop);

    if (!query || !query.length) {
        jk.notify("Please enter a search query!");
        callback(null);
        return;
    }

    $.ajax({
        url: "data/search.json",
        data: { "query": query, limit: 7 },
        dataType: "json",
        success: function searchSuccessHandler(data) {
            jk.handleSearchResults(data.results);
            callback(data.results);
        },
        error: function searchErrorHandler() {
            jk.notify("Sorry, but the search failed!");
            callback(null);
        }
    });
};

jk.handleSearchResults = function(results) {
    if (!results || !results.length) {
        jk.notify("There were no results!");
        return;
    }

    if (!jk.$SEARCH_RESULTS) {
        jk.notify("There was a problem displaying the results!");
        return;
    }

    results.forEach(function searchResultLoop(item) {
        var img = "assets/star-empty.png";

        if (item.favorite) {
            img = "assets/star-filled.png";
        }

        jk.$SEARCH_RESULTS
            .append(
                "<li> " + item.Beer + 
                " <img class='favorite-icon' src='" + img + "' data-beerid='" + item.id + "'>" + 
                "</li>"
            );
    });
};