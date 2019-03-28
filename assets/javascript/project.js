$(document).ready(function () {
    var topics = ["Drake", "Kanye West", "Beyonce", "Cardi B", "Coldplay"];

    //function stores input to data-search and create a button
    // $("#buttons-view").on("click",function(){
    function createButton() {
        //delete prior gifs to add over gif buttons
        $("#buttons-view").empty();
        //creates new button, creates gif-button class, and add into array
        for (var i = 0; i < topics.length; i++) {
            var a = $("<button>");
            a.addClass("gif-button");
            a.attr("data-name", topics[i]);
            a.text(topics[i]);
            $("#buttons-view").append(a);
        }
        console.log(topics);
    }

    // This function handles events where the add movie button is clicked
    $("#submitPress").on("click", function (event) {
        event.preventDefault();
        var newArtist = $("#artistInput").val().trim();
        topics.push(newArtist);
        createButton();
    });

    var $container = $(".container");
    var $newContainer = $(".newContainer");
    $("#submitPress").on("click", (function (event) {
        $container.hide()
        $('.home').contents().wrapAll('<div id="new-container">');
        $newContainer.show()
        document.body.style.backgroundImage = 'url(https://w-dog.net/wallpapers/15/13/472487200286587.jpg)';
    }));

    // Calling the renderButtons function to display the initial list of movies
    createButton();

    function searchBandsInTown(artist) {

        // Querying the bandsintown api for the selected artist, the ?app_id parameter is required, but can equal anything
        var queryURL = "https://rest.bandsintown.com/artists/" + artist + "?app_id=codingbootcamp";
        $.ajax({
            url: queryURL,
            method: "GET"
        }).then(function (response) {

            // Printing the entire object to console
            console.log(response);

            // Constructing HTML containing the artist information
            var artistName = $("<h1>").text(response.name);
            // var artistURL = $("<a>").attr("href", response.url).append(artistName);
            var artistImage = $("<img>").attr("src", response.thumb_url);
            var upcomingEvents = $("<h2>").text(response.upcoming_event_count + " UPCOMING EVENTS");
            var goToArtist = $("<a>").attr("href", response.url).text("SEE TOUR DATES");

            // Empty the contents of all the div's, append the new artist content
            $("#artist-name").empty();
            $("#artist-name").append(artistName);

            $("#artist-image").empty();
            $("#artist-image").append(artistImage);

            $("#artist-event").empty();
            $("#artist-event").append(upcomingEvents);

            $("#artist-tour").empty();
            $("#artist-tour").append(goToArtist);
        });
    }

    // Event handler for user clicking the select-artist button
    $("#submitPress").on("click", function (event) {
        // Preventing the button from trying to submit the form
        event.preventDefault();
        // Storing the artist name
        var inputArtist = $("#artistInput").val().trim();

        // Running the searchBandsInTown function(passing in the artist as an argument)
        searchBandsInTown(inputArtist);
    });
})