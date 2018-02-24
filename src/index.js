const $ = require('jquery');

// this runs the loading.gif image
const loadingGif = () => {
    $('.container-loader').html("<img src='./img/page-loader.gif' class='loader'>");
};
loadingGif();

// hide form until called in getMovies function
$('.add-movie-form').hide();
// this function shows the forms upon page load when called
function formLoader() {
    $('.add-movie-form').show();
    $('.container-loader').hide()
}

const {getMovies} = require('./api.js');

getMovies().then((movies) => {
  formLoader();
  let moviesBuilder = [];
  movies.forEach(({title, rating}) => {
    moviesBuilder.push(`The title of the movie is: ${title} and the rating is: ${rating}.`);
  });

// this builds movie html and prints to page
let list = '<ul>';
for (let mov of moviesBuilder) {
  list += `<h2> ${mov} </h2>`;
}
list += '</ul>';
$('#movie-stuff').html(list);

// this runs if there is an error
}).catch((error) => {
  alert('Oh no! Something went wrong.\nCheck the console for details.');
  console.log(error);
});

// this adds a movie when clicked
$('#add-movie-button').click(function (e) {
    let title = $('#new-title').val();
    let rating = $('#new-rating').val();
    let movie = {
        title: title,
        rating: rating
    };

    let url = '/api/movies';
    let options = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({title, rating}),
    };
    fetch(url, options)
        .then(/* post was created successfully */)
        .catch(/* handle errors */);
});

//this edits a movie when clicked
$('#edit-movie-button').click(function (e) {
    let title = $('#edit-title').val();
    let rating = $('#edit-rating').val();
    let id = $(this).attr("data-id");
    let movie = {
        title: title,
        rating: rating,
        id: id
    };

    let url = '/api/movies/${id}';
    let options = {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({title, rating}),
    };
    fetch(url, options)
        .then(/* post was created successfully */)
        .catch(/* handle errors */);
});