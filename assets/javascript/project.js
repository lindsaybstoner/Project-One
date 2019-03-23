$(document).ready(function () {
    var topics = ["Drake", "Kanye West", "Beyonce", "Cardi B","Coldplay"];

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
            // Calling the renderButtons function to display the initial list of movies
    createButton();
})