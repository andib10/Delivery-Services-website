window.addEventListener("DOMContentLoaded", function() {
    window.onresize = function() {
        if (window.innerWidth > 700) {
            document.getElementById('ch-menu').checked = false;

            var submeniu = document.querySelectorAll('ul.meniu ul');
            for (var i = 0; i < submeniu.length; i++) {
                submeniu[i].style.display = "none";
            }
        }
    }
});