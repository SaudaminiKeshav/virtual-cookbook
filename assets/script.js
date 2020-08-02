let recipesCopy = [];

$(document).ready(function () {
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
            //let apiKey = "6f8efb8f773b4ba3bc9fcb1c1d7d0e24";
            //let apiKey = "c3cbd63708ed4e5b9e24c441f3712e1d";
            //let apiKey = "b97317ef164f48c1b2fb4223ec2365bf";
            let apiKey = "2c9a3a3c72c5460eb5b28bd2ae462f90";
            //let apiKey = "c1bea9a53ed6441b8bd560922ed37af5";
            let ingredients = ingredientArray.join();
            let numberOfRecipes = 5;
            let recipeURL = "https://api.spoonacular.com/recipes/findByIngredients?apiKey=" + apiKey + "&ingredients=" + ingredients + "&number=" + numberOfRecipes;
            
            $.ajax({
                url: recipeURL,
                method: "GET"
            }).then(function (response) {
                for (let r = 0; r < 5; r++) {
                    let title = capitalizeFirstLetter(response[r].title);
                    $(`#title${r + 1}`).text(`- ${title}`);
                }
            });
            $("#card-for-recipe-list").removeClass("hidden");
        }
    });
    
    function createRecipeCardfromSearch(foundTitle, imageSource) {
        //foundImage input takes in a string for src attribute
        let cardDiv = $("<div>");
        cardDiv.attr("id", "recipe-card");
        cardDiv.attr("class", "demo-card-square mdl-card mdl-shadow--2dp");

        // Recipe image div 
        let imgDiv = $("<div>");
        imgDiv.attr("class", "mdl-card__title mdl-card--expand");
        cardDiv.append(imgDiv);

        let imgTag = $("<img>");
        imgTag.attr("src", imageSource);
        imgDiv.append(imgTag);

        // Recipe title div 
        let titleDiv = $("<div>");
        titleDiv.attr("id", "recipe-title");
        titleDiv.attr("class", "mdl-card__supporting-text");

        let titleH2 = $("<h2>");
        titleH2.attr("id", "card-title");
        titleH2.attr("class", "mdl-card__title-text");
        titleH2.text(foundTitle);
        titleDiv.append(titleH2);
        cardDiv.append(titleDiv);

        // Open Recipe button div 
        let buttonDiv = $("<div>");
        buttonDiv.attr("class", "mdl-card__actions mdl-card--border");

        let buttonATag = $("<a>");
        buttonATag.attr("id", "open-recipe-btn");
        buttonATag.attr("class", "mdl-button mdl-button--colored mdl-js-button mdl-js-ripple-effect");
        buttonATag.text("Open Recipe");
        buttonDiv.append(buttonATag);
        cardDiv.append(buttonDiv);

        $(".container-index").prepend(cardDiv);
    }

    recipesTitles = [];

    $("#save-recipe-button").on("click", function () {
        $("#save-recipe-button").addClass("hidden");
        $(".saved-to-recipes").removeClass("hidden");
        let searchedTitle = $("#recipe-1").text();
        let imgSrc = $("#recipe-image-1").attr("src");

        //Ingredients save as one continuous string
        let listOfIngredients = $("#ingredients1").text();
        let stepInstructions = $("#recipe-contents-1").text();
        // recipesTitles.push(searchedTitle);
        // localStorage.setItem(`recipe1`, JSON.stringify(recipesTitles));
        // let ingredients = [];
        // $("#ingredients1").each(function(){
        //     ingredients.push(this.innerHTML);
        // })
        // localStorage.setItem(`${searchedTitle}-ingredients`, JSON.stringify(ingredients));
        createRecipeCardfromSearch(searchedTitle, imgSrc);

        //Save a copy of the recipe into Local storage 
        saveSearchDataToLocalStorage(searchedTitle, listOfIngredients, stepInstructions, imgSrc);
    });

    $("body").on("click", ".click-title", function () {
        let titleVal = event.target.value;
        $(".saved-to-recipes").addClass("hidden");
        $("#save-recipe-button").removeClass("hidden");

        if (titleVal === "1") {
            $("#recipe1").removeClass("hidden");
            $(".saved-to-recipes").addClass("hidden");
            $("#save-recipe-button").removeClass("hidden");
            //let apiKey = "6f8efb8f773b4ba3bc9fcb1c1d7d0e24";
            //let apiKey = "c3cbd63708ed4e5b9e24c441f3712e1d";
            //let apiKey = "b97317ef164f48c1b2fb4223ec2365bf";
            let apiKey = "2c9a3a3c72c5460eb5b28bd2ae462f90";
            //let apiKey = "c1bea9a53ed6441b8bd560922ed37af5";
            let ingredients = ingredientArray.join();
            let numberOfRecipes = 5;
            let recipeURL = "https://api.spoonacular.com/recipes/findByIngredients?apiKey=" + apiKey + "&ingredients=" + ingredients + "&number=" + numberOfRecipes;
            
            $.ajax({
                url: recipeURL,
                method: "GET"
            }).then(function (response) {
                let title = capitalizeFirstLetter(response[0].title);
                $(`#recipe-1`).text(title);
                $(`#recipe-image-1`).attr("src", response[0].image);

                let ingredientsNeeded = response[0].missedIngredients.length;
                let foundIngredients = [];

                $("#ingredients1").empty();
                for (let k = 0; k < ingredientsNeeded; k++) {
                    foundIngredients.push(response[0].missedIngredients[k].name);
                    //console.log(foundIngredients);
                    let li = $("<li></li>");

                    li.addClass("search-li-tags");
                    li.text(response[0].missedIngredients[k].name);
                    li.text(capitalizeFirstLetter(li.text()));
                    $(`#ingredients1`).append(li);
                }

                let recipeID = response[0].id;
                //console.log("title and its ID", recipeID + title);
                let instructionsURL = "https://api.spoonacular.com/recipes/" + recipeID + "/analyzedInstructions?apiKey=" + apiKey;
                //console.log(instructionsURL);
                
                $.ajax({
                    url: instructionsURL,
                    method: "GET"
                }).then(function (response) {
                    if (response.length === 0) {
                        let li = $("<li></li>");

                        li.addClass("search-li-tags");
                        $(`#recipe-contents-1`).empty();
                        li.text("No instructions found");
                        $(`#recipe-contents-1`).append(li);
                    } else {
                        $(`#recipe-contents-1`).empty();
                        for (let k = 0; k < response.length; k++) {
                            let numberOfSteps = response[k].steps;

                            for (let i = 0; i < numberOfSteps.length; i++) {
                                let li = $("<li></li>");

                                li.addClass("search-li-tags");
                                li.text(response[k].steps[i].step);
                                $(`#recipe-contents-1`).append(li);

                                let numberOfIngredients = response[k].steps[i].ingredients.length;

                                for (let j = 0; j < numberOfIngredients; j++) {
                                    if (response[k].steps[i].ingredients[j].length === 0) {
                                        //console.log("no ingredients for this step");
                                    } else {
                                        //console.log(response[k].steps[i].ingredients[j].name);
                                        if (foundIngredients.includes(response[k].steps[i].ingredients[j].name)) {
                                            //console.log("not pushed");
                                        } else {
                                            foundIngredients.push(response[k].steps[i].ingredients[j].name);
                                            //console.log("after push", foundIngredients);
                                            let ingLi = $("<li></li>");

                                            ingLi.addClass("search-li-tags");
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
            $(".saved-to-recipes").addClass("hidden");
            $("#save-recipe-button").removeClass("hidden");
            //let apiKey = "6f8efb8f773b4ba3bc9fcb1c1d7d0e24";
            //let apiKey = "c3cbd63708ed4e5b9e24c441f3712e1d";
            //let apiKey = "b97317ef164f48c1b2fb4223ec2365bf";
            let apiKey = "2c9a3a3c72c5460eb5b28bd2ae462f90";
            //let apiKey = "c1bea9a53ed6441b8bd560922ed37af5";
            let ingredients = ingredientArray.join();
            let numberOfRecipes = 5;
            let recipeURL = "https://api.spoonacular.com/recipes/findByIngredients?apiKey=" + apiKey + "&ingredients=" + ingredients + "&number=" + numberOfRecipes;
            
            $.ajax({
                url: recipeURL,
                method: "GET"
            }).then(function (response) {
                let title = capitalizeFirstLetter(response[1].title);

                $(`#recipe-1`).text(title);
                $(`#recipe-image-1`).attr("src", response[1].image);

                let ingredientsNeeded = response[1].missedIngredients.length;
                let foundIngredients = [];

                $("#ingredients1").empty();

                for (let k = 0; k < ingredientsNeeded; k++) {
                    foundIngredients.push(response[1].missedIngredients[k].name);
                    //console.log(foundIngredients);
                    let li = $("<li></li>");
                    li.addClass("search-li-tags");
                    li.text(response[1].missedIngredients[k].name);
                    li.text(capitalizeFirstLetter(li.text()));
                    $(`#ingredients1`).append(li);
                }

                let recipeID = response[1].id;
                //console.log("title and its ID", recipeID + title);
                let instructionsURL = "https://api.spoonacular.com/recipes/" + recipeID + "/analyzedInstructions?apiKey=" + apiKey;
                //console.log(instructionsURL);
                
                $.ajax({
                    url: instructionsURL,
                    method: "GET"
                }).then(function (response) {
                    if (response.length === 0) {
                        let li = $("<li></li>");

                        li.addClass("search-li-tags");
                        $(`#recipe-contents-1`).empty();
                        li.text("No instructions found");
                        $(`#recipe-contents-1`).append(li);
                    } else {
                        $(`#recipe-contents-1`).empty();

                        for (let k = 0; k < response.length; k++) {
                            let numberOfSteps = response[k].steps;

                            for (let i = 0; i < numberOfSteps.length; i++) {
                                let li = $("<li></li>");
                                li.addClass("search-li-tags");
                                li.text(response[k].steps[i].step);
                                $(`#recipe-contents-1`).append(li);
                                let numberOfIngredients = response[k].steps[i].ingredients.length;
                                
                                for (let j = 0; j < numberOfIngredients; j++) {
                                    if (response[k].steps[i].ingredients[j].length === 0) {
                                        //console.log("no ingredients for this step");
                                    } else {
                                        //console.log(response[k].steps[i].ingredients[j].name);
                                        if (foundIngredients.includes(response[k].steps[i].ingredients[j].name)) {
                                            //console.log("not pushed");
                                        } else {
                                            foundIngredients.push(response[k].steps[i].ingredients[j].name);
                                            //console.log("after push", foundIngredients);
                                            let ingLi = $("<li></li>");

                                            ingLi.addClass("search-li-tags");
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
            $(".saved-to-recipes").addClass("hidden");
            $("#save-recipe-button").removeClass("hidden");
            //let apiKey = "6f8efb8f773b4ba3bc9fcb1c1d7d0e24";
            //let apiKey = "c3cbd63708ed4e5b9e24c441f3712e1d";
            //let apiKey = "b97317ef164f48c1b2fb4223ec2365bf";
            let apiKey = "2c9a3a3c72c5460eb5b28bd2ae462f90";
            //let apiKey = "c1bea9a53ed6441b8bd560922ed37af5";
            let ingredients = ingredientArray.join();
            let numberOfRecipes = 5;
            let recipeURL = "https://api.spoonacular.com/recipes/findByIngredients?apiKey=" + apiKey + "&ingredients=" + ingredients + "&number=" + numberOfRecipes;
            
            $.ajax({
                url: recipeURL,
                method: "GET"
            }).then(function (response) {
                let title = capitalizeFirstLetter(response[2].title);

                $(`#recipe-1`).text(title);
                $(`#recipe-image-1`).attr("src", response[2].image);

                let ingredientsNeeded = response[2].missedIngredients.length;
                let foundIngredients = [];

                $("#ingredients1").empty();
                for (let k = 0; k < ingredientsNeeded; k++) {
                    foundIngredients.push(response[2].missedIngredients[k].name);
                    //console.log(foundIngredients);
                    let li = $("<li></li>");
                    li.addClass("search-li-tags");
                    li.text(response[2].missedIngredients[k].name);
                    li.text(capitalizeFirstLetter(li.text()));
                    $(`#ingredients1`).append(li);
                }
                let recipeID = response[2].id;
                //console.log("title and its ID", recipeID + title);
                let instructionsURL = "https://api.spoonacular.com/recipes/" + recipeID + "/analyzedInstructions?apiKey=" + apiKey;
                //console.log(instructionsURL);
                
                $.ajax({
                    url: instructionsURL,
                    method: "GET"
                }).then(function (response) {
                    if (response.length === 0) {
                        let li = $("<li></li>");

                        li.addClass("search-li-tags");
                        $(`#recipe-contents-1`).empty();
                        li.text("No instructions found");
                        $(`#recipe-contents-1`).append(li);
                    } else {
                        $(`#recipe-contents-1`).empty();
                        
                        for (let k = 0; k < response.length; k++) {
                            let numberOfSteps = response[k].steps;
                            
                            for (let i = 0; i < numberOfSteps.length; i++) {
                                let li = $("<li></li>");
                                li.addClass("search-li-tags");
                                li.text(response[k].steps[i].step);
                                $(`#recipe-contents-1`).append(li);
                                let numberOfIngredients = response[k].steps[i].ingredients.length;
                                
                                for (let j = 0; j < numberOfIngredients; j++) {
                                    if (response[k].steps[i].ingredients[j].length === 0) {
                                        //console.log("no ingredients for this step");
                                    } else {
                                        //console.log(response[k].steps[i].ingredients[j].name);
                                        if (foundIngredients.includes(response[k].steps[i].ingredients[j].name)) {
                                            //console.log("not pushed");
                                        } else {
                                            foundIngredients.push(response[k].steps[i].ingredients[j].name);
                                            //console.log("after push", foundIngredients);
                                            let ingLi = $("<li></li>");

                                            ingLi.addClass("search-li-tags");
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
            $(".saved-to-recipes").addClass("hidden");
            $("#save-recipe-button").removeClass("hidden");
            //let apiKey = "6f8efb8f773b4ba3bc9fcb1c1d7d0e24";
            //let apiKey = "c3cbd63708ed4e5b9e24c441f3712e1d";
            //let apiKey = "b97317ef164f48c1b2fb4223ec2365bf";
            let apiKey = "2c9a3a3c72c5460eb5b28bd2ae462f90";
            //let apiKey = "c1bea9a53ed6441b8bd560922ed37af5";
            let ingredients = ingredientArray.join();
            let numberOfRecipes = 5;
            let recipeURL = "https://api.spoonacular.com/recipes/findByIngredients?apiKey=" + apiKey + "&ingredients=" + ingredients + "&number=" + numberOfRecipes;
            
            $.ajax({
                url: recipeURL,
                method: "GET"
            }).then(function (response) {
                let title = capitalizeFirstLetter(response[3].title);

                $(`#recipe-1`).text(title);
                $(`#recipe-image-1`).attr("src", response[3].image);

                let ingredientsNeeded = response[3].missedIngredients.length;
                let foundIngredients = [];

                $("#ingredients1").empty();

                for (let k = 0; k < ingredientsNeeded; k++) {
                    foundIngredients.push(response[3].missedIngredients[k].name);
                    //console.log(foundIngredients);
                    let li = $("<li></li>");
                    li.addClass("search-li-tags");
                    li.text(response[3].missedIngredients[k].name);
                    li.text(capitalizeFirstLetter(li.text()));
                    $(`#ingredients1`).append(li);
                }
                let recipeID = response[3].id;
                //console.log("title and its ID", recipeID + title);
                let instructionsURL = "https://api.spoonacular.com/recipes/" + recipeID + "/analyzedInstructions?apiKey=" + apiKey;
                //console.log(instructionsURL);
                
                $.ajax({
                    url: instructionsURL,
                    method: "GET"
                }).then(function (response) {
                    if (response.length === 0) {
                        let li = $("<li></li>");

                        li.addClass("search-li-tags");
                        $(`#recipe-contents-1`).empty();

                        li.text("No instructions found");
                        $(`#recipe-contents-1`).append(li);
                    } else {
                        $(`#recipe-contents-1`).empty();
                        
                        for (let k = 0; k < response.length; k++) {
                            let numberOfSteps = response[k].steps;
                            
                            for (let i = 0; i < numberOfSteps.length; i++) {
                                let li = $("<li></li>");
                                li.addClass("search-li-tags");
                                li.text(response[k].steps[i].step);
                                $(`#recipe-contents-1`).append(li);
                                let numberOfIngredients = response[k].steps[i].ingredients.length;
                                
                                for (let j = 0; j < numberOfIngredients; j++) {
                                    if (response[k].steps[i].ingredients[j].length === 0) {
                                        // console.log("no ingredients for this step");
                                    } else {
                                        console.log(response[k].steps[i].ingredients[j].name);
                                        if (foundIngredients.includes(response[k].steps[i].ingredients[j].name)) {
                                            //console.log("not pushed");
                                        } else {
                                            foundIngredients.push(response[k].steps[i].ingredients[j].name);
                                            //console.log("after push", foundIngredients);
                                            let ingLi = $("<li></li>");

                                            ingLi.addClass("search-li-tags");
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
            $(".saved-to-recipes").addClass("hidden");
            $("#save-recipe-button").removeClass("hidden");
            //let apiKey = "6f8efb8f773b4ba3bc9fcb1c1d7d0e24";
            //let apiKey = "c3cbd63708ed4e5b9e24c441f3712e1d";
            //let apiKey = "b97317ef164f48c1b2fb4223ec2365bf";
            let apiKey = "2c9a3a3c72c5460eb5b28bd2ae462f90";
            //let apiKey = "c1bea9a53ed6441b8bd560922ed37af5";
            let ingredients = ingredientArray.join();
            let numberOfRecipes = 5;
            let recipeURL = "https://api.spoonacular.com/recipes/findByIngredients?apiKey=" + apiKey + "&ingredients=" + ingredients + "&number=" + numberOfRecipes;
            
            $.ajax({
                url: recipeURL,
                method: "GET"
            }).then(function (response) {
                let title = capitalizeFirstLetter(response[4].title);

                $(`#recipe-1`).text(title);
                $(`#recipe-image-1`).attr("src", response[4].image);

                let ingredientsNeeded = response[4].missedIngredients.length;
                let foundIngredients = [];

                $("#ingredients1").empty();

                for (let k = 0; k < ingredientsNeeded; k++) {
                    foundIngredients.push(response[4].missedIngredients[k].name);
                    //console.log(foundIngredients);
                    let li = $("<li></li>");
                    li.addClass("search-li-tags");
                    li.text(response[4].missedIngredients[k].name);
                    li.text(capitalizeFirstLetter(li.text()));
                    $(`#ingredients1`).append(li);
                }
                let recipeID = response[4].id;
                //console.log("title and its ID", recipeID + title);
                let instructionsURL = "https://api.spoonacular.com/recipes/" + recipeID + "/analyzedInstructions?apiKey=" + apiKey;
                //console.log(instructionsURL);
                $.ajax({
                    url: instructionsURL,
                    method: "GET"
                }).then(function (response) {
                    if (response.length === 0) {
                        let li = $("<li></li>");

                        li.addClass("search-li-tags");
                        $(`#recipe-contents-1`).empty();

                        li.text("No instructions found");
                        $(`#recipe-contents-1`).append(li);
                    } else {
                        $(`#recipe-contents-1`).empty();
                        
                        for (let k = 0; k < response.length; k++) {
                            let numberOfSteps = response[k].steps;
                            
                            for (let i = 0; i < numberOfSteps.length; i++) {
                                let li = $("<li></li>");
                                li.addClass("search-li-tags");
                                li.text(response[k].steps[i].step);
                                $(`#recipe-contents-1`).append(li);

                                let numberOfIngredients = response[k].steps[i].ingredients.length;
                                
                                for (let j = 0; j < numberOfIngredients; j++) {
                                    if (response[k].steps[i].ingredients[j].length === 0) {
                                        //console.log("no ingredients for this step");
                                    } else {
                                        //console.log(response[k].steps[i].ingredients[j].name);
                                        if (foundIngredients.includes(response[k].steps[i].ingredients[j].name)) {
                                            //console.log("not pushed");
                                        } else {
                                            foundIngredients.push(response[k].steps[i].ingredients[j].name);
                                            //console.log("after push", foundIngredients);
                                            let ingLi = $("<li></li>");

                                            ingLi.addClass("search-li-tags");
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

function homePageSpecificFunctions() {
    // Creates the recipe dialog and also the click event listener for "ADD RECIPE" Button
    createRecipeDialog();

    // Gets the user input on clicking "SAVE", create "RECIPE CARDS", and saves the data to local storage 
    addSaveButtonClickListener();

    // Contains code logic to get an image from system/device 
    dialogAddImageButtonClickListener();

    // Loads recipes onto card from storage 
    loadRecipesFromLocalStorageOnRefresh();

    //openRecipe();
}

function loadRecipesFromLocalStorageOnRefresh() {
    let recipes;
    let searchedRecipes;
    if (localStorage.getItem('Recipes') != null) {
        recipes = JSON.parse(localStorage.getItem('Recipes'));
        for (let i = 0; i < recipes.length; i++) {
            let localTitle = recipes[i].key;
            let localIngredients = recipes[i].ingredients;
            let localInstructions = recipes[i].instructions;
            let localImage = recipes[i].image;
            createAndDisplayRecipeOnCard(localTitle, localIngredients, localInstructions, localImage);
            // createRecipeCardfromSearch(localTitle,localIngredients,localInstructions,localImage);
            //console.log(cookbook);
        }
    }
    if (localStorage.getItem('SearchedRecipes') != null) {
        searchedRecipes = JSON.parse(localStorage.getItem('SearchedRecipes'));
        for (let i = 0; i < searchedRecipes.length; i++) {
            let localTitle = searchedRecipes[i].key;
            let localIngredients = searchedRecipes[i].ingredients;
            let localInstructions = searchedRecipes[i].instructions;
            let localImage = searchedRecipes[i].image;
            createAndDisplayRecipeOnCard(localTitle, localIngredients, localInstructions, localImage);
            // createRecipeCardfromSearch(localTitle,localIngredients,localInstructions,localImage);
            //console.log(cookbook);
        }
    }
}

function createRecipeDialog() {
    // Create and display Recipe Dialog
    (function () {
        'use strict';
        //Get the addRecipeButton
        let addRecipeButton = document.querySelector('.dialog-button');

        // Get the modal dialog create in the HTML 
        let dialog = document.querySelector('#dialog');

        // Register dialog 
        if (!dialog.showModal) {
            dialogPolyfill.registerDialog(dialog);
        }

        // Click event listener for addRecipe button 
        addRecipeButton.addEventListener('click', function dialogClick() {
            // On click display dialog 
            // this.setState({ showModal: true })
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
        event.preventDefault();

        // Get values from input fields 
        let dialogTitleVal = $("#input-title").val().trim();
        let dialogIngredientsVal = $("#input-ingredients").val().trim();
        let dialogInstructionsVal = $("#input-instructions").val().trim();
        let dialogImgVal = $("#preview").attr("src");

        // Save a copy of the user input into Local storage 
        saveHomeDataToLocalStorage(dialogTitleVal, dialogIngredientsVal, dialogInstructionsVal, dialogImgVal);
        
        // create and display recipe card using the user input 
        createAndDisplayRecipeOnCard(dialogTitleVal, dialogIngredientsVal, dialogInstructionsVal, dialogImgVal);
    });
}

function saveHomeDataToLocalStorage(title, ingredients, instructions, recipeImage) {
    // Create an array to save a copy of local storage array 
    let Recipes;

    // Check if the "Recipe" array already exists in the Local storage 
    if (localStorage.getItem('Recipes') === null) {
        console.log("storage is null");
        // Push the new recipe on our local copy 
        recipesCopy.push({
            key: title,
            ingredients: ingredients,
            instructions: instructions,
            image: recipeImage
        });

        // Create a new Recipes array using our local copr - recipesCopy
        localStorage.setItem('Recipes', JSON.stringify(recipesCopy));
    } else {
        console.log("second condition");
        // Else fetch the existing array from local storage 
        Recipes = JSON.parse(localStorage.getItem('Recipes'));
        console.log(Recipes);

        recipesCopy.push({
            key: title,
            ingredients: ingredients,
            instructions: instructions,
            image: recipeImage
        })

        // Update "Recipe" in local storage 
        localStorage.setItem('Recipes', JSON.stringify(recipesCopy));

        // Check if Recipe array on local storage is empty 
        if ((Recipes.length == 0 && recipesCopy.length == 0)) {
            // Push the new recipe on our local copy 
            console.log("this condition was true");
            recipesCopy.push({
                key: title,
                ingredients: ingredients,
                instructions: instructions,
                image: recipeImage
            });

            // Update "Recipe" in local storage 
            localStorage.setItem('Recipes', JSON.stringify(Recipes));
        }

        // If the array existing and is not empty, push an object onto the array 
        else if ((Recipes.length != 0 && recipesCopy.length != 0)) {
            console.log("third condition");
            Recipes.push({
                key: title,
                ingredients: ingredients,
                instructions: instructions,
                image: recipeImage
            });
            console.log(Recipes);
            console.log("has been pushed");
            localStorage.setItem('Recipes', JSON.stringify(Recipes));




            // Check the recipe with the same titlte already exists 
            for (let i = 0; i < recipesCopy.length; i++) {
                if (recipesCopy[i].key == title) {

                    // Delete the old recipe with the same title
                    recipesCopy.splice(i, 1);
                    
                }
            }

            // Add the newly created recipe with that title
            recipesCopy.push({
                key: title,
                ingredients: ingredients,
                instructions: instructions,
                image: recipeImage
            });

            // Update "Recipe" in local storage 
            localStorage.setItem('Recipes', JSON.stringify(Recipes));
        } else {
            event.preventDefault();
            let recipes = JSON.parse(localStorage.getItem('Recipes'));
            recipesCopy.push(recipes);


            recipesCopy.push({
                key: title,
                ingredients: ingredients,
                instructions: instructions,
                image: recipeImage
            });

            // Update "Recipe" in local storage 
            localStorage.setItem('Recipes', JSON.stringify(Recipes));
        }
    }
    console.log(Recipes);
}

function saveSearchDataToLocalStorage(title, ingredients, instructions, recipeImage) {
    // Create an array to save a copy of local storage array 
    let SearchedRecipes = [];

    // Check if the "Recipe" array already exists in the Local storage 
    if (localStorage.getItem('SearchedRecipes') === null) {
        console.log("it is null");
        console.log(SearchedRecipes);
        // Push the new recipe on our local copy 
        SearchedRecipes.push({
            key: title,
            ingredients: ingredients,
            instructions: instructions,
            image: recipeImage
        });
        console.log(SearchedRecipes);

        // Create a new Recipes array using our local copr - recipesCopy
        localStorage.setItem('SearchedRecipes', JSON.stringify(SearchedRecipes));
    } else {
        // Else fetch the existing array from local storage 
        SearchedRecipes = JSON.parse(localStorage.getItem('SearchedRecipes'));

        //code that works
        SearchedRecipes.push({
            key: title,
            ingredients: ingredients,
            instructions: instructions,
            image: recipeImage
        });
        console.log(SearchedRecipes);
        console.log("has been pushed");
        localStorage.setItem('SearchedRecipes', JSON.stringify(SearchedRecipes));
        //^^^^^^

        // Check if Recipe array on local storage is empty 
        if ((SearchedRecipes.length == 0 && recipesCopy.length == 0)) {
            // Push the new recipe on our local copy 
            recipesCopy.push({
                key: title,
                ingredients: ingredients,
                instructions: instructions,
                image: recipeImage
            })
            // Update "Recipe" in local storage 
            localStorage.setItem('SearchedRecipes', JSON.stringify(SearchedRecipes));
        }

        // If the array existing and is not empty, push an object onto the array 
        else if ((SearchedRecipes.length != 0 && recipesCopy.length != 0)) 
            //Check the recipe with the same titlte already exists 
            for (let i = 0; i < recipesCopy.length; i++) {
                if (recipesCopy[i].key == title) {
                    // Delete the old recipe with the same title
                    recipesCopy.splice(i, 1);
                }
            }

            // Add the newly created recipe with that title
            recipesCopy.push({
                key: title,
                ingredients: ingredients,
                instructions: instructions,
                image: recipeImage
            })

            // Update "Recipe" in local storage 
            localStorage.setItem('SearchedRecipes', JSON.stringify(SearchedRecipes));
    }
}

function createAndDisplayRecipeOnCard(title, ingredients, instructions, recipeImage) {
    // Check if neither of the fields are empty 
    if (title != "" && ingredients != "" && instructions != "") {
        // Dismiss the dialog
        let dialog = document.querySelector('#dialog');
        dialog.close();

        // Start building the card div 
        let cardDiv = $("<div>");
        cardDiv.attr("id", "recipe-card");
        cardDiv.attr("class", "demo-card-square mdl-card mdl-shadow--2dp recipe-card-div");

        // Recipe image div 
        let imgDiv = $("<img>");
        imgDiv.attr("class", "mdl-card__title mdl-card--expand card-image");
        imgDiv.attr("src", recipeImage);
        cardDiv.append(imgDiv);

        // Recipe title div 
        let titleDiv = $("<div>");
        titleDiv.attr("id", "recipe-title");
        titleDiv.attr("class", "mdl-card__supporting-text");
        let titleH2 = $("<h2>");
        titleH2.attr("id", "card-title");
        titleH2.attr("class", "mdl-card__title-text");
        titleH2.text(title);
        titleDiv.append(titleH2);
        cardDiv.append(titleDiv);

        // Open Recipe button div 
        let buttonDiv = $("<div>");
        buttonDiv.attr("class", "mdl-card__actions mdl-card--border");
        let buttonATag = $("<button>");
        buttonATag.attr("id", "open-recipe-btn");
        buttonATag.val(title);
        buttonATag.text("Open Recipe");
        buttonATag.addClass("openButton");
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
    let reader;
    let resultURL = "";
    if (input.files && input.files[0]) {
        event.preventDefault();

        // Create file reader 
        reader = new FileReader();

        // event listener for file reader 
        reader.onload = function (e) {
            // changed from "setAttribute"
            $("#preview").attr('src', e.target.result);
            resultURL = e.target.value;
        }

        reader.readAsDataURL(input.files[0]);
    }
}


$("body").on("click", ".openButton", function() {
    let Recipes = JSON.parse(localStorage.getItem('Recipes'));
    let SearchedRecipes = JSON.parse(localStorage.getItem('SearchedRecipes'));
    console.log(event.target.value);
    console.log(Recipes);
    console.log(SearchedRecipes);
    for (i = 0; i < Recipes.length; i++) {
        if (Recipes[i].key.includes(event.target.value)) {
            let name = event.target.value;
            console.log("inclded in Recipes");
            console.log(name);
            $("#recipe-2").text(name);
            console.log(Recipes[i].ingredients);
            $("#ingredients2").text(Recipes[i].ingredients);
            console.log(Recipes[i].instructions);
            $("#recipe-contents-2").text(Recipes[i].instructions);
            console.log(Recipes[i].image);
            $("#recipe-image-2").attr("src", Recipes[i].image);

            $(".container-index").addClass("hidden");

            $(".individual-recipes").removeClass("hidden");
        } else {
            console.log("not included in Recipes");
        }
    }
    for (j = 0; j < SearchedRecipes.length; j++) {
        if (SearchedRecipes[j].key.includes(event.target.value)) {
            let name = event.target.value;
            console.log("included in SearchRecipes");
            console.log(name);
            $("#recipe-2").text(name);
            console.log(SearchedRecipes[j].ingredients);
            $("#ingredients2").text(SearchedRecipes[j].ingredients);
            console.log(SearchedRecipes[j].instructions);
            $("#recipe-contents-2").text(SearchedRecipes[j].instructions);
            console.log(SearchedRecipes[j].image);
            $("#recipe-image-2").attr("src", SearchedRecipes[j].image);

            $(".container-index").addClass("hidden");

            $(".individual-recipes").removeClass("hidden");
        } else {
            console.log("not included in SearchRecipes");
        }
    }
});

$("body").on("click", "#close", function() {
    $(".container-index").removeClass("hidden");

    $(".individual-recipes").addClass("hidden");
})