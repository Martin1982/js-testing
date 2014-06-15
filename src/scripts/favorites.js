$(document).ready(function() {
    $("#search-results").on("click", ".favorite-icon", function(e) {
        e.preventDefault();

        var $el = $(this).parent(),
            beerId = Number($el.data("beerid"));

        if (!beerId) {
            $("#messages").append("<p class='error'>Please select a valid beer!</p>");
            return;
        }

        $.ajax({
            url: "data/favorite/" + beerId,
            dataType: "json",
            success: function(data) {
                var img = "assets/star-empty.png";

                if (data.beer && data.beer.favorite) {
                    img = "assets/star-filled.png";
                }

                $el.find("img").attr("src", img);
            },
            error: function() {
                $("#messages")
                    .append("<p class='error'>Sorry, but that action failed!</p>");
            }
        });
    });
});