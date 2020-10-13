const express = require("express");
const https = require("https");
const bodyParser = require("body-parser");
const ejs = require("ejs");
// var _ = require('lodash');
var Pokedex = require('pokedex-promise-v2');
var P = new Pokedex();
let pokemonAbilities = [];
let image;
let types = [];
let pokemonName;
let weight;
let height;
let moves = [];
let hp;

const app = express();
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(express.static("public"));


app.get("/", function (req, res) {
    res.render("pokemon");
});



app.post("/", function(req, res){
    pokemonName = (req.body.pokemon).toLowerCase();
    pokemonAbilities = [];
    types = [];
    moves = [];
    P.getPokemonByName(pokemonName) // with Promise
    .then(function (response) {
        const listOfAbilities = response.abilities;
        listOfAbilities.forEach(ability =>
            pokemonAbilities.push(ability.ability.name)
            )
        image = response.sprites.front_default;
        const listOfTypes = response.types;
        listOfTypes.forEach(type =>
            types.push(type.type.name)
            )
        weight = response.weight;
        height = response.height;
        const listOfMoves = response.moves.slice(0,5);
        listOfMoves.forEach(move =>
            moves.push(move.move.name))
        hp = response.stats[0].base_stat
    res.redirect("/pokemonCard");
    })
    .catch(function (error) {
        res.write("<p>please try again</p>");
    });

})

app.get("/pokemonCard", function (req, res){
    res.render("pokemonCard", {
        abilities: pokemonAbilities,
        pokemonImage: image,
        types: types,
        pokemonName: pokemonName,
        weight: weight,
        height: height,
        moves: moves,
        hp: hp
    })
})

app.listen(3000, function () {
    console.log("server running on port 3000.");
});