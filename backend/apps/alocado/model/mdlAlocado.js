const db = require("../../../database/databaseconfig");

const GetAllAlocado = async () => {
    return (
        await db.query(
            "SELECT alocadoid, animalidifk, piqueteidfk, to_char(datainicio, 'YYYY-MM-DD') AS datainicio, to_char(datafinal, 'YYYY-MM-DD') AS datafinal, removido FROM alocado WHERE removido = false ORDER BY datainicio ASC"
        )
    ).rows;
};

const GetAlocadoByID = async (alocadoIDPar) => {
    return (
        await db.query(
            "SELECT alocadoid, animalidifk, piqueteidfk, to_char(datainicio, 'YYYY-MM-DD') AS datainicio, to_char(datafinal, 'YYYY-MM-DD') AS datafinal, removido FROM alocado WHERE alocadoid = $1 AND removido = false",
            [alocadoIDPar]
        )
    ).rows;
};

const InsertAlocado = async (alocadoREGPar) => {
    let linhasAfetadas;
    let msg = "ok";
    try {
        linhasAfetadas = (
            await db.query(
                "INSERT INTO alocado VALUES (default, $1, $2, $3, $4, $5)",
                [
                    alocadoREGPar.animalidifk,
                    alocadoREGPar.piqueteidfk,
                    alocadoREGPar.datainicio,
                    alocadoREGPar.datafinal,
                    alocadoREGPar.removido,
                ]
            )
        ).rowCount;
    } catch (error) {
        msg = "[mdlAlocado|InsertAlocado] " + error.detail;
        linhasAfetadas = -1;
    }

    return { msg, linhasAfetadas };
};

const UpdateAlocado = async (alocadoIDPar, alocadoREGPar) => {
    let linhasAfetadas;
    let msg = "ok";
    try {
        linhasAfetadas = (
            await db.query(
                "UPDATE alocado SET " +
                "animalidifk = $2, " +
                "piqueteidfk = $3, " +
                "datainicio = $4, " +
                "datafinal = $5, " +
                "removido = $6 " +
                "WHERE alocadoid = $1",
                [
                    alocadoIDPar,
                    alocadoREGPar.animalidifk,
                    alocadoREGPar.piqueteidfk,
                    alocadoREGPar.datainicio,
                    alocadoREGPar.datafinal,
                    alocadoREGPar.removido,
                ]
            )
        ).rowCount;
    } catch (error) {
        msg = "[mdlAlocado|UpdateAlocado] " + error.detail;
        linhasAfetadas = -1;
    }

    return { msg, linhasAfetadas };
};

const DeleteAlocado = async (alocadoIDPar) => {
    let linhasAfetadas;
    let msg = "ok";

    try {
        linhasAfetadas = (
            await db.query(
                "UPDATE alocado SET removido = true WHERE alocadoid = $1",
                [alocadoIDPar]
            )
        ).rowCount;
    } catch (error) {
        msg = "[mdlAlocado|DeleteAlocado] " + error.detail;
        linhasAfetadas = -1;
    }

    return { msg, linhasAfetadas };
};

module.exports = {
    GetAllAlocado,
    GetAlocadoByID,
    InsertAlocado,
    UpdateAlocado,
    DeleteAlocado,
};
