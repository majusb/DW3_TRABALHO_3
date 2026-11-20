    const mdlPiquete = require("../model/mdlPiquete");

    const GetAllPiquetes = (req, res) =>
    (async () => {
        let registro = await mdlPiquete.GetAllPiquete();
        res.json({ status: "ok", "registro": registro });
    })();

    const GetPiqueteByID = (req, res) =>
    (async () => {
        const idPiquete = parseInt(req.params.piquetoid);
        let registro = await mdlPiquete.GetPiqueteByID(idPiquete);

        res.json({ status: "ok", "registro": registro });
    })();

    const InsertPiquete = (request, res) =>
    (async () => {
        const piqueteREG = request.body;
        let { msg, linhasAfetadas } = await mdlPiquete.InsertPiquete(piqueteREG);
        res.json({ "status": msg, "linhasAfetadas": linhasAfetadas });
    })();

    const UpdatePiquete = (request, res) =>
    (async () => {
        const idPiquete = parseInt(request.params.piquetoid);
        const piqueteREG = request.body;
        let { msg, linhasAfetadas } = await mdlPiquete.UpdatePiquete(idPiquete, piqueteREG);
        res.json({ "status": msg, "linhasAfetadas": linhasAfetadas });
    })();

    const DeletePiquete = (request, res) =>
    (async () => {
        const idPiquete = parseInt(request.params.piqueteid);
        let { msg, linhasAfetadas } = await mdlPiquete.DeletePiquete(idPiquete);
        res.json({ "status": msg, "linhasAfetadas": linhasAfetadas });
    })();

    module.exports = {
    GetAllPiquetes,
    GetPiqueteByID,
    InsertPiquete,
    UpdatePiquete,
    DeletePiquete,
    };