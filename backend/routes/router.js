const express = require("express");
const routerApp = express.Router();

//importa controllers
const appAnimal = require("../apps/animal/controller/ctlAnimal");
const appAlocado = require("../apps/alocado/controller/ctlAlocado");
const appLogin = require("../apps/login/controller/ctlLogin");

    routerApp.use((req, res, next) => {
    next();
    });

    routerApp.get("/", (req, res) => {
    res.send("Olá mundo!");
    });

    //@ Rotas de Animal
    routerApp.get("/getAllAnimal", appLogin.AutenticaJWT, appAnimal.GetAllAnimal);
    routerApp.get("/getAnimalByID/:animalid", appLogin.AutenticaJWT, appAnimal.GetAnimalByID);
    routerApp.post("/insertAnimal", appLogin.AutenticaJWT, appAnimal.InsertAnimal);
    routerApp.put("/updateAnimal/:animalid", appLogin.AutenticaJWT, appAnimal.UpdateAnimal);
    routerApp.delete("/deleteAnimal/:animalid", appLogin.AutenticaJWT, appAnimal.DeleteAnimal);

    //@ Rotas de Alocado
    routerApp.get("/getAllAlocado", appLogin.AutenticaJWT, appAlocado.GetAllAlocado);
    routerApp.get("/getAlocadoByID/:alocadoid", appLogin.AutenticaJWT, appAlocado.GetAlocadoByID);
    routerApp.post("/insertAlocado", appLogin.AutenticaJWT, appAlocado.InsertAlocado);
    routerApp.put("/updateAlocado/:alocadoid", appLogin.AutenticaJWT, appAlocado.UpdateAlocado);
    routerApp.delete("/deleteAlocado/:alocadoid", appLogin.AutenticaJWT, appAlocado.DeleteAlocado);

    // Rota Login
    routerApp.post("/Login", appLogin.Login);
    routerApp.post("/Logout", appLogin.Logout);


    module.exports = routerApp;
