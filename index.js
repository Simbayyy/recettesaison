const recipeButton = document.querySelector("#recipebutton");
const recipeHolder = document.querySelector("#recipeholder");

recipeButton.addEventListener('click', () => grabPage('blette'));

const grabPage = function(string){
    url = `https://www.marmiton.org/recettes/recherche.aspx?aqt=${string}`
    const html = fetch(url, 
        {
            method: "GET", 
        }
    ).then(response => response.json())
    .then(data => {
        const doc = new DOMParser().parseFromString(html, 'text/html');
        recipeHolder.textContent=doc.title;
        })
    .catch((err) => {
        console.log(err)
    })    ; // html as text

}
function getSourceAsDOM(url)
{
    xmlhttp=new XMLHttpRequest();
    xmlhttp.open("GET",url,false);
    xmlhttp.send();
    parser=new DOMParser();
    return parser.parseFromString(xmlhttp.responseText,"text/html");      
}