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
            
            //var apiKey = "6f8efb8f773b4ba3bc9fcb1c1d7d0e24";
            var apiKey = "c3cbd63708ed4e5b9e24c441f3712e1d";
            //var apiKey = "b97317ef164f48c1b2fb4223ec2365bf";

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
                }
            });
            $("#card-for-recipe-list").removeClass("hidden");
        }
    });

    $("body").on("click", ".click-title", function () {
        let titleVal = event.target.value;
        if (titleVal === "1") {
            $("#recipe1").removeClass("hidden");
            
            //var apiKey = "6f8efb8f773b4ba3bc9fcb1c1d7d0e24";
            var apiKey = "c3cbd63708ed4e5b9e24c441f3712e1d";
            //var apiKey = "b97317ef164f48c1b2fb4223ec2365bf";
    
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
                    console.log(foundIngredients);
                    let li = $("<li></li>");
                    li.text(response[0].missedIngredients[k].name);
                    $(`#ingredients1`).append(li);
                }

                var recipeID = response[0].id;
                console.log("title and its ID", recipeID + title);
                var instructionsURL = "https://api.spoonacular.com/recipes/" + recipeID + "/analyzedInstructions?apiKey=" + apiKey;
                console.log(instructionsURL);

                $.ajax({
                    url: instructionsURL,
                    method: "GET"
                }).then(function (response) {
                    if (response.length === 0) {
                        console.log("No instructions found.");
                        //add P tag for add no instructions or ingredients found :)
                        var li = $("<li></li>");
                        $(`#recipe-contents-1`).empty();
                        li.text("No instructions found");
                        $(`#recipe-contents-1`).append(li);
                    } else {
                        $(`#recipe-contents-1`).empty();
                        for(let k = 0; k < response.length; k++) {
                            var numberOfSteps = response[k].steps.length;

                            for (var i = 0; i < numberOfSteps; i++) {
                                var li = $("<li></li>");
                                li.text(response[k].steps[i].step);
                                $(`#recipe-contents-1`).append(li);

                                var numberOfIngredients = response[k].steps[i].ingredients.length;

                                for (var j = 0; j < numberOfIngredients; j++) {
                                    if(response[k].steps[i].ingredients[j].length === 0) {
                                        console.log("no ingredients for this step");
                                    } else {
                                        console.log(response[k].steps[i].ingredients[j].name);
                                        if (foundIngredients.includes(response[k].steps[i].ingredients[j].name)) {
                                            console.log("not pushed");
                                        } else {
                                            foundIngredients.push(response[k].steps[i].ingredients[j].name);
                                            console.log("after push", foundIngredients);
                                            let ingLi = $("<li></li>");
                                            ingLi.text(response[k].steps[i].ingredients[j].name);
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
            var apiKey = "c3cbd63708ed4e5b9e24c441f3712e1d";
            //var apiKey = "b97317ef164f48c1b2fb4223ec2365bf";
    
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
                    console.log(foundIngredients);
                    let li = $("<li></li>");
                    li.text(response[1].missedIngredients[k].name);
                    $(`#ingredients1`).append(li);
                }

                var recipeID = response[1].id;
                console.log("title and its ID", recipeID + title);
                var instructionsURL = "https://api.spoonacular.com/recipes/" + recipeID + "/analyzedInstructions?apiKey=" + apiKey;
                console.log(instructionsURL);

                $.ajax({
                    url: instructionsURL,
                    method: "GET"
                }).then(function (response) {
                    if (response.length === 0) {
                        console.log("No instructions found.");
                        //add P tag for add no instructions or ingredients found :)
                        var li = $("<li></li>");
                        $(`#recipe-contents-1`).empty();
                        li.text("No instructions found");
                        $(`#recipe-contents-1`).append(li);
                    } else {
                        $(`#recipe-contents-1`).empty();
                        for(let k = 0; k < response.length; k++) {
                            var numberOfSteps = response[k].steps.length;

                            for (var i = 0; i < numberOfSteps; i++) {
                                var li = $("<li></li>");
                                li.text(response[k].steps[i].step);
                                $(`#recipe-contents-1`).append(li);

                                var numberOfIngredients = response[k].steps[i].ingredients.length;

                                for (var j = 0; j < numberOfIngredients; j++) {
                                    if(response[k].steps[i].ingredients[j].length === 0) {
                                        console.log("no ingredients for this step");
                                    } else {
                                        console.log(response[k].steps[i].ingredients[j].name);
                                        if (foundIngredients.includes(response[k].steps[i].ingredients[j].name)) {
                                            console.log("not pushed");
                                        } else {
                                            foundIngredients.push(response[k].steps[i].ingredients[j].name);
                                            console.log("after push", foundIngredients);
                                            let ingLi = $("<li></li>");
                                            ingLi.text(response[k].steps[i].ingredients[j].name);
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
            var apiKey = "c3cbd63708ed4e5b9e24c441f3712e1d";
            //var apiKey = "b97317ef164f48c1b2fb4223ec2365bf";
    
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
                    console.log(foundIngredients);
                    let li = $("<li></li>");
                    li.text(response[2].missedIngredients[k].name);
                    $(`#ingredients1`).append(li);
                }

                var recipeID = response[2].id;
                console.log("title and its ID", recipeID + title);
                var instructionsURL = "https://api.spoonacular.com/recipes/" + recipeID + "/analyzedInstructions?apiKey=" + apiKey;
                console.log(instructionsURL);

                $.ajax({
                    url: instructionsURL,
                    method: "GET"
                }).then(function (response) {
                    if (response.length === 0) {
                        console.log("No instructions found.");
                        //add P tag for add no instructions or ingredients found :)
                        var li = $("<li></li>");
                        $(`#recipe-contents-1`).empty();
                        li.text("No instructions found");
                        $(`#recipe-contents-1`).append(li);
                    } else {
                        $(`#recipe-contents-1`).empty();
                        for(let k = 0; k < response.length; k++) {
                            var numberOfSteps = response[k].steps.length;

                            for (var i = 0; i < numberOfSteps; i++) {
                                var li = $("<li></li>");
                                li.text(response[k].steps[i].step);
                                $(`#recipe-contents-1`).append(li);

                                var numberOfIngredients = response[k].steps[i].ingredients.length;

                                for (var j = 0; j < numberOfIngredients; j++) {
                                    if(response[k].steps[i].ingredients[j].length === 0) {
                                        console.log("no ingredients for this step");
                                    } else {
                                        console.log(response[k].steps[i].ingredients[j].name);
                                        if (foundIngredients.includes(response[k].steps[i].ingredients[j].name)) {
                                            console.log("not pushed");
                                        } else {
                                            foundIngredients.push(response[k].steps[i].ingredients[j].name);
                                            console.log("after push", foundIngredients);
                                            let ingLi = $("<li></li>");
                                            ingLi.text(response[k].steps[i].ingredients[j].name);
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
            var apiKey = "c3cbd63708ed4e5b9e24c441f3712e1d";
            //var apiKey = "b97317ef164f48c1b2fb4223ec2365bf";
    
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
                    console.log(foundIngredients);
                    let li = $("<li></li>");
                    li.text(response[3].missedIngredients[k].name);
                    $(`#ingredients1`).append(li);
                }

                var recipeID = response[3].id;
                console.log("title and its ID", recipeID + title);
                var instructionsURL = "https://api.spoonacular.com/recipes/" + recipeID + "/analyzedInstructions?apiKey=" + apiKey;
                console.log(instructionsURL);

                $.ajax({
                    url: instructionsURL,
                    method: "GET"
                }).then(function (response) {
                    if (response.length === 0) {
                        console.log("No instructions found.");
                        //add P tag for add no instructions or ingredients found :)
                        var li = $("<li></li>");
                        $(`#recipe-contents-1`).empty();
                        li.text("No instructions found");
                        $(`#recipe-contents-1`).append(li);
                    } else {
                        $(`#recipe-contents-1`).empty();
                        for(let k = 0; k < response.length; k++) {
                            var numberOfSteps = response[k].steps.length;

                            for (var i = 0; i < numberOfSteps; i++) {
                                var li = $("<li></li>");
                                li.text(response[k].steps[i].step);
                                $(`#recipe-contents-1`).append(li);

                                var numberOfIngredients = response[k].steps[i].ingredients.length;

                                for (var j = 0; j < numberOfIngredients; j++) {
                                    if(response[k].steps[i].ingredients[j].length === 0) {
                                        console.log("no ingredients for this step");
                                    } else {
                                        console.log(response[k].steps[i].ingredients[j].name);
                                        if (foundIngredients.includes(response[k].steps[i].ingredients[j].name)) {
                                            console.log("not pushed");
                                        } else {
                                            foundIngredients.push(response[k].steps[i].ingredients[j].name);
                                            console.log("after push", foundIngredients);
                                            let ingLi = $("<li></li>");
                                            ingLi.text(response[k].steps[i].ingredients[j].name);
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
            var apiKey = "c3cbd63708ed4e5b9e24c441f3712e1d";
            //var apiKey = "b97317ef164f48c1b2fb4223ec2365bf";
    
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
                    console.log(foundIngredients);
                    let li = $("<li></li>");
                    li.text(response[4].missedIngredients[k].name);
                    $(`#ingredients1`).append(li);
                }

                var recipeID = response[4].id;
                console.log("title and its ID", recipeID + title);
                var instructionsURL = "https://api.spoonacular.com/recipes/" + recipeID + "/analyzedInstructions?apiKey=" + apiKey;
                console.log(instructionsURL);

                $.ajax({
                    url: instructionsURL,
                    method: "GET"
                }).then(function (response) {
                    if (response.length === 0) {
                        console.log("No instructions found.");
                        //add P tag for add no instructions or ingredients found :)
                        var li = $("<li></li>");
                        $(`#recipe-contents-1`).empty();
                        li.text("No instructions found");
                        $(`#recipe-contents-1`).append(li);
                    } else {
                        $(`#recipe-contents-1`).empty();
                        for(let k = 0; k < response.length; k++) {
                            var numberOfSteps = response[k].steps.length;

                            for (var i = 0; i < numberOfSteps; i++) {
                                var li = $("<li></li>");
                                li.text(response[k].steps[i].step);
                                $(`#recipe-contents-1`).append(li);

                                var numberOfIngredients = response[k].steps[i].ingredients.length;

                                for (var j = 0; j < numberOfIngredients; j++) {
                                    if(response[k].steps[i].ingredients[j].length === 0) {
                                        console.log("no ingredients for this step");
                                    } else {
                                        console.log(response[k].steps[i].ingredients[j].name);
                                        if (foundIngredients.includes(response[k].steps[i].ingredients[j].name)) {
                                            console.log("not pushed");
                                        } else {
                                            foundIngredients.push(response[k].steps[i].ingredients[j].name);
                                            console.log("after push", foundIngredients);
                                            let ingLi = $("<li></li>");
                                            ingLi.text(response[k].steps[i].ingredients[j].name);
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