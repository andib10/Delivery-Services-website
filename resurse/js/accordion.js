window.addEventListener("DOMContentLoaded", function() {
    accord = document.getElementsByClassName("accordion-collapse");

    for(let acc of accord){
        let ok = false;
        let buton = acc.parentElement.getElementsByClassName("accordion-button")[0];

        if(localStorage.getItem(acc.id) == "true") {
            acc.classList.add("show");
            buton.classList.remove("collapsed");
            buton.ariaExpanded = "true";
            ok = true;
        }

        buton.addEventListener("click", function() {
            if(ok) {
                localStorage.removeItem(acc.id);
            } else {
                localStorage.setItem(acc.id, "true");
            }
            ok = !ok;
        });
    }
});