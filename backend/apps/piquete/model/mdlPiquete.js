const db = require("../../../database/databaseconfig");

const GetAllPiquete = async () => {
    return (
        await db.query(
            "SELECT * FROM piquete WHERE deleted = false ORDER BY descricao ASC"
        )
    ).rows;
};

const GetPiqueteByID = async (piqueteIDPar) => {
    return (
        await db.query(
            "SELECT * FROM piquete WHERE idPiquete = $1 AND deleted = false ORDER BY descricao ASC",
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
                "INSERT INTO piquete VALUES (default, $1, $2, $3, $4, $5)",
                [
                    piqueteREGPar.descricao,
                    piqueteREGPar.latitude,
                    piqueteREGPar.longitude,
                    piqueteREGPar.pastoId,
                    piqueteREGPar.deleted
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
                "pastoId = $5, " +
                "deleted = $6 " +
                "WHERE idPiquete = $1",
                [
                    piqueteIDPar,
                    piqueteREGPar.descricao,
                    piqueteREGPar.latitude,
                    piqueteREGPar.longitude,
                    piqueteREGPar.pastoId,
                    piqueteREGPar.deleted,
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
                "UPDATE piquete SET deleted = true WHERE idPiquete = $1",
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
    GetAllPiquete,
    GetPiqueteByID,
    InsertPiquete,
    UpdatePiquete,
    DeletePiquete
};
