var menuList = document.getElementById("menuListw");
let menuBtn = document.getElementById("btn-menu");

menuList.style.right = "-100%"

menuBtn.addEventListener("click",()=>{
    if(menuList.style.right== "-100%"){
        menuList.style.right = "0px"
    }else{
        menuList.style.right = "-100%"
    }
    menuBtn.classList.toggle("change");
});

