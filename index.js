
const express = require('express');
const app = express();
const PORT = process.env || 9001;
const path = require('path');
const axios = require('axios');
app.listen(PORT, () => {
    console.log(`listening at port ${PORT}`);
});
// setting up the ejs
app.set('view engine', 'ejs');

// adding the middleware to parse the post request data
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// setting the path for the views folder so that it can be accesed outside the program folder
app.set('views', path.join(__dirname, '/views'));
//setting the path for the public folder so that we we can access our own scripts and styles
app.use(express.static(path.join(__dirname, 'public')));



// let apiId = 23ed18eb7d3a1c0e3d575df4092efa22;
app.get('/', async (req, res) => {
    let data = [];
    let Adventure;
    let Drama;
    try {

        // getting movie related to actions and adventure
        const ActionMovies = await axios.get("https://api.themoviedb.org/3/discover/movie?api_key=23ed18eb7d3a1c0e3d575df4092efa22&with_genres=28");
        data = ActionMovies.data.results.slice(0, 12);

        //getting movies related to adventure
        const AdventureMovies = await axios.get("https://api.themoviedb.org/3/discover/movie?api_key=23ed18eb7d3a1c0e3d575df4092efa22&with_genres=12");
        Adventure = AdventureMovies.data.results.slice(0, 12);

        // getting Documentary movies
        const DramaMovies = await axios.get("https://api.themoviedb.org/3/discover/movie?api_key=23ed18eb7d3a1c0e3d575df4092efa22&with_genres=18");
        Drama = DramaMovies.data.results.slice(0, 18);


        res.render('home.ejs', { data, Adventure, Drama })
    } catch (error) {
        console.log(error)
    }



});
let genres;
let production;
let releaseDate;
let title;
let overview;
let rating;
let poster;
let trailer = [];
let teaser = [];
app.get('/movies/:movieId', async (req, res) => {
    const id = req.params.movieId;
    genres, production, releaseDate, title, overview, rating, poster;
    trailer = [];
    teaser = [];

    try {
        const request = await axios.get(`https://api.themoviedb.org/3/movie/${id}?api_key=23ed18eb7d3a1c0e3d575df4092efa22`);
        const trailer_request = await axios.get(`https://api.themoviedb.org/3/movie/${id}/videos?api_key=23ed18eb7d3a1c0e3d575df4092efa22`);
        genres = request.data.genres;
        production = request.data.production_companies;
        releaseDate = request.data.release_date;
        title = request.data.title;
        overview = request.data.overview;
        rating = request.data.vote_average;
        poster = request.data.poster_path;
        trailer = trailer_request.data.results.filter(item => item.site === 'YouTube' && item.type === "Trailer").slice(0, 6);
        teaser = trailer_request.data.results.filter(item => item.site === 'YouTube' && item.type === "Teaser").slice(0, 6);
        res.redirect('/movieInfo');

    } catch (error) {
        console.log("an error occured")
    }


})
app.get('/movieInfo', (req, res) => {
    res.render('movieInfo.ejs', { genres, production, releaseDate, title, overview, rating, poster, trailer, teaser });
})
let GenreData = [];
app.post('/movies/genre', async (req, res) => {
    const Genre = req.body.Genre;
    try {

        let request = await axios.get(`https://api.themoviedb.org/3/discover/movie?api_key=23ed18eb7d3a1c0e3d575df4092efa22&with_genres=${Genre}`)
        let count = 1;
        while (count <= 20) {
            try {
                request = await axios.get(`https://api.themoviedb.org/3/discover/movie?api_key=23ed18eb7d3a1c0e3d575df4092efa22&with_genres=${Genre}&page=${count}`)
                GenreData.push(...request.data.results);
                count++;
            } catch (error) {
                break;
            }
        }
        res.redirect('/genre');
    } catch (error) {
        console.log(error);
    }

})
app.get("/genre", (req, res) => {
    res.render('genre.ejs', { GenreData });
})
// add route to handle search request
// let search;
let SearchData = [];
app.post('/query', async (req, res) => {
    let search = req.body.query;
    try {
        SearchData = [];
        let request = await axios.get(`https://api.themoviedb.org/3/search/movie?api_key=23ed18eb7d3a1c0e3d575df4092efa22&language=en-US&page=1&query=${search}&include_adult=true`)
        let count = 1;
        while (count <= 15) {
            request = await axios.get(`https://api.themoviedb.org/3/search/movie?api_key=23ed18eb7d3a1c0e3d575df4092efa22&language=en-US&page=${count}&query=${search}&include_adult=true`)
            SearchData.push(...request.data.results);
            count++;
        }
        res.redirect("/show");


    } catch (error) {
        console.log(error);
    }


})
app.get('/show', (req, res) => {
    res.render('search.ejs', { SearchData });
})
