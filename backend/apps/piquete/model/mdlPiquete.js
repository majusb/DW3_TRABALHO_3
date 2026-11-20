const db = require("../../../database/databaseconfig");

const GetAllPiquetes = async () => {
    return (
        await db.query(
            "SELECT * FROM piquete WHERE removido = false ORDER BY descricao ASC"
        )
    ).rows;
};

const GetPiqueteByID = async (piqueteIDPar) => {
    return (
        await db.query(
            "SELECT * FROM piquete WHERE piqueteid = $1 AND removido = false ORDER BY descricao ASC",
            [piqueteIDPar]
        )
    ).rows;
};

const InsertPiquete = async (piqueteREGPar) => {
    let linhasAfetadas;
    let msg = "ok";
    try {
        linhasAfetadas = (
            await db.query(
                "INSERT INTO piquete (descricao, latitude, longitude, pastoidfk, removido) VALUES ($1, $2, $3, $4, $5)",
                [
                    piqueteREGPar.descricao,
                    piqueteREGPar.latitude,
                    piqueteREGPar.longitude,
                    piqueteREGPar.pastoidfk,
                    piqueteREGPar.removido
                ]
            )
        ).rowCount;
    } catch (error) {
        msg = "[mdlPiquete|InsertPiquete] " + error.detail;
        linhasAfetadas = -1;
    }

    return { msg, linhasAfetadas };
};

const UpdatePiquete = async (piqueteIDPar, piqueteREGPar) => {
    let linhasAfetadas;
    let msg = "ok";
    try {
        linhasAfetadas = (
            await db.query(
                "UPDATE piquete SET " +
                "descricao = $2, " +
                "latitude = $3, " +
                "longitude = $4, " +
                "pastoidfk = $5, " +
                "removido = $6 " +
                "WHERE piqueteid = $1",
                [
                    piqueteIDPar,
                    piqueteREGPar.descricao,
                    piqueteREGPar.latitude,
                    piqueteREGPar.longitude,
                    piqueteREGPar.pastoidfk,
                    piqueteREGPar.removido,
                ]
            )
        ).rowCount;
    } catch (error) {
        msg = "[mdlPiquete|UpdatePiquete] " + error.detail;
        linhasAfetadas = -1;
    }

    return { msg, linhasAfetadas };
};

const DeletePiquete = async (piqueteIDPar) => {
    let linhasAfetadas;
    let msg = "ok";

    try {
        linhasAfetadas = (
            await db.query(
                "UPDATE piquete SET removido = true WHERE piqueteid = $1",
                [piqueteIDPar]
            )
        ).rowCount;
    } catch (error) {
        msg = "[mdlPiquete|DeletePiquete] " + error.detail;
        linhasAfetadas = -1;
    }

    return { msg, linhasAfetadas };
};

module.exports = {
    GetAllPiquetes,
    GetPiqueteByID,
    InsertPiquete,
    UpdatePiquete,
    DeletePiquete
};