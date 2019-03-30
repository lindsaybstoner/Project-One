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
        document.body.style.backgroundImage = 'url(https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1500&q=80)';
    }));

    
    // Function to reset page when homeButton is clicked
    $("#homeButton").on("click", (function (event) {
        window.location.href = window.location.href;
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
            var goToArtist = $("<a>").attr("href", response.url).attr("target", "_blank").text("SEE TOUR DATES");

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

/** ----------------------------------------------------------------------------------- */

$("#submitPress").on("click", function (event) {

    let artist = $("#artistInput").val().trim();

    let itunesArtist = artist.replace(" ", "+");
    console.log(itunesArtist);

    getArtistInfo(itunesArtist);
    getArtistBio(artist);
})

let song1 = "";
let song2 = "";
let song3 = "";

function getArtistInfo(artist) {


    $.ajax({
        url: "https://itunes.apple.com/search",
        data: { term: artist, media: "music" },
        method: "POST"
    }).then(function (response) {

        const info = JSON.parse(response);

        //var itunesArtistName = $("<h1>").text(info.results[0].artistName);

        song1 = info.results[0].trackName;
        console.log(song1);

        song2 = info.results[1].trackName;
        console.log(song2);

        song3 = info.results[2].trackName;
        console.log(song3);

        artist = info.results[0].artistName;
        console.log(artist);

        //var itunesArtistImage = $("<img>").attr("src", info.results[0].artworkUrl100);
        var itunesSongName = "";
        var itunesArtistAudio = "";
        var lyricsButton = "";
        console.log(info.results[0]);

        //$(".artist")
        //  .append(itunesArtistName);

        //artistImg(artist);


        for (var i = 0; i < 3; i++) {
            //itunesArtistImage = $("<img>").attr("src", info.results[i].artworkUrl100);
            itunesSongName = $("<p class='song-name'>").text(info.results[i].trackName);
            itunesArtistAudio = $("<audio controls>").attr("src", info.results[i].previewUrl);
            lyricsButton = $("<button>").text("Get Lyrics");

            lyricsButton
                .attr("songTitle", info.results[i].trackName)
                .attr("data-position", i)
                .addClass("lyrics");


            $(`.song${i}`)
                .append(itunesSongName)
                .append(itunesArtistAudio)
                .append(lyricsButton);



        }


        /** events(artist); */
        getLyrics(artist);

        return info;

    });

}



function getLyrics(artist) {

    $(".lyrics").on("click", function (event) {
        let song = $(this).attr("songTitle");
        let dataPosition = $(this).attr('data-position')
        console.log(song);

        $.ajax({
            url: `https://api.lyrics.ovh/v1/${artist}/${song}`,
            method: "GET"
        }).then(function (response) {
            console.log(response);

            var printLyrics = $("<p>").text(response.lyrics);

            $(".song" + dataPosition)
                .append(printLyrics);
        });
    })
}



function getArtistBio(artist) {
    var queryURL = `https://cors-anywhere.herokuapp.com/https://en.wikipedia.org/w/api.php?action=opensearch&format=json&search=${artist}`
    console.log(queryURL);
    $.ajax({
        url: queryURL,
        method: "GET"
    }).then(function (response) {
        console.log(response);
        console.log(response[1]);
        
        let peopleWithLabel = response[1];

        let hasMusicianLabel = false;

        for (var i = 0; i < peopleWithLabel.length; i++){
            if (peopleWithLabel[i].includes('(musician)')){
                $("#bio").append($("<p>").text(response[2][i]));
                hasMusicianLabel = true;
            }
        }

        if (!hasMusicianLabel) {
            $("#bio").append($("<p>").text(response[2][0]));
        }


    })
}