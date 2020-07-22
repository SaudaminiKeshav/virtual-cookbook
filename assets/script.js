$(document).ready(function() {
    let addRecipeBtn = $("#add-recipe-btn");

    $(addRecipeBtn).on("click", function () {
        let recipeCard = $("#recipe-card");

        $(recipeCard).show();
        // Need to take img and the recipe name to add it to the card
    });
});