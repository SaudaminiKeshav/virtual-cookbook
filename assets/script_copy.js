$(document).ready(function () {

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
        $(".results").css("opacity", 1);
    });

    $("body").on("click", ".click-title", function() {
        let titleVal = event.target.value;
        console.log(titleVal);
        if (titleVal === "1") {
            $("#recipe1").css("opacity", "1");
            $("#recipe2").css("opacity", "0");
            $("#recipe3").css("opacity", "0");
            $("#recipe4").css("opacity", "0");
            $("#recipe5").css("opacity", "0");
        } else if (titleVal === "2") {
            $("#recipe1").css("opacity", "0");
            $("#recipe2").css("opacity", "1");
            $("#recipe3").css("opacity", "0");
            $("#recipe4").css("opacity", "0");
            $("#recipe5").css("opacity", "0");
        } else if (titleVal === "3") {
            $("#recipe1").css("opacity", "0");
            $("#recipe2").css("opacity", "0");
            $("#recipe3").css("opacity", "1");
            $("#recipe4").css("opacity", "0");
            $("#recipe5").css("opacity", "0");
        } else if (titleVal === "4") {
            $("#recipe1").css("opacity", "0");
            $("#recipe2").css("opacity", "0");
            $("#recipe3").css("opacity", "0");
            $("#recipe4").css("opacity", "1");
            $("#recipe5").css("opacity", "0");
        } else if (titleVal === "5") {
            $("#recipe1").css("opacity", "0");
            $("#recipe2").css("opacity", "0");
            $("#recipe3").css("opacity", "0");
            $("#recipe4").css("opacity", "0");
            $("#recipe5").css("opacity", "1");
        }
    });

    function retrieveRecipe() {
        //var apiKey = "6f8efb8f773b4ba3bc9fcb1c1d7d0e24";
        var apiKey = "c3cbd63708ed4e5b9e24c441f3712e1d";
        var ingredients = ingredientArray.join();
        var numberOfRecipes = 5;
        var recipeURL = "https://api.spoonacular.com/recipes/findByIngredients?apiKey=" + apiKey + "&ingredients=" + ingredients + "&number=" + numberOfRecipes;
        console.log(recipeURL);


        $.ajax({
            url: recipeURL,
            method: "GET"
        }).then(function (response) {
            for (var r = 0; r < 5; r++) {
                $(`#title${r + 1}`).text(`-${response[r].title}`);
                $(`#recipe-${r + 1}`).text(response[r].title);
                console.log(response[r].title);
                $(`#recipe-image-${r + 1}`).attr("src", response[r].image);
                //console.log(response[r].image);
                //console.log(response[r].missedIngredients.length);
                var ingredientsNeeded = response[r].missedIngredients.length;
            
                for (let k = 0; k < ingredientsNeeded; k++) {
                    let li = $("<li></li>");
                    li.text(response[r].missedIngredients[k].name);
                    $(`#ingredients${r + 1}`).append(li);
                    //console.log(response[r].missedIngredients[i].name);
                }
        

                var recipeID = response[r].id;
                console.log(recipeID);
                var instructionsURL = "https://api.spoonacular.com/recipes/" + recipeID + "/analyzedInstructions?apiKey=" + apiKey;
                console.log(instructionsURL);

                $.ajax({
                    url: instructionsURL,
                    method: "GET"
                }).then(function(response) {
                    //console.log(response[r].steps.length);
                    //var numberOfSteps = response[r].steps.length;
                    if (response.length === 0) {
                        console.log("No instructions found.");
                        return;
                    } else {
                        console.log(response.length);
                        var numberOfSteps = response[0].steps.length;
                        console.log(numberOfSteps);
                        for (var i = 0; i < numberOfSteps; i++) {
                            console.log(response[0].steps[i].step);
                            var li = $("<li></li>");
                            li.text(response[0].steps[i].step);
                            $(`#recipe-contents-${i + 1}`).append(li);

                            var numberOfIngredients = response[0].steps[i].ingredients.length;
                            console.log(numberOfIngredients);
                    
                            for (var j = 0; j < numberOfIngredients; j++) {
                                console.log(response[0].steps[i].ingredients[j].name);
                                //$(".recipe-details0").text(response[0].steps[i].ingredients[j].name);
                            }
                        }

                    // for (let i = 0; i < searchResults; i++) {
                    //     let newDiv = $("<div>");
                    //     newDiv.addClass(`recipe${i} result-cards`);

                    //     let recipeTitle = $("<h3>");
                    //     //recipeTitle.text(this.name);
                    //     newDiv.append(recipeTitle);

                    //     let recipeDescription = $("<p>")
                    //     recipeDescription.addClass("recipe-details");


                    //     $(".results").append(newDiv);
                    // }

                    }
                });
            }
        });
    }
});