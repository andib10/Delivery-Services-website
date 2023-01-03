//setCookie("a", 10, 1000)
//timpExpirare in milisecunde
function setCookie(nume, val, timpExpirare){
    d = new Date();
    d.setTime(d.getTime() + timpExpirare)
    document.cookie = `${nume} = ${val}; expires = ${d.toUTCString()}`
}

function getCookie(nume){
    vectorParametri = document.cookie.split(";")
    for(let param of vectorParametri){
        if(param.trim().startsWith(nume+"="))
            return param.split("=")[1]
    }
    return null;
}

function deleteCookie(nume){
    document.cookie = `${nume}=0; expires = ${(new Date()).toUTCString()}`
}

function deleteAllCookies() {
    allCookies = document.cookie.split(';');
    for (cookie of allCookies) {
        numeCookie = cookie.split('=')[0].trim();
        deleteCookie(numeCookie);
    }
}

window.addEventListener("load", function(){
    if(getCookie("acceptat_banner")){
        document.getElementById("banner").style.display="none";
    }
    this.document.getElementById("ok_cookies").onclick=function(){
        setCookie("acceptat_banner", true, 60000);
        document.getElementById("banner").style.display="none";

    }
})