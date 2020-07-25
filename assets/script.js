$(document).ready(function () {

    let cookbook;

    if (localStorage.getItem("cookbookLocalStorage") === null) {
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

    function capitalizeFirstLetter(string) {
        let firstLetter = string.charAt(0).toUpperCase();
        string = firstLetter + string.slice(1);

        return string;
    }

    function checkDuplicate (array) {
        for(let n = 0; n < array.length; n++) {
            let index1 = array[n];

            for(let p = 0; p < array.length; p++) {
                if(n === p) {
                    //Do nothing
                } else {
                    let index2 = array[p];
                    
                    if(index1 === index2) {
                        array.splice(p, 1);
                    }
                }
            }
        }
        return array;
    }

    let ingredientArray = [];

    $("#ingredient-add").on("click", function () {
        event.preventDefault();

        if ($("#ingredient-input").val().trim() === "") {
            return;
        } else {
            let ingredient = capitalizeFirstLetter($("#ingredient-input").val());
            let li = $("<li>");
            li.addClass("ingredient-to-search");
            li.text(ingredient);
            ingredientArray.push(ingredient);
            $(".ingredient-list-search").append(li);
        }

        $("#ingredient-input").val("");
    });

    $("#recipe-search").on("click", function () {
        event.preventDefault();
        retrieveRecipe();
        $("#card-for-recipe-list").removeClass("hidden");
    });

    $("body").on("click", ".click-title", function () {
        let titleVal = event.target.value;
        if (titleVal === "1") {
            $("#recipe1").removeClass("hidden");
            $("#recipe2").addClass("hidden");
            $("#recipe3").addClass("hidden");
            $("#recipe4").addClass("hidden");
            $("#recipe5").addClass("hidden");
        } else if (titleVal === "2") {
            $("#recipe1").addClass("hidden");
            $("#recipe2").removeClass("hidden");
            $("#recipe3").addClass("hidden");
            $("#recipe4").addClass("hidden");
            $("#recipe5").addClass("hidden");
        } else if (titleVal === "3") {
            $("#recipe1").addClass("hidden");
            $("#recipe2").addClass("hidden");
            $("#recipe3").removeClass("hidden");
            $("#recipe4").addClass("hidden");
            $("#recipe5").addClass("hidden");
        } else if (titleVal === "4") {
            $("#recipe1").addClass("hidden");
            $("#recipe2").addClass("hidden");
            $("#recipe3").addClass("hidden");
            $("#recipe4").removeClass("hidden");
            $("#recipe5").addClass("hidden");
        } else if (titleVal === "5") {
            $("#recipe1").addClass("hidden");
            $("#recipe2").addClass("hidden");
            $("#recipe3").addClass("hidden");
            $("#recipe4").addClass("hidden");
            $("#recipe5").removeClass("hidden");
        }
    });

    function retrieveRecipe() {
        var apiKey = "6f8efb8f773b4ba3bc9fcb1c1d7d0e24";
        //var apiKey = "c3cbd63708ed4e5b9e24c441f3712e1d";
        var ingredients = ingredientArray.join();
        var numberOfRecipes = 5;
        var recipeURL = "https://api.spoonacular.com/recipes/findByIngredients?apiKey=" + apiKey + "&ingredients=" + ingredients + "&number=" + numberOfRecipes;


        $.ajax({
            url: recipeURL,
            method: "GET"
        }).then(function (response) {
            for (var r = 0; r < 5; r++) {
                let title = capitalizeFirstLetter(response[r].title);
                $(`#title${r + 1}`).text(`-${title}`);
                $(`#recipe-${r + 1}`).text(title);
                $(`#recipe-image-${r + 1}`).attr("src", response[r].image);
                console.log(response);

                var ingredientsNeeded = response[r].missedIngredients.length;

                for (let k = 0; k < ingredientsNeeded; k++) {
                    let li = $("<li></li>");
                    li.text(response[r].missedIngredients[k].name);
                    $(`#ingredients${r + 1}`).append(li);
                }

                var recipeID = response[r].id;
                var instructionsURL = "https://api.spoonacular.com/recipes/" + recipeID + "/analyzedInstructions?apiKey=" + apiKey;

                $.ajax({
                    url: instructionsURL,
                    method: "GET"
                }).then(function (response) {
                    if (response.length === 0) {
                        //console.log("No instructions found.");
                    } else {
                        for(let k = 0; k < response.length; k++) {
                        var numberOfSteps = response[k].steps.length;
                        for (var i = 0; i < numberOfSteps; i++) {
                            var li = $("<li></li>");
                            li.text(response[k].steps[i].step);
                            $(`#recipe-contents-${i + 1}`).append(li);

                            var numberOfIngredients = response[k].steps[i].ingredients.length;

                            for (var j = 0; j < numberOfIngredients; j++) {
                                //console.log(response);
                                if(response[k].steps[i].ingredients[j].name === null) {
                                    return;
                                } else {
                                    //console.log(response[k].steps[i].ingredients[j].name);

                                    let foundIngredients = [];
                                    foundIngredients.push(response[k].steps[i].ingredients[j].name);

                                    checkDuplicate(foundIngredients);

                                    for(let m = 0; m < foundIngredients.length; m++) {
                                        let ingLi = $("<li></li>");
                                        ingLi.text(foundIngredients[m]);
                                        $(`#ingredients${i + 1}`).append(ingLi);
                                    }
                                }
                            }
                        }
                    }

                    }
                });
            }
        });
    }
});