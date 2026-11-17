const mdlAlocado = require("../model/mdlAlocado");

const GetAllAlocado = (req, res) =>
(async () => {
    let registro = await mdlAlocado.GetAllAlocado();
    res.json({ status: "ok", "registro": registro });
})();

const GetAlocadoByID = (req, res) =>
(async () => {
    const idAlocado = parseInt(req.params.alocadoid);
    let registro = await mdlAlocado.GetAlocadoByID(idAlocado);

    res.json({ status: "ok", "registro": registro });
})();

const InsertAlocado = (request, res) =>
(async () => {
    const alocadoREG = request.body;
    let { msg, linhasAfetadas } = await mdlAlocado.InsertAlocado(alocadoREG);
    res.json({ "status": msg, "linhasAfetadas": linhasAfetadas });
})();

const UpdateAlocado = (request, res) =>
(async () => {
    const idAlocado = parseInt(request.params.alocadoid);
    const alocadoREG = request.body;
    let { msg, linhasAfetadas } = await mdlAlocado.UpdateAlocado(idAlocado, alocadoREG);
    res.json({ "status": msg, "linhasAfetadas": linhasAfetadas });
})();

const DeleteAlocado = (request, res) =>
(async () => {
    const idAlocado = parseInt(request.params.alocadoid);
    let { msg, linhasAfetadas } = await mdlAlocado.DeleteAlocado(idAlocado);
    res.json({ "status": msg, "linhasAfetadas": linhasAfetadas });
})();

module.exports = {
    GetAllAlocado,
    GetAlocadoByID,
    InsertAlocado,
    UpdateAlocado,
    DeleteAlocado,
};
