
function topAnime(){
    const url = "https://api.jikan.moe/v3/top/anime/1/bypopularity"

    fetch(url)
    .then(response => response.json())
    .then(responseJson => displayResults(responseJson))
    .catch(err =>{
    $('body').text(`something went wrong ${err.message}`);
    });
    
    $('#results').empty();
}


function upcomingAnime(){
    const url = "https://api.jikan.moe/v3/top/anime/1/upcoming"

    fetch(url)
    .then(response => response.json())
    .then(responseJson => displayResults(responseJson))
    .catch(err =>{
    $('body').text(`something went wrong ${err.message}`);
    });
    $('#results').empty();
}


function displayResults(responseJson) {
    
    for(let i = 0; i< responseJson.top.length; i++) {
        $('#results').append(`<div id="container" class="${responseJson.top[i].title}" onclick><img class="anime" value="${responseJson.top[i].mal_id}" name="${responseJson.top[i].title}" id="${responseJson.top[i].score}" src="${responseJson.top[i].image_url}" ><div class="animeTitle">${responseJson.top[i].title}</div></div>`)
    }
    
    $('.anime').on('click', event =>{
        event.preventDefault();
        var clickedAnime = $(event.target).attr("name");
        var animeId = $(event.target).attr("value");
        var animeRating = $(event.target).attr("id");
        
        $('#title').text(clickedAnime);
        if (animeRating> 0) {
            $('#rating').text("Rating: " + animeRating + " / 10");
        } else {
            $('#rating').text("Not yet rated");
        }
    });
    
    trailerSearch(responseJson);
}


function displaySearchResults(responseJson) {
    $('#results').empty();
    
    for(let i = 0; i< responseJson.results.length; i++) {
        $('#results').append(`<div id="container" onclick><img class="anime" value="${responseJson.results[i].mal_id}" name="${responseJson.results[i].title}" id="${responseJson.results[i].score}" src="${responseJson.results[i].image_url}" ><div class="animeTitle">${responseJson.results[i].title}</div></div>`)
    }
    
    trailerSearch(responseJson);
    
    $('.anime').on('click', event =>{
        event.preventDefault();
        var clickedAnime = $(event.target).attr("name");
        var animeId = $(event.target).attr("value");
        var animeRating = $(event.target).attr("id");
        $('#title').text(clickedAnime);
        $('#rating').text("Rating: " + animeRating + " / 10");
    });
}



//fetch trailers for clicked anime 
function trailerSearch(responseJson) {
    $('.anime').on('click', event =>{
        event.preventDefault();
        var clickedAnime = $(event.target).attr("name");
        var animeId = $(event.target).attr("value");
        $("#animeInfo").removeClass("hidden");
        $("#animeInfo").addClass("visible");
        
    
        fetch("https://api.jikan.moe/v3/anime/" + animeId + "/videos")
        .then(response => response.json())
        .then(responseJsonVideos => displayVideos(responseJsonVideos, clickedAnime))
        .catch(err =>{
            $('#youtube').text(`something went wrong ${err.message}`);
            
        })
    });
}


function displayVideos(responseJsonVideos, clickedAnime) {
    if(responseJsonVideos.promo > [0]) {
        for(let i = 0; i < responseJsonVideos.promo.length; i++) {
        $('#trailers').append(`<div class="trailer"><a href="${responseJsonVideos.promo[i].video_url}" data-lity><img src="${responseJsonVideos.promo[i].image_url}"></a><h3>${responseJsonVideos.promo[i].title}<h3></div>`)
        };
    } else {
        $('#trailers').append(`<h4>No videos Found<h4>`);
    }
    
    $("#animeInfo").on('click', event => {
        $("#trailers").empty();
        $("#animeInfo").removeClass("visible");
        $("#animeInfo").addClass("hidden");
    }); 
}


function formatQueryParams(params) {
    const queryItems = Object.keys(params)
    .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`)
    return queryItems.join('&');
}


function findAnime() {
    $('.search').on('click', event => {
        event.preventDefault();
        var input = document.getElementById("search").value;
        const baseurl = "https://api.jikan.moe/v3/search/anime";
        let params = {
            q: input,
            page: 1,
            type: "tv",
            limit: 10,
        };
        
        let url = baseurl + "?" + formatQueryParams(params);
         
        
        fetch(url)
        .then(response => response.json())
        .then(responseJson => displaySearchResults(responseJson))
        .catch(err =>{
        $('body').text(`something went wrong ${err.message}`);
        })
    });
}


function navigateAnime() {
    $('.top').on('click', event => {
        topAnime();
    });
    
    $('.upcoming').on('click', event => {
        upcomingAnime();
    });
}


$(findAnime);
$(navigateAnime);
topAnime();
