$(document).ready(function () {
    
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


    function artistInformation(artist) {

        var queryURL = "https://rest.bandsintown.com/artists/" + artist + "?app_id=codingbootcamp";
        $.ajax({
            url: queryURL,
            method: "GET"
        }).then(function (response) {
            console.log(response);

            var artistName = $("<h1>").text(response.name);
            var artistImage = $("<img>").attr("src", response.thumb_url);
            var upcomingEvents = response.upcoming_event_count + " UPCOMING EVENTS";
            var goToArtist = $("<a>").attr("href", response.url).attr("target", "_blank").text("SEE TOUR DATES");

            $("#artist-name").empty();
            $("#artist-name").append(artistName);

            $("#artist-image").empty();
            $("#artist-image").append(artistImage);

            $("#artist-event").empty();
            $("#artist-event").append(upcomingEvents);
        });
    }

    function events(artist) {
        var queryURL = "https://rest.bandsintown.com/artists/" + artist + "/events?app_id=codingbootcamp";
        $.ajax({
            url: queryURL,
            method: "GET"
        }).then(function (response) {
            console.log(response);


            for (var i = 0; i < 5; i++) {
                let venue = response[i].venue.name;
                let date = response[i].datetime;
                let location = `${response[i].venue.city}, ${response[i].venue.country}`;

                $("#artist-tour").append(`
                    <tr>
                        <td>${date}</td>
                        <td>${venue}</td>
                        <td>${location}</td>
                    </tr>
                `)
            }
        });
    }

    $("#submitPress").on("click", function (event) {
        event.preventDefault();
        var inputArtist = $("#artistInput").val().trim();

        // Event handler for user input
        artistInformation(inputArtist);
        events(inputArtist);

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
        event.preventDefault();
        
        let song = $(this).attr("songTitle");
        let dataPosition = $(this).attr('data-position');
        
        if (!$(this).attr('data-gotLyrics')) {
            $(this).attr('data-gotLyrics', 'true');
            $(this).attr('data-isShown', 'true');

            $.ajax({
                url: `https://api.lyrics.ovh/v1/${artist}/${song}`,
                method: "GET"
            }).then(function (response) {
                console.log(response);
    
                var printLyrics = $("<p>").text(response.lyrics);
                printLyrics.addClass("lyricsPrinted")
    
                $(".song" + dataPosition)
                    .append(printLyrics);
    
      
            });

            $(this).text("Hide Lyrics");
        }

        
        else {
            if ($(this).attr('data-isShown') === "true"){
                $(".song" + $(this).attr('data-position')).find(".lyricsPrinted").hide();
                $(this).attr('data-isShown', 'false');
                $(this).text("Get Lyrics");

            }
            else {
                $(".song" + $(this).attr('data-position')).find(".lyricsPrinted").show();
                $(this).attr('data-isShown', 'true');
                $(this).text("Hide Lyrics");
            }
           
        }        

       

        console.log(song);

        

        //hideLyrics();
    })
}

function hideLyrics() {
    $(".lyrics").on("click", function (event) {
        $(".lyricsPrinted").empty("");

    });
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

        for (var i = 0; i < peopleWithLabel.length; i++) {
            if (peopleWithLabel[i].includes('(musician)')) {
                $("#bio").append($("<p>").text(response[2][i]));
                hasMusicianLabel = true;
            }
        }

        if (!hasMusicianLabel) {
            $("#bio").append($("<p>").text(response[2][0]));
        }


    })
}
//============ FIREBASE ADDITION ==================
var config = {
    apiKey: "AIzaSyANMdggKPR4QP1HDE5_T5jgQDVCCsAZVbc",
    authDomain: "youtunes-58915.firebaseapp.com",
    databaseURL: "https://youtunes-58915.firebaseio.com",
    projectId: "youtunes-58915",
    storageBucket: "youtunes-58915.appspot.com",
    messagingSenderId: "365049549562"
};
firebase.initializeApp(config);
var database = firebase.database();
var rankRef = database.ref("/rankings");
var name = "";

$('#submitPress').on('click', function (event) {
    event.preventDefault();

    name = $('#artistInput').val().trim();
    var artistName = name;
    rankRef.once("value", function (snapshot) {
        console.log(snapshot.val())

        var foundArtist = false;
        snapshot.forEach(function (item) {
            console.log(item.val());

            if (artistName === item.val().artist) {
                console.log("You searched the same artist!");
                foundArtist = true;
                database.ref('/rankings/' + item.val().id).set({
                    artist: item.val().artist,
                    popularity: item.val().popularity + 1,
                    id: item.val().id
                })
            }
        });
        if (!foundArtist) {
            var id = rankRef.push().key
            database.ref('/rankings/' + id).set({
                artist: artistName,
                popularity: 1,
                id: id
            });
        }
    })
});

        