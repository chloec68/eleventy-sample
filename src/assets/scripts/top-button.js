
window.onscroll = function(){scrollFunction()};

function scrollFunction(){
    const topButton = document.getElementById("top-button");
    if(document.body.scrollTop > 500 || document.documentElement.scrollTop > 500){
        topButton.style.display = "block";
    }else{
        topButton.style.display = "none" ;
    }
}

function topFunction(){
    document.body.scrollTop = 0; //for Safari
    document.documentElement.scrollTop = 0 ; //for Chrome, Firefox, Opera, IE 
}