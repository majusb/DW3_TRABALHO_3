const mdlAnimal = require("../model/mdlAnimal");

const GetAllAnimal = (req, res) =>
(async () => {
    let registro = await mdlAnimal.GetAllAnimal();
    res.json({ status: "ok", "registro": registro });
})();

const GetAnimalByID = (req, res) =>
(async () => {
    const idAnimal = parseInt(req.params.animalid);
    let registro = await mdlAnimal.GetAnimalByID(idAnimal);

    res.json({ status: "ok", "registro": registro });
})();

const InsertAnimal = (request, res) =>
(async () => {
    const animalREG = request.body;
    let { msg, linhasAfetadas } = await mdlAnimal.InsertAnimal(animalREG);
    res.json({ "status": msg, "linhasAfetadas": linhasAfetadas });
})();

const UpdateAnimal = (request, res) =>
(async () => {
    const idAnimal = parseInt(request.params.animalid);
    const animalREG = request.body;
    let { msg, linhasAfetadas } = await mdlAnimal.UpdateAnimal(idAnimal, animalREG);
    res.json({ "status": msg, "linhasAfetadas": linhasAfetadas });
})();

const DeleteAnimal = (request, res) =>
(async () => {
    const idAnimal = parseInt(request.params.animalid);
    let { msg, linhasAfetadas } = await mdlAnimal.DeleteAnimal(idAnimal);
    res.json({ "status": msg, "linhasAfetadas": linhasAfetadas });
})();

module.exports = {
    GetAllAnimal,
    GetAnimalByID,
    InsertAnimal,
    UpdateAnimal,
    DeleteAnimal,
};
