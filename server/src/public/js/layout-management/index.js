// Variables
var all_changeable_text = {
    ".txt-menu-item":"0",
    "#txtBannerTitle":"0",
    "#txtBannerSubtitle":"0",
    ".txt-section-title":"0",
    ".txt-series-info":"0",
    "#txtSeriesTitle":"0",
    "#txtEpisodeTitle":"0",
    ".txt-number-info-text":"0",
    ".txt-number-info-label":"0",
    "#txtAddSeries":"0",
    ".txt-label":"0",
    ".txt-info":"0",
    "#txtAddSeries":"0",
    "label":"0",
    ".sitesection":"0",
    ".buttonText":"0",
    ".title":"0",
    "#btnSearch":"0",
    "#txtSeriesYear":"0",
    ".btn-genre-button":"0",
    ".txt-season-rating":"0",
    ".txt-exhibiton-date":"0",
    ".progress-bar":"0",
    ".txt-episode-rating":"0",
    "#btnEditPerfil":"0",
    ".data-input":"0"
}

var get_all_text_size = function(){
    let objkeys = Object.keys(all_changeable_text)
    for(let i = 0; i<objkeys.length; i++){
        let el = document.querySelector(objkeys[i])
        if(el != null){
            all_changeable_text[objkeys[i]] = getComputedStyle(el).fontSize.replace("px","")
        }
    }
}

get_all_text_size()

var pageName = document.querySelector("body").id
var modebutton = document.getElementsByClassName("mode-icon")[0]

// if(localStorage.getItem('dark')){
//     localStorage['sessioninfo-mode'] = "nightlight_round"
// }else{
//     localStorage['sessioninfo-mode'] = "lightbulb"
// }

// Load session manager
if(!localStorage.getItem('sessioninfo-mode')){
    localStorage['sessioninfo-mode'] = "nightlight_round"
}
if(!localStorage.getItem('sessioninfo-fontSize')){
    localStorage['sessioninfo-fontSize'] = "0"
}

// Load Value Functions
var increaseTextSizeBy = function(increment){
    let objkeys = Object.keys(all_changeable_text)
    for(let i = 0; i<objkeys.length; i++){
        let el = document.querySelectorAll(objkeys[i])
        for(let j = 0; j<el.length; j++){
            el[j].style.fontSize = (parseInt(all_changeable_text[objkeys[i]]) + increment) + "px"
        } 
    }
    localStorage['sessioninfo-fontSize'] = ""+increment
}

var addCssOfPage = function(pageName){
    console.log('Nome da página:', pageName);

    let linkElement = document.createElement('link')
    linkElement.setAttribute('rel', 'stylesheet')
    linkElement.setAttribute('type', "text/css")
    linkElement.setAttribute('href', "/css/" + pageName + "-dark.css")
    document.querySelector('head').appendChild(linkElement)
}

var removeDarkModeCss = function(pageName){
    let allLinks = document.getElementsByTagName("link")
    for(i = 0; i < allLinks.length; i++){
        if(allLinks[i].href.includes("/css/" + pageName + "-dark.css")){
            allLinks[i].remove()
        }
    }
}

// Load the values
increaseTextSizeBy(parseInt(localStorage['sessioninfo-fontSize']))
console.log(localStorage['sessioninfo-mode'])
if(localStorage['sessioninfo-mode'].localeCompare("nightlight_round") == 0){
    modebutton.textContent = "nightlight_round"
    localStorage['sessioninfo-mode'] = "nightlight_round" 
    removeDarkModeCss(pageName)
}
else{
    modebutton.textContent = "lightbulb"
    localStorage['sessioninfo-mode'] = "lightbulb" 
    addCssOfPage(pageName)
}

modebutton.onclick = function(){
    if(modebutton.textContent.localeCompare("nightlight_round") == 0){
        modebutton.textContent = "lightbulb"
        localStorage['sessioninfo-mode'] = "lightbulb" 
        addCssOfPage(pageName)
    }
    else{
        modebutton.textContent = "nightlight_round"
        localStorage['sessioninfo-mode'] = "nightlight_round" 
        removeDarkModeCss(pageName)
    }
        
}


document.getElementsByClassName("A+")[0].onclick = function(){
    let increment = 5
    increaseTextSizeBy(increment)
}

document.getElementsByClassName("A")[0].onclick = function(){
    let increment = 0
    increaseTextSizeBy(increment)
}

document.getElementsByClassName("A-")[0].onclick = function(){
    let increment = -5
    increaseTextSizeBy(increment)
}