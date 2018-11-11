
//array of gif catagories
const catagoryArray = ['The Office', 'Breaking Bad', 'Game of thrones', 'Parks and Recreation', 'cats'];

//console for testing 
console.log(catagoryArray);


$('#doneButton').hide();
$('#gifFavs').hide();

//function that loops through the array and dynamically creates the buttons on the page
function makeNewButtons() {
    $('#buttonsArea').empty();
    for (let i = 0; i < catagoryArray.length; i++) {
        var newButton = $('<button>');
        newButton.attr('data-name', catagoryArray[i]);
        newButton.addClass('btn btn-outline-info btn-lg catagoryButton')
        newButton.text(catagoryArray[i]).val();
        $('#buttonsArea').append(newButton);

        $('.catagoryButton').on('click', function (e) {
            e.preventDefault();
            $('#myFavoriteGifs').show();
        })
    }
    //this function is called here so when new buttons are added by user, the AJAX call works for the button
    goGetGif();
}

makeNewButtons();



var checkField;

//checking the length of the value of message and assigning to a variable(checkField) on load
checkField = $("#gifInput").val().length;

var enableDisableButton = function () {
    if (checkField > 0) {
        $('#newGifValue').removeAttr("disabled");
    }
    else {
        $('#newGifValue').attr("disabled", "disabled");
    }
}

//calling enableDisableButton() function on load
enableDisableButton();

$('#gifInput').keyup(function () {
    //checking the length of the value of message and assigning to the variable(checkField) on keyup
    checkField = $("#gifInput").val().length;
    //calling enableDisableButton() function on keyup
    enableDisableButton();
});




//this takes the text from the input box and creates pushes it to the array of catagories
$('#newGifValue').on('click', function (event) {
    event.preventDefault();
    var newGif = $('#gifInput').val();
    console.log(newGif);
    catagoryArray.push(newGif);
    makeNewButtons();
    console.log(catagoryArray);

})



function goGetGif() {

    $('.catagoryButton').on('click', function () {
        var searchItem = $(this).attr('data-name');

        var queryURL = 'https://api.giphy.com/v1/gifs/search?api_key=owB39uOx2gSPHHuvzy2qH7q6UIIXAZxA&q='
            + searchItem
            + '&limit=10&offset=0&rating=G&rating=R&lang=en'

        $.ajax({
            url: queryURL,
            method: 'GET'
        }).then(function (response) {
            var returnData = response.data;
            console.log(response);

            //for loop to generate a div and img. Each image gets data from response
            for (var i = 0; i < returnData.length; i++) {
                var dropGifs = $('<div>');
                dropGifs.addClass('col-md-3');
                var showImage = $('<img>');
                showImage.addClass('mb-4');
                showImage.attr('src', returnData[i].images.fixed_height_still.url);
                showImage.attr('data-still', returnData[i].images.fixed_height_still.url);
                showImage.attr('data-animate', returnData[i].images.fixed_height.url);
                showImage.attr('data-state', 'still');
                showImage.addClass('gif');
                dropGifs.append(showImage);

                //add a rating for each gif
                var rating = $('<p>');
                rating.text('Rating: ' + returnData[i].rating.toUpperCase());
                rating.addClass('mb-0 ratingText');
                dropGifs.prepend(rating);
                $('#gifArea').prepend(dropGifs);

                //create a button but immediately hide it for each gif so they can be moved to favs            
                var favButton = $('<button>');
                favButton.hide();
                favButton.attr('type', 'button');
                favButton.attr('data-link', returnData[i].images.fixed_height.url);
                favButton.addClass('favoriteButton btn btn-primary btn-sm');
                favButton.text('Favorite');
                dropGifs.prepend(favButton);



                //shows the blue 'favorite' buttons 
                $('#myFavoriteGifs').on('click', function (e) {
                    e.preventDefault();
                    $('.favoriteButton').show();
                    $('#doneButton').show();
                })

                //hides all the blue fav buttons
                $('#doneButton').on('click', function (e) {
                    e.preventDefault();
                    $('.favoriteButton').hide();
                    $('#doneButton').hide();
                })

            }



            //click event to move/add the gif to favorites section
            $('.favoriteButton').on('click', function (e) {
                console.log(this);
                e.preventDefault();
                var favGifImg = $('<img>');
                favGifImg.addClass('gif');
                favGifImg.attr('src', $(this).attr('data-link'));
                $('#dropFavGifs').append(favGifImg);
                $(this).hide();
                $('#gifFavs').show();

            })



            //turns the gifs on and off
            $('.gif').on('click', function () {
                var state = $(this).attr('data-state');

                if (state === 'still') {
                    $(this).attr('src', $(this).attr('data-animate'));
                    $(this).attr("data-state", "animate");
                } else {
                    $(this).attr("src", $(this).attr("data-still"));
                    $(this).attr("data-state", "still");
                }

            })
        });
    });
}














