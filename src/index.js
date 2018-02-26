const $ = require('jquery');

// this runs the loading.gif image
const loadingGif = () => {
    $('.container-loader').html("<img src='./img/block_loader.gif' class='loader'>");
};
loadingGif();

const loadGif = () => {
    $('.container-gif').html("<img src='./img/loader.gif' class='load'>");
};
loadGif();

// hide form until called in getMovies function
$('.add-movie-form').hide();
$('.search-box').hide();
$('.movie-table').hide();
$('.container-gif').hide();


// this function shows the forms upon page load when called
function formLoader() {
    $('.add-movie-form').show();
    $('.search-box').show();
    $('.movie-table').show();
    $('.container-loader').hide();
}

//################################################# UPDATE MOVIES FUNCTION #############################################
function updateMovieList() {
    getMovies().then((movies) => {
        formLoader();
        let moviesBuilder = '';
        movies.forEach(({title, rating, id}) => {
            moviesBuilder += `<tr>`;
            moviesBuilder += `<td data-title=${title}><h4>${title}</h4></td>`;
            moviesBuilder += `<td data-rating=${rating}><h4>${rating}</h4></td>`;
            moviesBuilder += `<td data-id=${id}><h4>${id}</h4></td>`;
            moviesBuilder += `<td><button type="submit" id="del-btn-${id}" class="deleteBtn">Delete Movie</button></td>`;
            moviesBuilder += `</tr>`;

            $('#movie-stuff').html(moviesBuilder);
        });

        $('.deleteBtn').click((e) => {
            e.preventDefault();
            let id = event.currentTarget.id.split('-');
            deleteMovie(id[2]);
            $(e.currentTarget).parent().parent().fadeOut(1200);
            updateMovieList()
        });

        // $('td h4').click(function (e) {
        //     console.log(this.innerHTML);
        //     // $('#edit-title').val(this.firstChild().innerHTML);
        // });

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
    $('#myTable').hide();
    $('.container-gif').show();
    fetch(url, options)
        .then( () => {
            updateMovieList();
            $('.container-gif').hide();
            $('#myTable').show();
        })
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
    $('#myTable').hide();
    $('.container-gif').show();
    fetch(url, options)
        .then( () => {
            updateMovieList();
            $('.container-gif').hide();
            $('#myTable').show();
        })
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

//################################################# EDIT POPULATE FUNCTIONALITY ########################################
// let movieTable = document.getElementById('myTable'),rIndex;
//
// for (let i = 1; i < movieTable.rows.length; i++) {
//     movieTable.rows[i].onclick = function () {
//         rIndex = this.rowIndex;
//         console.log(document.getElementById('edit-title').value() = this.cells[0].innerHTML);
//         document.getElementById('edit-rating').value() = this.cells[0].innerHTML;
//
//     }
// }

