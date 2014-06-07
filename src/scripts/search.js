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
            data: { "query": query },
            dataType: "json",
            success: function(data) {
                data.results.forEach(function(item) {
                    $("#search-results")
                        .append("<li> " + item + " </li>");
                });
            },
            error: function() {
                $("#messages")
                    .append("<p class='error'>Sorry, but the search failed!</p>");
            }
        });
    });
});