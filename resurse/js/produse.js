window.addEventListener("load", function() {
    x=100

    document.getElementById("inp-zile").onchange = function(){
        document.getElementById("infoRange").innerHTML = `(${this.value})`
    }

    document.getElementById("i_textarea").oninput = function() {
        if(!this.value.toLowerCase().trim().match(new RegExp("^[a-zA-Z\- 0-9]*$"))) {
            this.classList.add("is-invalid");
        } else {
            this.classList.remove("is-invalid");
        }
    }


    document.getElementById("filtrare").onclick = function(){
        //verificare inputuri
        condValidare = true;
        var inpNume = document.getElementById("inp-nume").value.toLowerCase().trim();
        condValidare = condValidare && inpNume.match(new RegExp("^[a-zA-Z]*$"))
        if(!condValidare){
            alert("Inputuri gresite");
            return;
        }

        var inpCategorie = document.getElementById("inp-categorie").value.toLowerCase().trim();
        var inpZile = document.getElementById("inp-zile").value;
        var radioAll = document.getElementById("toate");
        var radioT = document.getElementById("trueV");
        var radioF = document.getElementById("falseV");
        var inpDatalist = document.getElementById("i_datalist").value.toLowerCase().trim();
        var inpTextarea = document.getElementById("i_textarea").value.toLowerCase().trim();
        var inpBox = document.getElementsByClassName("inp-box");
        var numeSel = document.getElementById("i_sel_multiplu").options;


        var produse = document.getElementsByClassName("produs");
        for(let produs of produse){ 
            var cond1 = false, cond2 = false, cond3 = false, cond4 = false, cond5 = false, cond6 = false, cond7 = false, cond8 = true;
            produs.style.display = "none";
            
            let nume = produs.getElementsByClassName("val-nume")[0].innerHTML.toLowerCase().trim();
            if(nume.includes(inpNume)){
                cond1 = true;
            }

            let categorie2 = produs.getElementsByClassName("val-categorie2")[0].innerHTML.toLowerCase().trim();
            if(inpCategorie=="toate" || categorie2 == inpCategorie){
                cond2 = true;
            }

            let zile = produs.getElementsByClassName("val-zile")[0].innerHTML;
            if(zile >= inpZile){
                cond3 = true;
            }

            let verificare = produs.getElementsByClassName("val-verificare")[0].innerHTML.trim();
            if(radioAll.checked || (radioT.checked && verificare == "Cu verificare") || (radioF.checked && verificare == "Fara verificare")){
                cond4 = true;
            }

            let catGr = produs.getElementsByClassName("val-greutate")[0].innerHTML;
            if(catGr == inpDatalist || inpDatalist == ""){
                cond5 = true;
            }

            let descriere = produs.getElementsByClassName("val-descriere")[0].innerHTML.toLowerCase().trim();
            if(descriere.includes(inpTextarea)){
                cond6 = true;
            }

            let categorie = produs.getElementsByClassName("val-categorie")[0].innerHTML;
            val = "";
            for(let ch of inpBox){
                if(ch.checked){
                    val = ch.value;
                    if(val == categorie){
                        cond7 = true;
                    }
                }
            }

            // var n="";
            // for(let num of numeSel){
            //     if(num.selected){
            //         n += num.value.toLowerCase() +" ";
            //     }
            // }


            if(cond1 && cond2 && cond3 && cond4 && cond5 && cond6){
                produs.style.display = "block";
            }


        }
    }

    document.getElementById("resetare").onclick = function(){
        //resetare produse
        var produse = document.getElementsByClassName("produs");
        for(let produs of produse){ 
            produs.style.display = "block";
        }
        //resetare filtre
        document.getElementById("inp-nume").value = "";
        document.getElementById("sel-toate").selected = true;
        document.getElementById("inp-zile").value = document.getElementById("inp-zile").min;
        document.getElementById("infoRange").innerHTML = "(" + document.getElementById("inp-zile").value + ")";
        document.getElementById("toate").checked = true;
        document.getElementById("i_datalist").value="";
        document.getElementById("i_textarea").value="";
        for(box of document.getElementsByClassName("inp-box")){
            box.checked = false;
        }
        for(let n of document.getElementById("i_sel_multiplu").options){
            n.selected = false;
        }

    }

    function sorteaza(semn){
        var produse = document.getElementsByClassName("produs");
        var v_produse = Array.from(produse);

        v_produse.sort(function(a, b){
            var c1_a = parseFloat(a.getElementsByClassName("val-pret")[0].innerHTML)/(a.getElementsByClassName("val-zile")[0].innerHTML);
            var c1_b = parseFloat(b.getElementsByClassName("val-pret")[0].innerHTML)/(b.getElementsByClassName("val-zile")[0].innerHTML);
            if(c1_a == c1_b){
                var c2_a = a.getElementsByClassName("val-categorie2")[0].innerHTML;
                var c2_b = b.getElementsByClassName("val-categorie2")[0].innerHTML;
                return semn * c2_a.localeCompare(c2_b);
            }
            return (c1_a - c1_b) * semn;
        })
        for(let produs of v_produse){ 
            produs.parentNode.appendChild(produs);
        }
    }

    document.getElementById("sortCrescNume").onclick = function(){
        sorteaza(1);
    }
    document.getElementById("sortDescrescNume").onclick = function(){
        sorteaza(-1);
    }


    document.getElementById("calculare").onclick = function(){
        var produse = document.getElementsByClassName("produs");
        let suma = 0, nrProd = 0;
        for(let prod of produse) {
            if(prod.style.display != "none"){
                suma += parseFloat(prod.getElementsByClassName("val-pret")[0].innerHTML)
                nrProd += 1;
            }
        }
        media = suma / nrProd;

        if(!document.getElementById("rezultat")) {
            rezultat = document.createElement("div");
            rezultat.id = "rezultat";
            rezultat.innerHTML = "Media preturilor: " + media;
            var ps = document.getElementById("butoane");
            ps.parentNode.insertBefore(rezultat, ps);
            rezultat.style = `
                position: fixed;
                top:250px;
                right:300px;
            `
            setTimeout(function(){
                document.getElementById("rezultat").remove();
            }, 2000);
        }
    }




    window.onkeydown=function(e){
        console.log(e);
        if(e.key == 'c' && e.altKey){
            var produse = document.getElementsByClassName("produs");
            let suma = 0;
            for(let prod of produse){
                if(prod.style.display != "none")
                    suma += parseFloat(prod.getElementsByClassName("val-pret")[0].innerHTML);
            }
            if(!document.getElementById("rezultat")) {
                rezultat = document.createElement("p");
                rezultat.id = "rezultat";
                rezultat.innerHTML = "<b>Pret total:</b> " + suma;
                // document.getElementById("produse").appendChild(rezultat);
                var ps = document.getElementById("p-suma");
                ps.parentNode.insertBefore(rezultat, ps.nextSibling);

                rezultat.style.border = "1px solid purple";
                rezultat.onclick = function(){
                    this.remove();
                }
                setTimeout(function(){
                    document.getElementById("rezultat").remove();
                }, 2000);
            }   
        }
    }
});