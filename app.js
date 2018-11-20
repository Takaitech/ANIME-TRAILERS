
function topAnime(){
    const url = 'https://api.jikan.moe/v3/top/anime/1/bypopularity'

    fetch(url)
    .then(response => response.json())
    .then(responseJson => displayResults(responseJson))
    .catch(err =>{
    $('#currentPage').text(`something went wrong ${err.message}`);
    });
}


function upcomingAnime(){
    const url = 'https://api.jikan.moe/v3/top/anime/1/upcoming'

    fetch(url)
    .then(response => response.json())
    .then(responseJson => displayResults(responseJson))
    .catch(err =>{
    $('body').text(`something went wrong ${err.message}`);
    });
    $('#results').empty();
}


function displayResults(responseJson) {
    $('#results').append(`<label id="container">
        <input class="selectAnime" type="radio" value="${responseJson.top[0].title}; ${responseJson.top[0].score}; ${responseJson.top[0].mal_id}" name="anime" required />
        <img class="coverArt" src="${responseJson.top[0].image_url}" alt"${responseJson.top[0].title} Cover Art">
        </label>`)
    
   for(let i = 1; i< responseJson.top.length; i++) {
       $('#results').append(`<label id="container">
            <input class="selectAnime" type="radio" value="${responseJson.top[i].title}; ${responseJson.top[i].score}; ${responseJson.top[i].mal_id}" name="anime" required />
            <img class="coverArt" src="${responseJson.top[i].image_url}" alt"${responseJson.top[i].title} Cover Art">
            </label>`)
    }
    
    $('#selectInput').on('click', event => {
        event.preventDefault();
        getTitle();
        
        function getTitle(){
        var animeData = document.querySelector('input[name="anime"]:checked').value.split('; ');
        displayData(animeData)
        };
        
        function displayData(animeData) {
            let title = animeData[0];
            let score = animeData[1];
            let animeId = animeData[2];
    
            $('#title').text(title);
            if (score > 0) { 
                $('#rating').text('Rating: ' + score + ' / 10');
            } else {
                $('#rating').text('Not yet rated');
            }
        
        trailerSearch(animeData);
        }
    })
}


function displaySearchResults(responseJson) {
    $('#currentPage').empty();
    $('#results').empty();
    $('#results').append(`<label id="container">
        <input class="selectAnime" type="radio" value="${responseJson.results[0].title}; ${responseJson.results[0].score}; ${responseJson.results[0].mal_id}" name="anime" required />
        <img class="coverArt" src="${responseJson.results[0].image_url}" alt"${responseJson.results[0].title} Cover Art">
        </label>`)
    
   for(let i = 1; i< responseJson.results.length; i++) {
       $('#results').append(`<label id="container">
        <input class="selectAnime" type="radio" value="${responseJson.results[i].title}; ${responseJson.results[i].score}; ${responseJson.results[i].mal_id}" name="anime" required />
        <img class="coverArt" src="${responseJson.results[i].image_url}" alt"${responseJson.results[i].title} Cover Art">
        </label>`)
   }
    $('.coverArt').on('click', event => {
        if($(event.currentTarget).prev().is(':checked')) { alert("it's checked"); }
    });

     $('#selectInput').on('click', event => {
        event.preventDefault();
        getTitle();
        function getTitle(){
        // Get the selected score (assuming one was selected)
        var animeData = document.querySelector('input[name="anime"]:checked').value.split('; ');
        displayData(animeData);
        };
        function displayData(animeData) {
            let title = animeData[0];
            let score = animeData[1];
            let animeId = animeData[2];
            console.log(title);
            console.log(score);
            console.log(animeId);
            $('#title').text(title);
            if (title > 0) { 
                $('#rating').text('Rating: ' + score + ' / 10');
            } else {
                $('#rating').text('Not yet rated');
            }
            
        trailerSearch(animeData);
        } 
     })
}


function trailerSearch(animeData) {
        let animeId = animeData[2];
        $('#animeInfo').removeClass('hidden');
        $('#animeInfo').addClass('visible');
    
        fetch("https://api.jikan.moe/v3/anime/" + animeId + "/videos")
        .then(response => response.json())
        .then(responseJsonVideos => displayVideos(responseJsonVideos))
        .catch(err =>{
            $('#youtube').text(`something went wrong ${err.message}`);
        })
}


function displayVideos(responseJsonVideos) {
    $('#trailers').empty();
    
    if(responseJsonVideos.promo.length > 0) {
        for(let i = 0; i < responseJsonVideos.promo.length; i++) {
        $('#trailers').append(`<div class="trailer"><a href="${responseJsonVideos.promo[i].video_url}" data-lity><img src="${responseJsonVideos.promo[i].image_url}"></a><h3>${responseJsonVideos.promo[i].title}<h3></div>`)
        }
    } else {
        $('#trailers').html(`<h4>No videos Found<h4>`);
    }
    
    $('#animeInfo').on('click', event => {
        $('#trailers').empty();
        $('#animeInfo').removeClass('visible');
        $('#animeInfo').addClass('hidden');
    }); 
}


function formatQueryParams(params) {
    const queryItems = Object.keys(params)
    .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`)
    return queryItems.join('&');
}


function findAnime() {
    $('#search').on('click', event => {
        $('#currentPage').empty();
        event.preventDefault();
        var input = document.getElementById('userInput').value;
        const baseurl = 'https://api.jikan.moe/v3/search/anime';
        let params = {
            q: input,
            page: 1,
            type: 'tv',
            limit: 10,
        };
        
        let url = baseurl + '?' + formatQueryParams(params);
         
        fetch(url)
        .then(response => response.json())
        .then(responseJson => displaySearchResults(responseJson))
        .catch(err =>{
        $('#currentPage').text(`No matches`);
        })
    });
}


function navigateAnime() {
    $('.top').on('click', event => {
        topAnime();
        $('#currentPage').text('Top Anime ')
    });
    
    $('.upcoming').on('click', event => {
        upcomingAnime();
        $('#currentPage').text('Upcoming Anime')
    });
}

$(findAnime);
$(navigateAnime);
topAnime();


