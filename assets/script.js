
let recipesCopy = [];

$(document).ready(function () {

    let cookbook;

    if (localStorage.getItem("cookbookLocalStorage") === null) {
        cookbook = [""];
        localStorage.setItem("cookbookLocalStorage", JSON.stringify(cookbook));
    } else {
        cookbook = JSON.parse(localStorage.getItem("cookbookLocalStorage"));
        //run render saved recipes function
    }

    // Add recipe code
    // To do list:
    // - add img upload option in dialog box        //DONE
    // - connect img upload to card
    // - prepend new card                           //DONE
    // - save inputs from dialog onto card
    // - save inputs from dialog onto Local storage
    // - create card to hold/ show inputs
    // - save cards in cookbook to local storage


    // Creates the recipe dialog and also the click event listener for "ADD RECIPE" Button
    createRecipeDialog();

    // Gets the user input on clicking "SAVE", create "RECIPE CARDS", and saves the data to local storage 
    addSaveButtonClickListener();

    // Contains code logic to get an image from system/device 
    dialogAddImageButtonClickListener();

    // Displays saved recipe 
    OpenRecipeButtonClickListener();


    function capitalizeFirstLetter(string) {
        let firstLetter = string.charAt(0).toUpperCase();
        string = firstLetter + string.slice(1);

        return string;
    }

    function checkDuplicate(array) {
        for (let n = 0; n < array.length; n++) {
            let index1 = array[n];

            for (let p = 0; p < array.length; p++) {
                if (n === p) {
                    //Do nothing
                } else {
                    let index2 = array[p];

                    if (index1 === index2) {
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
                        for (let k = 0; k < response.length; k++) {
                            var numberOfSteps = response[k].steps.length;
                            for (var i = 0; i < numberOfSteps; i++) {
                                var li = $("<li></li>");
                                li.text(response[k].steps[i].step);
                                $(`#recipe-contents-${i + 1}`).append(li);

                                var numberOfIngredients = response[k].steps[i].ingredients.length;

                                for (var j = 0; j < numberOfIngredients; j++) {
                                    //console.log(response);
                                    if (response[k].steps[i].ingredients[j].name === null) {
                                        return;
                                    } else {
                                        //console.log(response[k].steps[i].ingredients[j].name);

                                        let foundIngredients = [];
                                        foundIngredients.push(response[k].steps[i].ingredients[j].name);

                                        checkDuplicate(foundIngredients);

                                        for (let m = 0; m < foundIngredients.length; m++) {
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


function createRecipeDialog() {

    // Create and display Recipe Dialog
    (function () {
        'use strict';

        //Get the addRecipeButton
        var addRecipeButton = document.querySelector('.dialog-button');

        // Get the modal dialog create in the HTML 
        var dialog = document.querySelector('#dialog');

        // Register dialog 
        if (!dialog.showModal) {
            dialogPolyfill.registerDialog(dialog);
        }

        // Click event listener for addRecipe button 
        addRecipeButton.addEventListener('click', function dialogClick() {
            // On click display dialog 
            dialog.showModal();
        });

        // Add event  listener to Cancel button
        dialog.querySelector('button:not([disabled])')
            .addEventListener('click', function () {
                dialog.close();
            });
    }());
}

function addSaveButtonClickListener() {

    // Add click listener 
    $("#save-btn").on("click", function () {

        // Get values from input fields 
        let dialogTitleVal = $("#input-title").val().trim();
        let dialogIngredientsVal = $("#input-ingredients").val().trim();
        let dialogInstructionsVal = $("#input-instructions").val().trim();

        // Save a copy of the user input into Local storage 
        saveUserInputToLocalStorage(dialogTitleVal, dialogIngredientsVal, dialogInstructionsVal);

        // create and display recipe card using the user input 
        createAndDisplayRecipeOnCard(dialogTitleVal, dialogIngredientsVal, dialogInstructionsVal);
    });
}

function saveUserInputToLocalStorage(title, ingredients, instructions) {
    var Recipes = [];
    event.preventDefault();
    // Check if the "Recipe" array already exists in the Local storage 
    if (localStorage.getItem('Recipes') === null) {

        // Push the new recipe on our local copy 
        recipesCopy.push({
            key: title,
            ingredients: ingredients,
            instructions: instructions
        })

        // Create a new Recipes array using our local copr - recipesCopy
        localStorage.setItem('Recipes', JSON.stringify(recipesCopy));

    } else {
        // Else fetch the existing array from local storage 
        Recipes = JSON.parse(localStorage.getItem('Recipes'));

        // Check if Recipe array on local storage is empty 
        if ((Recipes.length == 0 && recipesCopy.length == 0)) {

            // Push the new recipe on our local copy 
            recipesCopy.push({
                key: title,
                ingredients: ingredients,
                instructions: instructions
            })

            // Update "Recipe" in local storage 
            localStorage.setItem('Recipes', JSON.stringify(recipesCopy));
        }
    }

}

function createAndDisplayRecipeOnCard(title, ingredients, instruction) {

    // Check if neither of the fields are empty 
    if (title != "" && ingredients != "" && instruction != "") {
        event.preventDefault();

        // Dismiss the dialog
        var dialog = document.querySelector('#dialog');
        dialog.close();

        // Start building the card div 
        var cardDiv = $("<div>");
        cardDiv.attr("id", "recipe-card");
        cardDiv.attr("class", "demo-card-square mdl-card mdl-shadow--2dp");

        // Recipe image div 
        var imgDiv = $("<div>");
        imgDiv.attr("class", "mdl-card__title mdl-card--expand");

        cardDiv.append(imgDiv);

        // Recipe title div 
        var titleDiv = $("<div>");
        titleDiv.attr("id", "recipe-title");
        titleDiv.attr("class", "mdl-card__supporting-text");

        var titleH2 = $("<h2>");
        titleH2.attr("id", "card-title");
        titleH2.attr("class", "mdl-card__title-text");
        titleH2.text(title);

        titleDiv.append(titleH2);
        cardDiv.append(titleDiv);

        // Open Recipe button div 
        var buttonDiv = $("<div>");
        buttonDiv.attr("class", "mdl-card__actions mdl-card--border");

        var buttonATag = $("<a>");
        buttonATag.attr("id", "open-recipe-btn");
        buttonATag.attr("class", "mdl-button mdl-button--colored mdl-js-button mdl-js-ripple-effect");
        buttonATag.text("Open Recipe");

        buttonDiv.append(buttonATag);
        cardDiv.append(buttonDiv);

        $(".container-index").prepend(cardDiv);
    }
}

function dialogAddImageButtonClickListener() {

    // Add click change event listener 
    $("#add-image-input").on("change", function (event) {
        event.preventDefault();
        $(this).closest('.modal').one('hidden.bs.modal', function () {
            // Fire if the button element 
            console.log('The button that closed the modal is: ', $button);
        });

        // Get image from system 
        getImage(this);
    });
}

function getImage(input) {
    var reader;

    if (input.files && input.files[0]) {
        event.preventDefault();

        // Create file reader 
        reader = new FileReader();

        // event listener for file reader 
        reader.onload = function (e) {
            $("#preview").setAttribute('src', e.target.result);
        }
        reader.readAsDataURL(input.files[0]);
    }
}

function OpenRecipeButtonClickListener() {
    let openRecipeBtn = $("#open-recipe-btn");

    openRecipeBtn.on("click", function () {
        // *if open recipe btn is clicked, show the whole recipe for that given card
    });
}