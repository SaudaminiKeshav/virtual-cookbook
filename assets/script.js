$(document).ready(function () {

    let cookbook;
    
    if(localStorage.getItem("cookbookLocalStorage") === null) {
        cookbook = [""];
        localStorage.setItem("cookbookLocalStorage", JSON.stringify(cookbook));
    } else {
        cookbook = JSON.parse(localStorage.getItem("cookbookLocalStorage"));
        //run render saved recipes function
    }
    
    // Add button id from dialog here
    // let addRecipeBtn = $("#");

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

    let ingredientArray = [];

    $("#ingredient-add").on("click", function(){
        event.preventDefault();

        let ingredient = $("#ingredient-input").val();
        console.log(ingredient);

        let li = $("<li>");
        li.text(ingredient);
        ingredientArray.push(ingredient);
        console.log(ingredientArray)
        $(".ingredient-list-search").append(li);

        $("#ingredient-input").val("");

    });

    $("#recipe-search").on("click", function(){
        event.preventDefault();

        retrieveRecipe();
    });

    function retrieveRecipe() {
        var apiKey = "6f8efb8f773b4ba3bc9fcb1c1d7d0e24";
        var ingredients = ingredientArray.join();
        var numberOfRecipes = 5;
        var recipeURL = "https://api.spoonacular.com/recipes/findByIngredients?apiKey=" + apiKey + "&ingredients=" + ingredients + "&number=" + numberOfRecipes;
        //var recipeURL = "https://api.spoonacular.com/recipes/findByIngredients?apiKey=6f8efb8f773b4ba3bc9fcb1c1d7d0e24&ingredients=apples,flour,sugar&number=2";


        $.ajax({
            url: recipeURL,
            method: "GET"
        }).then(function (response) {
            //$("#recipe-name").text(response.titel);
            console.log(response[0].title);
            console.log(response[0].id);
            console.log(response[0].image);
            console.log(response[0].missedIngredients.length);
            var ingredientsNeeded = response[0].missedIngredients.length;
            for (i = 0; i < ingredientsNeeded; i++) {
                console.log(response[0].missedIngredients[i].name);
            }

            var recipeID = response[0].id;
            var instructionsURL = "https://api.spoonacular.com/recipes/" + recipeID + "/analyzedInstructions?apiKey=" + apiKey;

            $.ajax({
                url: instructionsURL,
                method: "GET"
            }).then(function (response) {
                console.log(response[0].steps.length);
                var numberOfSteps = response[0].steps.length;
                for (var i = 0; i < numberOfSteps; i++) {
                    console.log(response[0].steps[i].step);
                    console.log(response[0].steps[i].ingredients.length);
                    var numberOfIngredients = response[0].steps[i].ingredients.length;
                    for (var j = 0; j < numberOfIngredients; j++) {
                        console.log(response[0].steps[i].ingredients[j].name);
                    }
                }

                for (let i = 0; i < searchResults; i++) {
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
    }

});