const recipenext = document.querySelectorAll(".recipenext");
const recipeprev = document.querySelectorAll(".recipeprev");
const recipeHolder = document.querySelector("#recipeholder");
const pagenums = document.querySelectorAll(".pagenum");
const searchbutton = document.getElementById('searchbutton')
const box = document.getElementById('vegetarian')
const saucebox = document.getElementById('sauce')
let favbutton = document.getElementById('favoris')
const recipeSpace = document.getElementById('recipeholder') 

let startIndex

let favRecipes = {'recipes':[]}
let NB_RESULTS =12
let results = []
let vegetarianWords = ['ham','meat','chicken','lamb','bacon','fish','rib','beef','pork','ribs','shrimp','salmon','meatballs','meatloaf','meatball','meatloaves','tuna','duck','prosciutto']
let saucewords = ['sauce','marinade']
let loading = document.getElementById('loading')
let numResults = 240
let processing = false

let cleanWord = function(word){
    return word.toLowerCase().replace(/[ \n,;.:/!?\-%&'\(`\)\$€]/g,' ').replace(/\u0153/g,'oe')
}


let displayResults = function(results,startIndex){
    resultlen = results.length

    pagenums.forEach(pagenum=>{
        pagenum.textContent = 'Page '+ Math.round(1+startIndex/NB_RESULTS) + '/'+ Math.ceil(results.length/ NB_RESULTS)
    })


    for (i=startIndex;i<startIndex+NB_RESULTS;i++){
        if (i <resultlen){
            createEntry2(results[i],i-startIndex)
        }
    }
}

function decodeHtml(html) {
    var txt = document.createElement("textarea");
    txt.innerHTML = html;
    return txt.value;
}


let displayFav = function(){

    results.results = favRecipes.recipes
    if (results.results.length > 0){
        startIndex = 0;

        recipeSpace.innerHTML = ""

        pagenums.forEach(pagenum=>{
            pagenum.removeAttribute('hidden')
            pagenum.textContent = 'Page 1/'+ Math.ceil(1+results.results.length/ NB_RESULTS)
        })
        displayResults(results.results,0)
        refreshFav()
        recipenext.forEach(button =>{
            button.removeAttribute('hidden')
        })
        recipeprev.forEach(button =>{
            button.removeAttribute('hidden')
        })
    }else{
        startIndex = 0;
        pagenums.forEach(pagenum=>{
            pagenum.setAttribute('hidden','true')
        })
        recipenext.forEach(button =>{
            button.setAttribute('hidden','true')
        })
        recipeprev.forEach(button =>{
            button.setAttribute('hidden','true')
        })
        recipeSpace.innerHTML = "Pas de favoris pour le moment ! Clique sur l'étoile sur une recette pour les enregistrer."
    }
} 

let createEntry2 = async function(recipe){
    container = document.createElement('a')
    container.setAttribute('class','recipecontainer')

    newRecipeName = document.createElement('div')
    
    newRecipeName.setAttribute('class','recipename')
    newRecipeName.textContent = decodeHtml(recipe['name'])
    properties = document.createElement('div')
    properties.setAttribute('class','recipeprop')
    container.addEventListener('mouseenter', function(e){
        e.target.style.backgroundColor =  'grey'})
    container.addEventListener('mouseleave', function(e){
        e.target.style.backgroundColor =  'white'})
    
    if (recipe.keyword != null){
        properties.textContent = recipe.keyword.join(', ')
    }


    container.setAttribute('href',recipe['url'])

    star = document.createElement('div')
    star.setAttribute('class','star')
    if (JSON.stringify(favRecipes.recipes).includes(JSON.stringify(recipe['url']))){
        star.setAttribute('class','star activated')
    }
    star.addEventListener('mouseover', (e)=>{
        e.currentTarget.parentNode.parentNode.style.backgroundColor = 'white'
    })
    star.addEventListener('mouseout', (e)=>{
        e.currentTarget.parentNode.parentNode.style.backgroundColor = 'grey'
    })
    star.addEventListener('click', (e)=>{
        e.preventDefault();
        jsonrecipe = JSON.stringify(recipe)
        if (!e.currentTarget.classList.contains('activated')){
            localStorage.setItem('saved', localStorage.getItem('saved') + ',' +jsonrecipe)
            e.target.setAttribute('class','star activated' )
        }else{
            localStorage.setItem('saved',  localStorage.getItem('saved').replace(','+jsonrecipe,''))
            e.target.setAttribute('class','star' )
        }
        refreshFav()
    })

    containerbottom = document.createElement('div')
    containerbottom.setAttribute('class', 'containerbottom')

    container.appendChild(newRecipeName)
    containerbottom.appendChild(properties)
    containerbottom.appendChild(star)

    container.appendChild(containerbottom)
    recipeSpace.appendChild(container)
}

let clean = function(string){
    return encodeURIComponent(string.toLowerCase())
}
let refreshFav = function(){
    stringfav = localStorage.getItem('saved')
    if ((stringfav != null) & (stringfav.length > 10))
    {
        let listFav = stringfav.slice(stringfav.indexOf('{')+1,stringfav.length-1)
        listFav=listFav.split('},{')
        favRecipes = {'recipes':[]}
        listFav.forEach(recipe=>{
            if (recipe.length >10){
                recipejson = JSON.parse(`{${recipe}}`)
                favRecipes.recipes.push(recipejson)
            }
        })
    }else{
        localStorage.setItem('saved','')
        stringfav = ''
        favRecipes = {'recipes':[]}
    }
    favRecipes.recipes = favRecipes.recipes.filter((v,i,a)=>a.findIndex(v2=>(v2.name===v.name))===i)
}
async function grabRecipes(amount=numResults){
    const d = new Date();
    let month = d.getMonth()
    if (box.checked){
        vg =1
    }else{
        vg=0
    }
    var myHeaders = new Headers()
    myHeaders.append("Content-Type", "application/x-www-form-urlencoded")
    requestParams = {
        'method': 'POST',
        'headers': myHeaders,
        'amount':amount,
        'vg':vg
    }
    let recipesFiltered
    await fetch(`https://calm-sierra-13075.herokuapp.com/https://thawing-taiga-23689.herokuapp.com/recipes/month/${month}/${vg}/${amount}`)
        .then(response => response.json())
        .then(json => recipesFiltered= json);
    console.log(recipesFiltered)
    return recipesFiltered
}


favbutton.addEventListener('click',function(){displayFav()})

async function loadrecipes(){
    if (processing == false){
        recipeSpace.innerHTML = ""

        processing = true
        searchbutton.setAttribute('class','processing')
        loading.removeAttribute('hidden')
        pagenums.forEach(pagenum=>{
            pagenum.setAttribute('hidden','true')
        })
        box.disabled = true
        recipenext.forEach(button =>{
            button.setAttribute('hidden','true')
        })
        recipeprev.forEach(button =>{
            button.setAttribute('hidden','true')
        })            

        results = await grabRecipes()

        box.disabled = false

        loading.setAttribute('hidden','true')

        if (results.results.length !=0){
            recipeSpace.innerHTML = ""
    
            pagenums.forEach(pagenum=>{
                pagenum.removeAttribute('hidden')
                pagenum.textContent = 'Page 1/'+ Math.ceil(1+results.results.length/ NB_RESULTS)
            })
            displayResults(results.results,0)
            recipenext.forEach(button =>{
                button.removeAttribute('hidden')
            })
            recipeprev.forEach(button =>{
                button.removeAttribute('hidden')
            })
        }else{
            recipeSpace.innerHTML = ""
    
            recipeHolder.textContent = 'Pas de recettes correspondantes'
        }
        processing=false
        searchbutton.removeAttribute('class')
    }
}

searchbutton.addEventListener('click',loadrecipes)


recipenext.forEach(button =>{button.addEventListener('click',() =>{
    recipeSpace.innerHTML = ""
    displayResults(results.results, Math.min(startIndex+=NB_RESULTS,results.results.length - results.results.length %NB_RESULTS))
    if (startIndex>results.results.length){
        startIndex=results.results.length-NB_RESULTS
    }
})})

recipeprev.forEach(button =>{button.addEventListener('click',() =>{
    recipeSpace.innerHTML = ""
    displayResults(results.results, Math.max(startIndex-=NB_RESULTS,0))
    if (startIndex<0){
        startIndex=0
    }
})})


if (localStorage.getItem('saved') == null){
    localStorage.setItem('saved','')
}
//initialize()

loadrecipes()
refreshFav()


