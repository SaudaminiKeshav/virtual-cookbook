$(document).ready(function () {

    let cookbook;

    if (localStorage.getItem("cookbookLocalStorage") === null) {
        cookbook = [""];
        localStorage.setItem("cookbookLocalStorage", JSON.stringify(cookbook));
    } else {
        cookbook = JSON.parse(localStorage.getItem("cookbookLocalStorage"));
        //run render saved recipes function
    }

    // Damini's dialog code
    (function () {
        'use strict';
        var dialogButton = document.querySelector('.dialog-button');
        var dialog = document.querySelector('#dialog');
        if (! dialog.showModal) {
          dialogPolyfill.registerDialog(dialog);
        }
        dialogButton.addEventListener('click', function dialogClick() {
           dialog.showModal();
        });
        dialog.querySelector('button:not([disabled])')
        .addEventListener('click', function() {
          dialog.close();
        });
      }());

    // Add recipe code
    // To do list:
    // - add img upload option in dialog box
    // - connect img upload to card
    // - prepend new card
    // - save inputs from dialog onto card
    // - create card to hold/ show inputs
    // - save cards in cookbook to local storage
    $("#save-btn").on("click", function() {
        let recipeCard = $("#recipe-card");
        let dialogTitleVal = $("#input-title").val().trim();
        let dialogIngredientsVal = $("#input-ingredients").val().trim();
        let dialogInstructionsVal = $("#input-instructions").val().trim();
        //let dialogImgVal = ;

        if (dialogTitleVal === "") {
            alert("Please enter a title to your recipe.");
            dialogClick();
        } else if (dialogIngredientsVal === "") {
            alert("Please enter the ingredients to your recipe.");
            dialogClick();
        } else if (dialogInstructionsVal === "") {
            alert("Please enter the instructions to your recipe.");
            dialogClick();
        } else {
            $("#card-title").text(dialogTitleVal);
            recipeCard.show();
        }
    });

    $("#cancel-btn").on("click", function() {
        // *if cancel btn is clicked, go back to home page
    })

    let openRecipeBtn = $("#open-recipe-btn");

    openRecipeBtn.on("click", function() {
        // *if open recipe btn is clicked, show the whole recipe for that given card
    });

    let ingredientArray = [];

    $("#ingredient-add").on("click", function () {
        event.preventDefault();

        if ($("#ingredient-input").val().trim() === "") {
            return;
        } else {
            let ingredient = $("#ingredient-input").val();
            let li = $("<li>");
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
        //var apiKey = "6f8efb8f773b4ba3bc9fcb1c1d7d0e24";
        var apiKey = "c3cbd63708ed4e5b9e24c441f3712e1d";
        var ingredients = ingredientArray.join();
        var numberOfRecipes = 5;
        var recipeURL = "https://api.spoonacular.com/recipes/findByIngredients?apiKey=" + apiKey + "&ingredients=" + ingredients + "&number=" + numberOfRecipes;


        $.ajax({
            url: recipeURL,
            method: "GET"
        }).then(function (response) {
            for (var r = 0; r < 5; r++) {
                $(`#title${r + 1}`).text(`-${response[r].title}`);
                $(`#recipe-${r + 1}`).text(response[r].title);
                $(`#recipe-image-${r + 1}`).attr("src", response[r].image);

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
                        console.log("No instructions found.");
                    } else {
                        var numberOfSteps = response[0].steps.length;
                        for (var i = 0; i < numberOfSteps; i++) {
                            var li = $("<li></li>");
                            li.text(response[0].steps[i].step);
                            $(`#recipe-contents-${i + 1}`).append(li);

                            var numberOfIngredients = response[0].steps[i].ingredients.length;

                            for (var j = 0; j < numberOfIngredients; j++) {
                                console.log(response[0].steps[i].ingredients[j].name);
                                //$(".recipe-details0").text(response[0].steps[i].ingredients[j].name);
                            }
                        }

                    }
                });
            }
        });
    }
});