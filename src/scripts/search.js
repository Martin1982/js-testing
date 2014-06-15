$(document).ready(function() {
    $("#search-form").on("submit", function(e) {
        e.preventDefault();

        var query = $("#search-query").val();

        if (!query.length) {
            $("#messages").append("<p class='error'>Please enter a search term!</p>");
            return;
        }

        $.ajax({
            url: "data/search.json",
            data: { "query": query, limit: 7 },
            dataType: "json",
            success: function(data) {
                data.results.forEach(function(item) {
                    var img = "assets/star-empty.png";

                    if (item.favorite) {
                        img = "assets/star-filled.png";
                    }

                    $("#search-results")
                        .append(
                            "<li data-beerid='" + item.id + "'> " + item.Beer + 
                            " <img class='favorite-icon' src='" + img + "'>" + 
                            "</li>"
                        );
                });
            },
            error: function() {
                $("#messages")
                    .append("<p class='error'>Sorry, but the search failed!</p>");
            }
        });
    });
});