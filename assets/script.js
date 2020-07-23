$(document).ready(function() {
    // let addRecipeBtn = $("#add-recipe-btn");

    // $(addRecipeBtn).on("click", function () {
    //     let recipeCard = $("#recipe-card");

    //     $(recipeCard).show();
    //     // Need to take img and the recipe name to add it to the card
    //     //      use .html or .text?
    // });

    // let openRecipeBtn = $("#open-recipe-btn");

    // $(openRecipeBtn).on("click", function() {
    //     // Use this function to show the whole recipe
    // });


//Retrieve saved recipes from local storage
//Make sure to add set item in add new recipe
function retrieveRecipes () {
    //store in cookbook array?
    //store in JSON object and stringify upon opening
}


var apiKey = "";
var queryURL = `${apiKey}`;
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
  
});