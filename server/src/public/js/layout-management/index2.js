var changeable_tags = ["h1","h2","h3","h4","h5","h6","a","li",
"button", "label"]

var pageName = window.location.pathname.split("/").pop().split(".")[0]
var modebutton = document.getElementsByClassName("mode-icon")[0]

// Load session manager vars
if(!sessionStorage.getItem('sessioninfo-mode')){
    sessionStorage['sessioninfo-mode'] = "nightlight_round"
}
if(!sessionStorage.getItem('sessioninfo-fontSize')){
    sessionStorage['sessioninfo-fontSize'] = "0"
}

max_fontsize = 5
min_fontsize = -5

// Set initial tag size
for(let i = 0; i<changeable_tags.length; i++){
    let el = document.querySelectorAll(changeable_tags[i])
    for(let j = 0; j<el.length; j++){
        console.log(el[j].style.fontSize)
        el[j].style.fontSize = (parseInt(el[j].style.fontSize) + sessionStorage['sessioninfo-fontSize']) + "px"
    } 
}


// Load Value Functions
var increaseTextSizeBy = function(increment){
    
    if(parseInt(sessionStorage['sessioninfo-fontSize']) + increment > max_fontsize){
        sessionStorage['sessioninfo-fontSize'] = "" + (max_fontsize)
        increment = 0
    } else if(parseInt(sessionStorage['sessioninfo-fontSize']) + increment < min_fontsize){
        sessionStorage['sessioninfo-fontSize'] = "" + (min_fontsize)
        increment = 0
    } else{
        sessionStorage['sessioninfo-fontSize'] = ""+ (parseInt(sessionStorage['sessioninfo-fontSize'])+increment)
    }

    for(let i = 0; i<changeable_tags.length; i++){
        let el = document.querySelectorAll(changeable_tags[i])
        for(let j = 0; j<el.length; j++){
            let fontsize = el.fontSize
            console.log(fontsize)
            el[j].style.fontSize = (fontsize + increment) + "px"
            console.log(el[j].style.fontSize)
        } 
    }
}

var addCssOfPage = function(pageName){
    let linkElement = document.createElement('link')
    linkElement.setAttribute('rel', 'stylesheet')
    linkElement.setAttribute('type', "text/css")
    linkElement.setAttribute('href', "../assets/css/" + pageName + "-dark.css")
    document.querySelector('head').appendChild(linkElement)
}

var removeDarkModeCss = function(pageName){
    let allLinks = document.getElementsByTagName("link")
    for(i = 0; i < allLinks.length; i++){
        if(allLinks[i].href.includes("/assets/css/" + pageName + "-dark.css")){
            allLinks[i].remove()
        }
    }
}

// Load the values
increaseTextSizeBy(parseInt(sessionStorage['sessioninfo-fontSize']))
console.log(sessionStorage['sessioninfo-mode'])
if(sessionStorage['sessioninfo-mode'].localeCompare("nightlight_round") == 0){
    modebutton.textContent = "nightlight_round"
    sessionStorage['sessioninfo-mode'] = "nightlight_round" 
    removeDarkModeCss(pageName)
}
else{
    modebutton.textContent = "lightbulb"
    sessionStorage['sessioninfo-mode'] = "lightbulb" 
    addCssOfPage(pageName)
}

modebutton.onclick = function(){
    if(modebutton.textContent.localeCompare("nightlight_round") == 0){
        modebutton.textContent = "lightbulb"
        sessionStorage['sessioninfo-mode'] = "lightbulb" 
        addCssOfPage(pageName)
    }
    else{
        modebutton.textContent = "nightlight_round"
        sessionStorage['sessioninfo-mode'] = "nightlight_round" 
        removeDarkModeCss(pageName)
    }
        
}


document.getElementsByClassName("A+")[0].onclick = function(){
    increaseTextSizeBy(1)
}

document.getElementsByClassName("A")[0].onclick = function(){
    increaseTextSizeBy(0)
}

document.getElementsByClassName("A-")[0].onclick = function(){
    increaseTextSizeBy(-1)
}