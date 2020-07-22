//Global Variables Here


//Retrieve saved recipes from local storage
//Make sure to add set item in add new recipe
function retrieveRecipes () {
    //store in cookbook array?
    //store in JSON object and stringify upon opening
}


var apiKey = "";
var queryURL = `${apikey}`;
let searchResults = 10;

$.ajax({
    url: queryURL,
    method: "GET"
}).then(function (response) {

    //append to div with class results
    //Can either create the html with a for loop or already have the html created 
    for(let i = 0; i < searchResults; i++) {
        let newDiv = $("<div>");
        newDiv.addClass(`recipe${i} result-cards`);

        let recipeTitle = $("<h3>");
        //recipeTitle.text(this.name);
        newDiv.append(recipeTitle);

        let recipeDescription = $("<p>")
        recipeDescription.addClass("recipe-details");


        $(".results").append(newDiv);
    }


});
