const recipenext = document.querySelectorAll(".recipenext");
const recipeprev = document.querySelectorAll(".recipeprev");
const recipeHolder = document.querySelector("#recipeholder");

//recipeButton.addEventListener('click', () => grabPage('blette'));

const grabPage = function(string){
    url = `https://www.marmiton.org/recettes/recherche.aspx?aqt=${string}`
    x=new XMLHttpRequest();
    x.open('GET', 'https://calm-sierra-13075.herokuapp.com/'+url);
    x.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
    x.onload = function() {
        parser=new DOMParser();
        page = parser.parseFromString(x.responseText,"text/html");  
        recipes = page.querySelectorAll('.gACiYG');
        recipes.forEach((recipe) =>{
            recipeHolder.textContent += 'success'
            recipeHolder.textContent += '<br>' + recipe.getAttribute('href')
        })
        };
    x.send();
     
}
bar = document.getElementById('inputbar')
box = document.getElementById('vegetarian')
saucebox = document.getElementById('sauce')

let chocolateRecipes 
let randlist = []
let startIndex

async function grabList(){
    let recipes
    await fetch("RecipeList.json")
        .then(response => response.json())
        .then(json => recipes= json);
    document.getElementById('inputbar').disabled = false;
    return recipes
}

let sort =  function(listToSort,keyword){
    return listToSort.filter(function(recipe){
        if (Array(keyword)[0] === keyword){
            ok = true;
            keyword.forEach(word =>{
                if (ok == true){
                    ok = (cleanWord(' '+recipe.name+' ').includes(' '+cleanWord(word)+' '))
                }
            })
            return ok;
        }else{
            return (cleanWord(recipe.name).includes(cleanWord(keyword)));
        }
    });
}

let sortExcept =  function(listToSort,keyword){
    return listToSort.filter(function(recipe){
        ok = true;
        if (Array(keyword)[0] === keyword){
            keyword.forEach(word =>{
                if (ok == true){
                    ok = !(cleanWord(' '+recipe.name+' ').includes(' '+cleanWord(word)+' '))
                }
            })
            return ok;
        }else{
            return !(cleanWord(recipe.name).includes(keyword));
        }
    });
}

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

let createEntry2 = async function(recipe){
    newRecipeContainer = document.createElement('a')
    newRecipeContainer.setAttribute('class','recipecontainer')

    newRecipeName = document.createElement('div')
    
    newRecipeName.setAttribute('class','recipename')
    newRecipeName.textContent = decodeHtml(recipe['name'])
    newRecipeProperties = document.createElement('div')
    newRecipeProperties.setAttribute('class','recipeprop')

    if (recipe.keyword != null){
        newRecipeProperties.textContent = recipe.keyword.join(', ')
    }
    newRecipeContainer.setAttribute('href',recipe['url'])


    newRecipeContainer.appendChild(newRecipeName)
    newRecipeContainer.appendChild(newRecipeProperties)
    

    recipeSpace.appendChild(newRecipeContainer)
}
/*let createEntry = async function(recipe,i){
    newRecipeContainer = document.createElement('div')
    newRecipeContainer.setAttribute('class','recipeContainer')
    newRecipeContainer.setAttribute('id','container'+i)

    newRecipeName = document.createElement('div')
    
    newRecipeName.setAttribute('class','recipeName')
    newRecipeName.setAttribute('id','name'+i)
    newRecipeName.textContent = recipe['name']
    newRecipePanel = document.createElement('div')
    newRecipePanel.setAttribute('class','recipePanel')
    newRecipePanel.setAttribute('id','panel'+i)
    newRecipePanel.setAttribute('hidden','true')

    newRecipeLink = document.createElement('a')
    newRecipeLink.setAttribute('href',recipe['url'])
    newRecipeLink.setAttribute('class','recipelink')
    newRecipeLink.textContent = 'Lien vers la recette'

    newRecipeTime = document.createElement('div')
    newRecipeTime.setAttribute('class','recipetime')

    if ((recipe.hasOwnProperty("prepTime")) && (recipe.prepTime != null)){
        prepTime = recipe["prepTime"].replace('PT','').replace('M',' minutes ').replace('H', ' heures')+''
    }else{
        prepTime = 'Pas '
    }
    if ((recipe.hasOwnProperty("cookTime")) && (recipe.cookTime != null)){
        cookTime = recipe["cookTime"].replace('PT','').replace('M',' minutes ').replace('H', ' heures')+''
    }else{
        cookTime = 'pas '
    }

    if (recipe.hasOwnProperty("ingredients")){
        ingredientList = recipe['ingredients']
    }else{
        ingredientList = [["Pas d'ingrédients disponibles pour cette recette", ""]]
    }

    newRecipeIngredients = document.createElement('div')
    newRecipeIngredients.setAttribute('class','ingredientlist')

    ingredientList.forEach(ingredient => {
        newRecipeIngredient = document.createElement('div')
        newRecipeIngredient.setAttribute('class','ingredient')
        newRecipeIngredient.textContent = ingredient[0].replace('tsp','càc').replace('tbsp','càs') + ' ' + ingredient[1]
        newRecipeIngredients.appendChild(newRecipeIngredient)
    })

    newRecipeTime.textContent = `${prepTime}de préparation et ${cookTime}de cuisson`

    newRecipeName.addEventListener("click", function(){
        panel = document.getElementById('panel'+i)
        if (panel.getAttribute('hidden') == 'true'){
            panel.removeAttribute('hidden')
        }else{
            panel.setAttribute('hidden', 'true')
        }
    })


    newRecipePanel.appendChild(newRecipeLink)
    newRecipePanel.appendChild(newRecipeTime)
    newRecipePanel.appendChild(newRecipeIngredients)
    newRecipeContainer.appendChild(newRecipeName)
    newRecipeContainer.appendChild(newRecipePanel)
    

    recipeSpace.appendChild(newRecipeContainer)
}*/

let clean = function(string){
    return encodeURIComponent(string.toLowerCase())
}

async function grabRecipes(string, amount=100, vg=0, sauce=0){
    
    var myHeaders = new Headers()
    myHeaders.append("Content-Type", "application/x-www-form-urlencoded")
    requestParams = {
        method: 'POST',
        headers: myHeaders,
        amount:amount,
        vg:vg
    }
    let recipesFiltered
    await fetch(`https://calm-sierra-13075.herokuapp.com/https://thawing-taiga-23689.herokuapp.com/recipes/${string}/${vg}/${sauce}`)
        .then(response => response.json())
        .then(json => recipesFiltered= json);
    console.log(recipesFiltered)
    return recipesFiltered
}

let NB_RESULTS =12
let results = []
let vegetarianWords = ['ham','meat','chicken','lamb','bacon','fish','rib','beef','pork','ribs','shrimp','salmon','meatballs','meatloaf','meatball','meatloaves','tuna','duck','prosciutto']
let saucewords = ['sauce','marinade']

bar.addEventListener('keypress',async function (e) {
    if (e.key === 'Enter') {
        bar.setAttribute('disabled','true')
        let vg = 0
        let sauce =0
        if (box.checked){
            vg =1
        }
        if (saucebox.checked){
            sauce =1
        }
        results = await grabRecipes(clean(bar.value), vg=vg,sauce=sauce)
        entry=treatEntry(bar.value)
        bar.value = ""
        bar.removeAttribute('disabled')
        recipeSpace.innerHTML = ""
        startIndex = 0
        displayResults(results.results,0)
        recipenext.forEach(button =>{
            button.removeAttribute('hidden')
        })
        recipeprev.forEach(button =>{
            button.removeAttribute('hidden')
        })

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

//initialize()



