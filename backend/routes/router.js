const express = require("express");
const routerApp = express.Router();

//importa controllers
const appAnimal = require("../apps/animal/controller/ctlAnimal");
const appAlocado = require("../apps/alocado/controller/ctlAlocado");
const appLogin = require("../apps/login/controller/ctlLogin");
const appPiquete = require("../apps/piquete/controller/ctlPiquete");
const appPasto = require("../apps/pasto/controller/ctlPasto");

    routerApp.use((req, res, next) => {
    next();
    });

    routerApp.get("/", (req, res) => {
    res.send("Olá mundo!");
    });

    //@ Rotas de Animal
    routerApp.get("/getAllAnimais", appLogin.AutenticaJWT, appAnimal.GetAllAnimal);
    routerApp.get("/getAnimalByID/:animalid", appLogin.AutenticaJWT, appAnimal.GetAnimalByID);
    routerApp.post("/insertAnimal", appLogin.AutenticaJWT, appAnimal.InsertAnimal);
    routerApp.put("/updateAnimal/:animalid", appLogin.AutenticaJWT, appAnimal.UpdateAnimal);
    routerApp.delete("/deleteAnimal/:animalid", appLogin.AutenticaJWT, appAnimal.DeleteAnimal);

    //@ Rotas de Alocado
    routerApp.get("/getAllAlocados", appLogin.AutenticaJWT, appAlocado.GetAllAlocado);
    routerApp.get("/getAlocadoByID/:alocadoid", appLogin.AutenticaJWT, appAlocado.GetAlocadoByID);
    routerApp.post("/insertAlocado", appLogin.AutenticaJWT, appAlocado.InsertAlocado);
    routerApp.put("/updateAlocado/:alocadoid", appLogin.AutenticaJWT, appAlocado.UpdateAlocado);
    routerApp.delete("/deleteAlocado/:alocadoid", appLogin.AutenticaJWT, appAlocado.DeleteAlocado);

    // Rota Login
    routerApp.post("/Login", appLogin.Login);
    routerApp.post("/Logout", appLogin.Logout);


    //rota Piquete
    routerApp.get("/getAllPiquetes", appLogin.AutenticaJWT, appPiquete.GetAllPiquetes);
    routerApp.get("/getPiqueteByID/:piqueteid", appLogin.AutenticaJWT, appPiquete.GetPiqueteByID);
    routerApp.post("/insertPiquete", appLogin.AutenticaJWT, appPiquete.InsertPiquete);
    routerApp.put("/updatePiquete/:piqueteid", appLogin.AutenticaJWT, appPiquete.UpdatePiquete);
    routerApp.delete("/deletePiquete/:piqueteid", appLogin.AutenticaJWT, appPiquete.DeletePiquete);

    //rota Pasto
    routerApp.get("/getAllPastos", appLogin.AutenticaJWT, appPasto.GetAllPastos);
    routerApp.get("/getPastoByID/:pastoid", appLogin.AutenticaJWT, appPasto.GetPastoByID);
    routerApp.post("/insertPasto", appLogin.AutenticaJWT, appPasto.InsertPasto);
    routerApp.put("/updatePasto/:pastoid", appLogin.AutenticaJWT, appPasto.UpdatePasto);
    routerApp.delete("/deletePasto/:pastoid", appLogin.AutenticaJWT, appPasto.DeletePasto);

    module.exports = routerApp;
