const express = require("express");
const fs = require("fs");

const sharp = require("sharp");
const {Client} = require("pg");
const ejs= require("ejs");
const sass = require("sass");
var cssBootstrap = sass.compile(__dirname + "/resurse/scss/customizare-bootstrap.scss",{sourceMap:true});
fs.writeFileSync(__dirname + "/resurse/css/biblioteci/bootstrap-custom.css", cssBootstrap.css); 

var client = new Client({database:"laborator",
        user:"andi", 
        password:"andi", 
        host:"localhost", 
        port:5432});
client.connect();

client.query("select * from unnest(enum_range(null::locatie_exp))", function(err, rez){
    if(err)
        console.log(err);
    else    
        console.log(rez);
});

app = express();

app.set("view engine", "ejs");

app.use("/resurse", express.static(__dirname + "/resurse"));
app.use("/node_modules", express.static(__dirname + "/node_modules"));

obGlobal={
    erori:null,
    imagini:null
}

app.use("/*", function(req, res, next){
    client.query("select * from unnest(enum_range(null::categ_colet))", function(err, rezCateg){
        if(err){
            console.log(err);
            renderError(res, 2);
        } else {
            res.locals.optiuniMeniu = rezCateg.rows;
            next();
        }
    })
})

function createImages() {
    var continutFisier = fs.readFileSync(__dirname + "/resurse/json/galerie.json").toString("utf-8");
    var obiect = JSON.parse(continutFisier);
    var dim_mediu = 300;
    var dim_mic = 150;

    obGlobal.imagini = obiect.imagini;
    obGlobal.imagini.forEach(function(elem) {
        [numeFisier, extensie] = elem.fisier.split(".")
        if(!fs.existsSync(obiect.cale_galerie + "/mediu/")) {
            fs.mkdirSync(obiect.cale_galerie + "/mediu/")
        }
        elem.fisier_mediu = obiect.cale_galerie + "/mediu/" + numeFisier + ".webp"
        elem.fisier = obiect.cale_galerie + "/" + elem.fisier;
        sharp(__dirname + "/" + elem.fisier).resize(dim_mediu).toFile(__dirname + "/" + elem.fisier_mediu)

        if(!fs.existsSync(obiect.cale_galerie + "/mic/")) {
            fs.mkdirSync(obiect.cale_galerie + "/mic/")
        }
        elem.fisier_mic = obiect.cale_galerie + "/mic/" + numeFisier + ".webp"
        sharp(__dirname + "/" + elem.fisier).resize(dim_mic).toFile(__dirname + "/" + elem.fisier_mic)
    })
    console.log(obGlobal.imagini); 

    
}
createImages();

function createErrors(){
    var continutFisier = fs.readFileSync(__dirname + "/resurse/json/erori.json").toString("utf-8");
    obGlobal.erori = JSON.parse(continutFisier);
    
}
createErrors();

function renderError(res, identificator, titlu, text, imagine){
    var eroare = obGlobal.erori.info_erori.find(function(elem){
        return elem.identificator == identificator;
    })
    titlu = titlu || (eroare && eroare.titlu) || obGlobal.erori.eroare_default.titlu;
    text = text || (eroare && eroare.text) || obGlobal.erori.eroare_default.text;
    imagine = imagine || (eroare && obGlobal.erori.cale_baza + "/" + eroare.imagine) || obGlobal.erori.cale_baza + "/" + obGlobal.erori.eroare_default.imagine;

    if(eroare && eroare.status){
        res.status(identificator).render("pagini/eroare", {titlu:titlu, text:text, imagine:imagine})
    } 
    else{
        res.render("pagini/eroare", {titlu:titlu, text:text, imagine:imagine})
    }
}


app.get(["/", "/index", "/home"], function(req, res) {
    // res.sendFile(__dirname + "/index.html");
    res.render("pagini/index", {ip: req.ip, imagini:obGlobal.imagini});
});

app.get("/produse", function(req, res) {
    client.query("select * from unnest(enum_range(null::locatie_exp))", function(err, rezLocatie){
        client.query("select nume from colete", function(err, rezNume){
            client.query("select * from unnest(enum_range(null::greutate_cat))", function(err, rezGreut){
                client.query("select min(zile_livrare), max(zile_livrare) from colete", function(err, rezZile){
                    continuareQuery = ""
                    if(req.query.tip)
                        continuareQuery += ` and categorie='${req.query.tip}'`   //"tip='"+req.query.tip+"'"
                    client.query("select * from colete where 1=1 " + continuareQuery, function(err, rez){
                        if(err) {
                            console.log(err);
                            renderError(res, 2);
                        } 
                        else   
                            res.render("pagini/produse", {
                                produse:rez.rows, 
                                optiuni:res.locals.optiuniMeniu, 
                                tipLocatie:rezLocatie.rows,
                                zileLivrare:rezZile.rows[0],
                                catGreutate:rezGreut.rows,
                                nume:rezNume.rows
                            });
                    });
                })
            })
        })
              
    });
    
});

app.get("/produs/:id", function(req, res) {
    client.query("select * from colete where id="+req.params.id, function(err, rez){
        if(err) {
            console.log(err);
            renderError(res, 2);
        } 
        else   
            res.render("pagini/produs", {prod:rez.rows[0]});
    });
});

app.get("/*.ejs", function(req, res) {
    renderError(res, 403);
});

app.get("/*", function(req, res) {
    res.render("pagini" + req.url, function(err, rezRandare){
        // console.log("Eroare", err);
        // console.log("Rezultat randare", rezRandare);

        if(err){
            if(err.message.includes("Failed to lookup view")){
                renderError(res, 404, "Eroare 404");
            }
                
            else{

            }
        }
        else{
            res.send(rezRandare);
        }
    });
});


app.listen(8080);
console.log("Serverul a pornit");