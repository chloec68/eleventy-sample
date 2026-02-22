// création d'une classe (=> mémorisation de propriétés, conservation de l'état de la box)
class Lightbox {
    // création d'une méthode statique qui permettra d'initialiser la box
    // objectif : ajouter un "comportement" aux liens permettant d'ouvrir les imgs  
    static init () {
        //je sélectionne tous les liens qui mènent à une image 
        const links = document.querySelectorAll('.lightbox-trigger');
        // pour chaque lien, j'ajoute un écouteur d'évènement ;
        // ainsi à chaque clique, une fonction sera déclenchée une fonction qui prend en paramètre un évènement e
     
        links.forEach(link => link.addEventListener('click', e => 
        {   
            e.preventDefault() //permet de stoper le comportement par défaut sur chaque évènement
            new Lightbox(e.currentTarget.getAttribute('href')) //initialisation d'une nouvelle lightbox à chaque clique d'un lien photo
            // e.currenTarget.getAttribute('href') => permet de récuperer le path de la photo cliquée
        }))

    }

    // un constructeur qui prend un url {string} en paramètre 
    constructor (url) {
        this.element = this.buildDom(url);
        this.loadImage(url);
        document.body.appendChild(this.element); //ajout de l'élément qui est la lightbox
    }

    //je crée une nouvelle fonction 
    loadImage (url){
        const image = new Image();
        const container = this.element.querySelector('.lightbox__container');
        const loader = document.createElement('div');
        loader.classList.add('lightbox__loader');
        container.appendChild(loader);
        image.onload = function(){
            container.removeChild(loader);
            container.appendChild(image);
        }
        image.src = url

    }

    // une autre méthode qui prend un url {string} en paramètre et retournera un élément HTML
    buildDom(url){
        // je crée une div 
        const dom = document.createElement('div');
        // j'attribue une classe à la div 
        dom.classList.add('lightbox'); 
        // je modifie l'HTML présent dans la div 
        dom.innerHTML = `<button class="lightbox__close">Fermer</button>
        <button class="lightbox__next">Suivant</button>
        <button class="lightbox__prev">Précédent</button>
        <div class="lightbox__container"></div>`;

        return dom;
    }
}
   
// Dès le début du chargement de la page, on demande l'initialisation de la lightbox : 
Lightbox.init()
   
   
   
   
   
   