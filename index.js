const recipenext = document.querySelectorAll(".recipenext");
const recipeprev = document.querySelectorAll(".recipeprev");
const recipeHolder = document.querySelector("#recipeholder");
const pagenums = document.querySelectorAll(".pagenum");
let favRecipes = {'recipes':[]}
bar = document.getElementById('inputbar')
box = document.getElementById('vegetarian')
saucebox = document.getElementById('sauce')
favbutton = document.getElementById('favoris')

let chocolateRecipes 
let randlist = []
let startIndex



let cleanWord = function(word){
    return word.toLowerCase().replace(/[ \n,;.:/!?\-%&'\(`\)\$€]/g,' ').replace(/\u0153/g,'oe')
}

let treatEntry = function(entry){
    wordsToSearch = ['']
    wordsToAvoid = []
    search=true
    for (var i = 0; i < entry.length;i++){
        if (entry[i]=='-'){
            search = false
            wordsToAvoid.push('')
        }else if (' +'.includes(entry[i])){
            search = true
            wordsToSearch.push('')
        }else{
            if (search == true){
                wordsToSearch[wordsToSearch.length-1] =wordsToSearch[wordsToSearch.length-1]+ entry[i]
            }else{
                wordsToAvoid[wordsToAvoid.length-1] = wordsToAvoid[wordsToAvoid.length-1] + entry[i]
            }
        }
    }
    return [wordsToSearch,wordsToAvoid]
}
function shuffle(array) {
    let currentIndex = array.length,  randomIndex;

    // While there remain elements to shuffle.
    while (currentIndex != 0) {

        // Pick a remaining element.
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;

        // And swap it with the current element.
        [array[currentIndex], array[randomIndex]] = [
        array[randomIndex], array[currentIndex]];
    }

    return array;
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
recipeSpace = document.getElementById('recipeholder') 

function decodeHtml(html) {
    var txt = document.createElement("textarea");
    txt.innerHTML = html;
    return txt.value;
}

let treatKeywords = function(string){
    string = string.replace('biscuits-mignardises','Biscuits')
    string = string.replace('poisson','Poisson')
    string = string.replace('aperitif-tapas','Apéritif')
    string = string.replace('de-fromage','Fromage')
    string = string.replace('de-sauces','Sauces')
    string = string.replace('entree','Entrées')
    string = string.replace('dessert','Desserts')
    string = string.replace('de-mignardises','Biscuits')
    string = string.replace('plat','Plat')
    string = string.replace('cocktail-et-boisson','Cocktail')
    string = string.replace('de-viennoiserie','Viennoiserie')
    string = string.replace('aperitif-antipasti','Apéritif')
    string = string.replace('conserves-sauces-condiments','Condiments')
    string = string.replace('pasta-risotto','Pâtes & risotto')
    string = string.replace('recettes-salees','Salé')
    string = string.replace('recettes-sucrees','Sucré')
    string = string.replace('recettes-de-pains','Pains')
    string = string.replace('regimes-speciaux','Régimes spéciaux')

    if (string[1] === string[1].toLowerCase){

        string = string[1].toUpperCase() + string[2,string.length]
        if (string[string.length] != 's'){
            string += 's'
        }
    }
    return string


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
        entry=treatEntry(bar.value)
        displayResults(results.results,0)
        refreshFav()
        recipenext.forEach(button =>{
            button.removeAttribute('hidden')
        })
        recipeprev.forEach(button =>{
            button.removeAttribute('hidden')
        })
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
        properties.textContent = treatKeywords(properties.textContent)
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
    if (stringfav.length > 10)
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
    }
    favRecipes.recipes = favRecipes.recipes.filter((v,i,a)=>a.findIndex(v2=>(v2.name===v.name))===i)
}
async function grabRecipes(string, amount=amount, vg=0, sauce=0){
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
    await fetch(`https://calm-sierra-13075.herokuapp.com/https://thawing-taiga-23689.herokuapp.com/recipes/${string}/${vg}/${amount}`)
        .then(response => response.json())
        .then(json => recipesFiltered= json);
    console.log(recipesFiltered)
    return recipesFiltered
}

let NB_RESULTS =12
let results = []
let vegetarianWords = ['ham','meat','chicken','lamb','bacon','fish','rib','beef','pork','ribs','shrimp','salmon','meatballs','meatloaf','meatball','meatloaves','tuna','duck','prosciutto']
let saucewords = ['sauce','marinade']
let loading = document.getElementById('loading')
let amount = 240

favbutton.addEventListener('click',function(){displayFav()})

bar.addEventListener('keypress',async function (e) {
    if (e.key === 'Enter') {
        bar.setAttribute('disabled','true')
        let vg = 0
        let sauce =0
        if (saucebox.checked){
            sauce =1
        }
        loading.removeAttribute('hidden')
        pagenums.forEach(pagenum=>{
            pagenum.setAttribute('hidden','true')
        })
        box.disabled = true

        results = await grabRecipes(clean(bar.value),amount,vg,sauce)
        loading.setAttribute('hidden','true')
        localStorage.setItem('lastQuery', JSON.stringify(results));
        if (results.results.length !=0){
            recipeSpace.innerHTML = ""

            pagenums.forEach(pagenum=>{
                pagenum.removeAttribute('hidden')
                pagenum.textContent = 'Page 1/'+ Math.ceil(1+results.results.length/ NB_RESULTS)
            })
            entry=treatEntry(bar.value)
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
            recipenext.forEach(button =>{
                button.setAttribute('hidden','true')
            })
            recipeprev.forEach(button =>{
                button.setAttribute('hidden','true')
            })            
        }
        bar.value = ""
        bar.removeAttribute('disabled')
        startIndex = 0
        box.disabled = false



    }
})

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
refreshFav()

if (localStorage.getItem('lastQuery') != null) {
    results = JSON.parse(localStorage.getItem('lastQuery'))
    if (results.results.length !=0){
        startIndex = 0
        recipeSpace.innerHTML = ""

        pagenums.forEach(pagenum=>{
            pagenum.removeAttribute('hidden')
            pagenum.textContent = 'Page 1/'+ Math.ceil(1+results.results.length/ NB_RESULTS)
        })
        entry=treatEntry(bar.value)
        displayResults(results.results,0)
        recipenext.forEach(button =>{
            button.removeAttribute('hidden')
        })
        recipeprev.forEach(button =>{
            button.removeAttribute('hidden')
        })
    }
}

if (localStorage.getItem('saved') == null){
    localStorage.setItem('saved','')
}
//initialize()



