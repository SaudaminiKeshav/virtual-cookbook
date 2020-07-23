// retrieveRecipe();

      //ingredientArray = [""];

      function retrieveRecipe() {
        var apiKey = "6f8efb8f773b4ba3bc9fcb1c1d7d0e24";
        //var ingredients = ingredientArray.join();
        //var numberOfRecipes = $("#number-of-recipes").val();
        //var recipeURL = "https://api.spoonacular.com/recipes/findByIngredients?apiKey=" + apiKey + "&ingredients=" + ingredients + "&number=" + numberOfRecipes;
        var recipeURL = "https://api.spoonacular.com/recipes/findByIngredients?apiKey=6f8efb8f773b4ba3bc9fcb1c1d7d0e24&ingredients=apples,flour,sugar&number=2";

//         $.ajax({
//         url: recipeURL,
//         method: "GET"
//         }).then(function(response) {
//           //$("#recipe-name").text(response.titel);
//           console.log(response[0].title);
//           console.log(response[0].id);
//           console.log(response[0].image);
//           console.log(response[0].missedIngredients.length);
//           var ingredientsNeeded = response[0].missedIngredients.length;
//           for (i = 0; i < ingredientsNeeded; i++) {
//             console.log(response[0].missedIngredients[i].name);
//           }

//           var recipeID = response[0].id;
//           var instructionsURL = "https://api.spoonacular.com/recipes/" + recipeID + "/analyzedInstructions?apiKey=" + apiKey;

//           $.ajax({
//             url: instructionsURL,
//             method: "GET"
//           }).then(function(response) {
//             console.log(response[0].steps.length);
//             var numberOfSteps = response[0].steps.length;
//             for (var i = 0; i < numberOfSteps; i++) {
//               console.log(response[0].steps[i].step);
//               console.log(response[0].steps[i].ingredients.length);
//               var numberOfIngredients = response[0].steps[i].ingredients.length;
//               for (var j = 0; j < numberOfIngredients; j++) {
//                 console.log(response[0].steps[i].ingredients[j].name);
//               }
//             }
//           });


//         });
//       }