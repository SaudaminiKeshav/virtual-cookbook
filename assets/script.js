
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
        if (ingredientArray.length === 0) {
            return;
        } else {
            event.preventDefault();
            
            //var apiKey = "6f8efb8f773b4ba3bc9fcb1c1d7d0e24";
            //var apiKey = "c3cbd63708ed4e5b9e24c441f3712e1d";
            //var apiKey = "b97317ef164f48c1b2fb4223ec2365bf";
            //var apiKey = "2c9a3a3c72c5460eb5b28bd2ae462f90";
            var apiKey = "c1bea9a53ed6441b8bd560922ed37af5";

            var ingredients = ingredientArray.join();
            var numberOfRecipes = 5;
            var recipeURL = "https://api.spoonacular.com/recipes/findByIngredients?apiKey=" + apiKey + "&ingredients=" + ingredients + "&number=" + numberOfRecipes;
            $.ajax({
                url: recipeURL,
                method: "GET"
            }).then(function (response) {
                for (var r = 0; r < 5; r++) {
                    let title = capitalizeFirstLetter(response[r].title);
                    $(`#title${r + 1}`).text(`- ${title}`);
                }
            });
            $("#card-for-recipe-list").removeClass("hidden");
        }
    });

    function createRecipeCardfromSearch(foundTitle, imageSource) {
        //foundImage input takes in a string for src attribute
    
        console.log("createRecipeCardFromSearch ran");
    
         var cardDiv = $("<div>");
         cardDiv.attr("id", "recipe-card");
         cardDiv.attr("class", "demo-card-square mdl-card mdl-shadow--2dp");
    
         // Recipe image div 
         var imgDiv = $("<div>");
         imgDiv.attr("class", "mdl-card__title mdl-card--expand");
         cardDiv.append(imgDiv);
         var imgTag = $("<img>");
         imgTag.attr("src", imageSource);
         imgDiv.append(imgTag);
    
         // Recipe title div 
         var titleDiv = $("<div>");
         titleDiv.attr("id", "recipe-title");
         titleDiv.attr("class", "mdl-card__supporting-text");
    
         var titleH2 = $("<h2>");
         titleH2.attr("id", "card-title");
         titleH2.attr("class", "mdl-card__title-text");
         titleH2.text(foundTitle);
    
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

    recipesTitles = [];

    $("#save-recipe-button").on("click", function() {
        let searchedTitle = $("#recipe-1").text();
        let imgSrc = $("#recipe-image-1").attr("src");
        console.log(imgSrc);

        //Ingredients save as one continuous string
        let listOfIngredients = $(".ingredient-list").text();
        let stepInstructions = $(".instructions").text();

        recipesTitles.push(searchedTitle);
        localStorage.setItem(`recipe1`, JSON.stringify(recipesTitles));

        createRecipeCardfromSearch(searchedTitle, imgSrc);

        //Save a copy of the recipe into Local storage 
        saveUserInputToLocalStorage(searchedTitle, listOfIngredients, stepInstructions);

        });


    $("body").on("click", ".click-title", function () {
        let titleVal = event.target.value;
        if (titleVal === "1") {
            $("#recipe1").removeClass("hidden");
            
            //var apiKey = "6f8efb8f773b4ba3bc9fcb1c1d7d0e24";
            //var apiKey = "c3cbd63708ed4e5b9e24c441f3712e1d";
            //var apiKey = "b97317ef164f48c1b2fb4223ec2365bf";
            //var apiKey = "2c9a3a3c72c5460eb5b28bd2ae462f90";
            var apiKey = "c1bea9a53ed6441b8bd560922ed37af5";
    
            var ingredients = ingredientArray.join();
            var numberOfRecipes = 5;
            var recipeURL = "https://api.spoonacular.com/recipes/findByIngredients?apiKey=" + apiKey + "&ingredients=" + ingredients + "&number=" + numberOfRecipes;
            $.ajax({
                url: recipeURL,
                method: "GET"
            }).then(function (response) {
            
                let title = capitalizeFirstLetter(response[0].title);
            
                $(`#recipe-1`).text(title);
                $(`#recipe-image-1`).attr("src", response[0].image);
                var ingredientsNeeded = response[0].missedIngredients.length;
                let foundIngredients = [];
                $("#ingredients1").empty();
                for (let k = 0; k < ingredientsNeeded; k++) {
                    foundIngredients.push(response[0].missedIngredients[k].name);
                    //console.log(foundIngredients);
                    let li = $("<li></li>");
                    li.text(response[0].missedIngredients[k].name);
                    li.text(capitalizeFirstLetter(li.text()));

                    $(`#ingredients1`).append(li);
                }

                var recipeID = response[0].id;
                //console.log("title and its ID", recipeID + title);
                var instructionsURL = "https://api.spoonacular.com/recipes/" + recipeID + "/analyzedInstructions?apiKey=" + apiKey;
                //console.log(instructionsURL);

                $.ajax({
                    url: instructionsURL,
                    method: "GET"
                }).then(function (response) {

                    if (response.length === 0) {
                        var li = $("<li></li>");
                        $(`#recipe-contents-1`).empty();
                        li.text("No instructions found");
                        $(`#recipe-contents-1`).append(li);
                    } else {
                        $(`#recipe-contents-1`).empty();
                        for(let k = 0; k < response.length; k++) {
                            var numberOfSteps = response[k].steps;

                            for (var i = 0; i < numberOfSteps.length; i++) {
                                var li = $("<li></li>");
                                li.text(response[k].steps[i].step);
                                $(`#recipe-contents-1`).append(li);

                                var numberOfIngredients = response[k].steps[i].ingredients.length;

                                for (var j = 0; j < numberOfIngredients; j++) {
                                    if(response[k].steps[i].ingredients[j].length === 0) {
                                        //console.log("no ingredients for this step");
                                    } else {
                                        //console.log(response[k].steps[i].ingredients[j].name);
                                        if (foundIngredients.includes(response[k].steps[i].ingredients[j].name)) {
                                            //console.log("not pushed");
                                        } else {
                                            foundIngredients.push(response[k].steps[i].ingredients[j].name);
                                            //console.log("after push", foundIngredients);
                                            let ingLi = $("<li></li>");
                                            ingLi.text(response[k].steps[i].ingredients[j].name);
                                            ingLi.text(capitalizeFirstLetter(ingLi.text()));

                                            $(`#ingredients1`).append(ingLi);
                                        }
                                    }
                                }
                            }
                        }
                    }
                });
            });
            
        } else if (titleVal === "2") {
            $("#recipe1").removeClass("hidden");

            //var apiKey = "6f8efb8f773b4ba3bc9fcb1c1d7d0e24";
            //var apiKey = "c3cbd63708ed4e5b9e24c441f3712e1d";
            //var apiKey = "b97317ef164f48c1b2fb4223ec2365bf";
            //var apiKey = "2c9a3a3c72c5460eb5b28bd2ae462f90";
            var apiKey = "c1bea9a53ed6441b8bd560922ed37af5";
    
            var ingredients = ingredientArray.join();
            var numberOfRecipes = 5;
            var recipeURL = "https://api.spoonacular.com/recipes/findByIngredients?apiKey=" + apiKey + "&ingredients=" + ingredients + "&number=" + numberOfRecipes;
            $.ajax({
                url: recipeURL,
                method: "GET"
            }).then(function (response) {
            
                let title = capitalizeFirstLetter(response[1].title);
            
                $(`#recipe-1`).text(title);
                $(`#recipe-image-1`).attr("src", response[1].image);
                var ingredientsNeeded = response[1].missedIngredients.length;
                let foundIngredients = [];
                $("#ingredients1").empty();
                for (let k = 0; k < ingredientsNeeded; k++) {
                    foundIngredients.push(response[1].missedIngredients[k].name);
                    //console.log(foundIngredients);
                    let li = $("<li></li>");
                    li.text(response[1].missedIngredients[k].name);
                    li.text(capitalizeFirstLetter(li.text()));
                    $(`#ingredients1`).append(li);
                }

                var recipeID = response[1].id;
                //console.log("title and its ID", recipeID + title);
                var instructionsURL = "https://api.spoonacular.com/recipes/" + recipeID + "/analyzedInstructions?apiKey=" + apiKey;
                //console.log(instructionsURL);

                $.ajax({
                    url: instructionsURL,
                    method: "GET"
                }).then(function (response) {

                    if (response.length === 0) {
                        var li = $("<li></li>");
                        $(`#recipe-contents-1`).empty();
                        li.text("No instructions found");
                        $(`#recipe-contents-1`).append(li);
                    } else {
                        $(`#recipe-contents-1`).empty();
                        for(let k = 0; k < response.length; k++) {
                            var numberOfSteps = response[k].steps;

                            for (var i = 0; i < numberOfSteps.length; i++) {
                                var li = $("<li></li>");
                                li.text(response[k].steps[i].step);
                                $(`#recipe-contents-1`).append(li);

                                var numberOfIngredients = response[k].steps[i].ingredients.length;

                                for (var j = 0; j < numberOfIngredients; j++) {
                                    if(response[k].steps[i].ingredients[j].length === 0) {
                                        //console.log("no ingredients for this step");
                                    } else {
                                        //console.log(response[k].steps[i].ingredients[j].name);
                                        if (foundIngredients.includes(response[k].steps[i].ingredients[j].name)) {
                                            //console.log("not pushed");
                                        } else {
                                            foundIngredients.push(response[k].steps[i].ingredients[j].name);
                                            //console.log("after push", foundIngredients);
                                            let ingLi = $("<li></li>");
                                            ingLi.text(response[k].steps[i].ingredients[j].name);
                                            ingLi.text(capitalizeFirstLetter(ingLi.text()));
                                            $(`#ingredients1`).append(ingLi);
                                        }
                                    }
                                }
                            }
                        }
                    } 
                }); 
            });

        } else if (titleVal === "3") {
            $("#recipe1").removeClass("hidden");

            //var apiKey = "6f8efb8f773b4ba3bc9fcb1c1d7d0e24";
            //var apiKey = "c3cbd63708ed4e5b9e24c441f3712e1d";
            //var apiKey = "b97317ef164f48c1b2fb4223ec2365bf";
            //var apiKey = "2c9a3a3c72c5460eb5b28bd2ae462f90";
            var apiKey = "c1bea9a53ed6441b8bd560922ed37af5";
    
            var ingredients = ingredientArray.join();
            var numberOfRecipes = 5;
            var recipeURL = "https://api.spoonacular.com/recipes/findByIngredients?apiKey=" + apiKey + "&ingredients=" + ingredients + "&number=" + numberOfRecipes;
            $.ajax({
                url: recipeURL,
                method: "GET"
            }).then(function (response) {
            
                let title = capitalizeFirstLetter(response[2].title);
            
                $(`#recipe-1`).text(title);
                $(`#recipe-image-1`).attr("src", response[2].image);
                var ingredientsNeeded = response[2].missedIngredients.length;
                let foundIngredients = [];
                $("#ingredients1").empty();
                for (let k = 0; k < ingredientsNeeded; k++) {
                    foundIngredients.push(response[2].missedIngredients[k].name);
                    //console.log(foundIngredients);
                    let li = $("<li></li>");
                    li.text(response[2].missedIngredients[k].name);
                    li.text(capitalizeFirstLetter(li.text()));
                    $(`#ingredients1`).append(li);
                }

                var recipeID = response[2].id;
                //console.log("title and its ID", recipeID + title);
                var instructionsURL = "https://api.spoonacular.com/recipes/" + recipeID + "/analyzedInstructions?apiKey=" + apiKey;
                //console.log(instructionsURL);

                $.ajax({
                    url: instructionsURL,
                    method: "GET"
                }).then(function (response) {

                    if (response.length === 0) {
                        var li = $("<li></li>");
                        $(`#recipe-contents-1`).empty();
                        li.text("No instructions found");
                        $(`#recipe-contents-1`).append(li);
                    } else {
                        $(`#recipe-contents-1`).empty();
                        for(let k = 0; k < response.length; k++) {
                            var numberOfSteps = response[k].steps;

                            for (var i = 0; i < numberOfSteps.length; i++) {
                                var li = $("<li></li>");
                                li.text(response[k].steps[i].step);
                                $(`#recipe-contents-1`).append(li);

                                var numberOfIngredients = response[k].steps[i].ingredients.length;

                                for (var j = 0; j < numberOfIngredients; j++) {
                                    if(response[k].steps[i].ingredients[j].length === 0) {
                                       //console.log("no ingredients for this step");
                                    } else {
                                        //console.log(response[k].steps[i].ingredients[j].name);
                                        if (foundIngredients.includes(response[k].steps[i].ingredients[j].name)) {
                                            //console.log("not pushed");
                                        } else {
                                            foundIngredients.push(response[k].steps[i].ingredients[j].name);
                                            //console.log("after push", foundIngredients);
                                            let ingLi = $("<li></li>");
                                            ingLi.text(response[k].steps[i].ingredients[j].name);
                                            ingLi.text(capitalizeFirstLetter(ingLi.text()));
                                            $(`#ingredients1`).append(ingLi);
                                        }
                                    }
                                }
                            }
                        }
                    } 
                });
            });

        } else if (titleVal === "4") {
            $("#recipe1").removeClass("hidden");

            //var apiKey = "6f8efb8f773b4ba3bc9fcb1c1d7d0e24";
            //var apiKey = "c3cbd63708ed4e5b9e24c441f3712e1d";
            //var apiKey = "b97317ef164f48c1b2fb4223ec2365bf";
            //var apiKey = "2c9a3a3c72c5460eb5b28bd2ae462f90";
            var apiKey = "c1bea9a53ed6441b8bd560922ed37af5";
    
            var ingredients = ingredientArray.join();
            var numberOfRecipes = 5;
            var recipeURL = "https://api.spoonacular.com/recipes/findByIngredients?apiKey=" + apiKey + "&ingredients=" + ingredients + "&number=" + numberOfRecipes;
            $.ajax({
                url: recipeURL,
                method: "GET"
            }).then(function (response) {
            
                let title = capitalizeFirstLetter(response[3].title);
            
                $(`#recipe-1`).text(title);
                $(`#recipe-image-1`).attr("src", response[3].image);
                var ingredientsNeeded = response[3].missedIngredients.length;
                let foundIngredients = [];
                $("#ingredients1").empty();
                for (let k = 0; k < ingredientsNeeded; k++) {
                    foundIngredients.push(response[3].missedIngredients[k].name);
                    //console.log(foundIngredients);
                    let li = $("<li></li>");
                    li.text(response[3].missedIngredients[k].name);
                    li.text(capitalizeFirstLetter(li.text()));
                    $(`#ingredients1`).append(li);
                }

                var recipeID = response[3].id;
                //console.log("title and its ID", recipeID + title);
                var instructionsURL = "https://api.spoonacular.com/recipes/" + recipeID + "/analyzedInstructions?apiKey=" + apiKey;
                //console.log(instructionsURL);

                $.ajax({
                    url: instructionsURL,
                    method: "GET"
                }).then(function (response) {
                    if (response.length === 0) {
                        var li = $("<li></li>");
                        $(`#recipe-contents-1`).empty();
                        li.text("No instructions found");
                        $(`#recipe-contents-1`).append(li);
                    } else {
                        $(`#recipe-contents-1`).empty();
                        for(let k = 0; k < response.length; k++) {
                            var numberOfSteps = response[k].steps;

                            for (var i = 0; i < numberOfSteps.length; i++) {
                                var li = $("<li></li>");
                                li.text(response[k].steps[i].step);
                                $(`#recipe-contents-1`).append(li);

                                var numberOfIngredients = response[k].steps[i].ingredients.length;

                                for (var j = 0; j < numberOfIngredients; j++) {
                                    if(response[k].steps[i].ingredients[j].length === 0) {
                                       // console.log("no ingredients for this step");
                                    } else {
                                        console.log(response[k].steps[i].ingredients[j].name);
                                        if (foundIngredients.includes(response[k].steps[i].ingredients[j].name)) {
                                            //console.log("not pushed");
                                        } else {
                                            foundIngredients.push(response[k].steps[i].ingredients[j].name);
                                            //console.log("after push", foundIngredients);
                                            let ingLi = $("<li></li>");
                                            ingLi.text(response[k].steps[i].ingredients[j].name);
                                            ingLi.text(capitalizeFirstLetter(ingLi.text()));
                                            $(`#ingredients1`).append(ingLi);
                                        }
                                    }
                                }
                            }
                        }
                    }
                });
            });

        } else if (titleVal === "5") {
            $("#recipe1").removeClass("hidden");

            //var apiKey = "6f8efb8f773b4ba3bc9fcb1c1d7d0e24";
            //var apiKey = "c3cbd63708ed4e5b9e24c441f3712e1d";
            //var apiKey = "b97317ef164f48c1b2fb4223ec2365bf";
            //var apiKey = "2c9a3a3c72c5460eb5b28bd2ae462f90";
            var apiKey = "c1bea9a53ed6441b8bd560922ed37af5";
    
            var ingredients = ingredientArray.join();
            var numberOfRecipes = 5;
            var recipeURL = "https://api.spoonacular.com/recipes/findByIngredients?apiKey=" + apiKey + "&ingredients=" + ingredients + "&number=" + numberOfRecipes;
            $.ajax({
                url: recipeURL,
                method: "GET"
            }).then(function (response) {
            
                let title = capitalizeFirstLetter(response[4].title);
            
                $(`#recipe-1`).text(title);
                $(`#recipe-image-1`).attr("src", response[4].image);
                var ingredientsNeeded = response[4].missedIngredients.length;
                let foundIngredients = [];
                $("#ingredients1").empty();
                for (let k = 0; k < ingredientsNeeded; k++) {
                    foundIngredients.push(response[4].missedIngredients[k].name);
                    //console.log(foundIngredients);
                    let li = $("<li></li>");
                    li.text(response[4].missedIngredients[k].name);
                    li.text(capitalizeFirstLetter(li.text()));
                    $(`#ingredients1`).append(li);
                }

                var recipeID = response[4].id;
                //console.log("title and its ID", recipeID + title);
                var instructionsURL = "https://api.spoonacular.com/recipes/" + recipeID + "/analyzedInstructions?apiKey=" + apiKey;
                //console.log(instructionsURL);

                $.ajax({
                    url: instructionsURL,
                    method: "GET"
                }).then(function (response) {
                    if (response.length === 0) {
                        var li = $("<li></li>");
                        $(`#recipe-contents-1`).empty();
                        li.text("No instructions found");
                        $(`#recipe-contents-1`).append(li);
                    } else {
                        $(`#recipe-contents-1`).empty();
                        for(let k = 0; k < response.length; k++) {
                            var numberOfSteps = response[k].steps;

                            for (var i = 0; i < numberOfSteps.length; i++) {
                                var li = $("<li></li>");
                                li.text(response[k].steps[i].step);
                                $(`#recipe-contents-1`).append(li);

                                var numberOfIngredients = response[k].steps[i].ingredients.length;

                                for (var j = 0; j < numberOfIngredients; j++) {
                                    if(response[k].steps[i].ingredients[j].length === 0) {
                                        //console.log("no ingredients for this step");
                                    } else {
                                        //console.log(response[k].steps[i].ingredients[j].name);
                                        if (foundIngredients.includes(response[k].steps[i].ingredients[j].name)) {
                                            //console.log("not pushed");
                                        } else {
                                            foundIngredients.push(response[k].steps[i].ingredients[j].name);
                                            //console.log("after push", foundIngredients);
                                            let ingLi = $("<li></li>");
                                            ingLi.text(response[k].steps[i].ingredients[j].name);
                                            ingLi.text(capitalizeFirstLetter(ingLi.text()));
                                            $(`#ingredients1`).append(ingLi);
                                        }
                                    }
                                }
                            }
                        }
                    }
                });
            });
        }
    });
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
    });
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
    // Create an array to save a copy of local storage array 
    var Recipes = [];

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

        // If the array existing and is not empty, push an object onto the array 
        else if ((Recipes.length != 0 && recipesCopy.length != 0))

            // Check the recipe with the same titlte already exists 
            for (var i = 0; i < recipesCopy.length; i++) {
                if (recipesCopy[i].key == title) {

                    // Delete the old recipe with the same title
                    recipesCopy.splice(i, 1);
                }
            }

        // Add the newly created recipe with that title
        recipesCopy.push({
            key: title,
            ingredients: ingredients,
            instructions: instructions
        })

        // Update "Recipe" in local storage 
        localStorage.setItem('Recipes', JSON.stringify(recipesCopy));

        console.log(recipesCopy);
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
            // changed from "setAttribute"
            $("#preview").attr('src', e.target.result);
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