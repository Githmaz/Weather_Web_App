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

document.getElementById("darkMode-button").addEventListener("change",() => {
    const checkbox = document.getElementById('darkMode-button');
    document.body.classList.toggle("dark-theme");
    if(checkbox.checked){
        console.log("dark mode")
    }else{
        console.log("Light mode")

    }
})
