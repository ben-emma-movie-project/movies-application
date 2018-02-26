const $ = require('jquery');

// this runs the loading.gif image
const loadingGif = () => {
    $('.container-loader').html("<img src='./img/page-loader.gif' class='loader'>");
};
loadingGif();

// hide form until called in getMovies function
$('.add-movie-form').hide();
$('.search-box').hide();
$('.movie-table').hide();

// this function shows the forms upon page load when called
function formLoader() {
    $('.add-movie-form').show();
    $('.search-box').show();
    $('.movie-table').show();
    $('.container-loader').hide()
}

//################################################# UPDATE MOVIES FUNCTION #############################################
function updateMovieList() {
    getMovies().then((movies) => {
        formLoader();
        let moviesBuilder = '';
        movies.forEach(({title, rating, id}) => {
            moviesBuilder += `<tr>`;
            moviesBuilder += `<td><h4>${title}</h4></td>`;
            moviesBuilder += `<td><h4>${rating}</h4></td>`;
            moviesBuilder += `<td><h4>${id}</h4></td>`;
            moviesBuilder += `<td><button type="submit" id="del-btn-${id}" class="deleteBtn">Delete Movie</button></td>`;
            moviesBuilder += `</tr>`;

            $('#movie-stuff').html(moviesBuilder);
        });

        $('.deleteBtn').click((e) => {
            e.preventDefault();
            let id = event.currentTarget.id.split('-');
            deleteMovie(id[2]);
            $('#movie-stuff' + id[2]).hide();
            updateMovieList()
        });

    }).catch((error) => {
        alert('Oh no! Something went wrong.\nCheck the console for details.');
        console.log(error);
    });
}

const {getMovies} = require('./api.js');

const moviesBuilder = document.getElementById('movie-stuff');

//################################################# ADD NEW MOVIE FROM DB ##############################################
$('#add-movie-button').click(function (e) {
    e.preventDefault();
    let title = $('#new-title').val();
    let rating = $('#new-rating').val();

    let url = '/api/movies';
    let options = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({title, rating}),
    };
    fetch(url, options)
        .then( () => updateMovieList())
        .catch(/* handle errors */);
});

//################################################# EDIT EXISTING MOVIE IN DB ##########################################
$('#edit-movie-button').click(function (e) {
    e.preventDefault();
    let title = $('#edit-title').val();
    let rating = $('#edit-rating').val();
    let id= $('#edit-movie-id').val();

    let url = '/api/movies/' + $('#edit-movie-id').val();
    let options = {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({title, rating, id}),
    };
    fetch(url, options)
        .then(() => updateMovieList())
        .catch(/* handle errors */);
});

//################################################# DELETE MOVIE FROM DB ###############################################
function deleteMovie(id) {
    const options = {
        method: 'DELETE',
    };
    fetch(`/api/movies/${id}`, options)
        .then(response => response.json())
        .catch(error => console.log(error))

}

updateMovieList();

//################################################# SEARCH BOX FUNCTIONALITY ###########################################
function searchMovie() {
    // Declare variables
    let input, filter, table, tr, td, i;
    input = document.getElementById("search-box");
    filter = input.value.toUpperCase();
    table = document.getElementById("myTable");
    tr = table.getElementsByTagName("tr");

    // Loop through all table rows, and hide those who don't match the search query
    for (i = 0; i < tr.length; i++) {
        td = tr[i].getElementsByTagName("td")[0];
        if (td) {
            if (td.innerHTML.toUpperCase().indexOf(filter) > -1) {
                tr[i].style.display = "";
            } else {
                tr[i].style.display = "none";
            }
        }
    }
}
$('#search-box').on('keyup', searchMovie);
