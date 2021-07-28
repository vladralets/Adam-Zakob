let burger = document.querySelector("#navToggle");
let navigation = document.querySelector(".dropdown")

burger.addEventListener("click", function(event){
        event.preventDefault();
        burger.classList.toggle("active");
        navigation.classList.toggle("active");
        
 });
  