/**
 * @property {HTMLElement} element
 * @property {string[]} images --Chemin des images de la lightbox
 * @property {string} url --Image actuellement affichée
 * création d'une classe (=> mémorisation de propriétés, conservation de l'état de la box)
 */

class Lightbox {
    // création d'une méthode statique qui permettra d'initialiser la box
    // objectif : ajouter un "comportement" aux liens permettant d'ouvrir les imgs  
    static init () {
        //je sélectionne tous les liens qui mènent à une image 
        // Je convertis la séquence intérable qu'est la NodeList contenue dans la constante links en Array
        const links = Array.from(document.querySelectorAll('.lightbox-trigger'));
        // je crée une variable qui va stocker le chemin des images 
        // la méthode map() des instances de Array crée un nouveau tableau rempli avec les résultats
        //de l'appel d'une focntion fournie sur chaque éléméent du tableau appelant 
        const gallery = links.map(link => link.getAttribute('href'))       
        // pour chaque lien, j'ajoute un écouteur d'évènement ;
        // ainsi à chaque clique, une fonction sera déclenchée une fonction qui prend en paramètre un évènement e
        links.forEach(link => link.addEventListener('click', e => 
        {   
            e.preventDefault() //permet de stoper le comportement par défaut sur chaque évènement
            new Lightbox(e.currentTarget.getAttribute('href'), gallery) //initialisation d'une nouvelle lightbox à chaque clique d'un lien photo
            // e.currenTarget.getAttribute('href') => permet de récuperer le path de la photo cliquée
            //gallery => va permettre la comparaison ?
        }))

    }

/*
* 
* @param {string} url -- URL de l'image
* @param {string[]} images -- Chemin des images de la lightbox 
* un constructeur qui prend un url {string} en paramètre 
*/ 
constructor (url, images) {
    this.element = this.buildDom(url);
    this.images = images ;
    this.loadImage(url);
    this.onKeyUp = this.onKeyUp.bind(this);
    document.body.appendChild(this.element); //ajout de l'élément qui est la lightbox
    document.addEventListener('keyup', this.onKeyUp.bind(this));
}

//je crée une nouvelle fonction 
loadImage (url){
    this.url = null;
    const image = new Image();
    const container = this.element.querySelector('.lightbox__container');
    const loader = document.createElement('div');
    loader.classList.add('lightbox__loader');
    container.innerHTML = '';
    container.appendChild(loader);
    image.onload = () => {
        container.removeChild(loader);
        container.appendChild(image);
        this.url = url;
    }
    image.src = url;

}

/**
 * 
 * @param {KeyboardEvent} e 
 */

onKeyUp (e) {
    if (e.key == 'Escape'){
        this.close(e)
    }else if (e.key == "ArrowLeft"){
        this.prev(e);
    }else if (e.key == "ArrowRight"){
        this.next(e);
    }
}

/**
 * Ferme la lightbox
 * @param {MouseEvent/KeyboardEvent} e 
 */
close (e){
    e.preventDefault();
  
    this.element.classList.add('fadeOut');
    // la méthode globale setTimeout() de l'interface Window (l'objet window représente la fenêtre du navigateur) permet d'exécuter une fonction à l'expiration d'un certain délai
    window.setTimeout(() => {
        this.element.remove();
    }, 500)
    document.removeEventListener('keyup', this.onKeyUp);
}

/**
 * passe à l'image suivante
 * @param {MouseEvent/KeyboardEvent} e 
 */
next (e){
    e.preventDefault()
    let i = this.images.findIndex(i => i == this.url);
    if (i == this.images.length-1){
        i = -1;
    }
    this.loadImage(this.images[i + 1]);
}

/**
 * passe à l'image précédente
 * @param {MouseEvent/KeyboardEvent} e 
 */
prev (e){
    e.preventDefault()
    let i = this.images.findIndex(i => i == this.url);
    if (i == 0){
        i = this.images.length ;
    }
    this.loadImage(this.images[i - 1]);
   
}

    // une autre méthode qui prend un url {string} en paramètre et retournera un élément HTML
    buildDom(url){
        // je crée une div 
        const dom = document.createElement('div');
        // j'attribue une classe à la div 
        dom.classList.add('lightbox'); 
        // je modifie l'HTML présent dans la div 
        dom.innerHTML = `<button class="lightbox__close"></button>
        <button class="lightbox__next"></button>
        <button class="lightbox__prev"></button>
        <div class="lightbox__container"></div>`;
        dom.querySelector('.lightbox__close').addEventListener('click', this.close.bind(this));
        dom.querySelector('.lightbox__prev').addEventListener('click', this.prev.bind(this));
        dom.querySelector('.lightbox__next').addEventListener('click', this.next.bind(this));

        return dom;
    }
}
   
// Dès le début du chargement de la page, on demande l'initialisation de la lightbox : 
Lightbox.init()
   
   
   
   
   
   