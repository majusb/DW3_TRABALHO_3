const db = require("../../../database/databaseconfig");

const GetAllPastos = async () => {
    return (
        await db.query(
            "SELECT * FROM pasto WHERE deleted = false ORDER BY nomePasto ASC"
        )
    ).rows;
};

const GetPastoByID = async (pastoIDPar) => {
    return (
        await db.query(
            "SELECT * FROM pasto WHERE idPasto = $1 AND deleted = false ORDER BY nomePasto ASC",
            [pastoIDPar]
        )
    ).rows;
};

const InsertPasto = async (pastoREGPar) => {
    let linhasAfetadas;
    let msg = "ok";
    try {
        linhasAfetadas = (
            await db.query(
                "INSERT INTO pasto VALUES (default, $1, $2)",
                [
                    pastoREGPar.nomePasto,
                    pastoREGPar.areatotal
                ]
            )
        ).rowCount;
    } catch (error) {
        msg = "[mdlPasto|InsertPasto] " + error.detail;
        linhasAfetadas = -1;
    }

    return { msg, linhasAfetadas };
};

const UpdatePasto = async (pastoIDPar, pastoREGPar) => {
    let linhasAfetadas;
    let msg = "ok";
    try {
        linhasAfetadas = (
            await db.query(
                "UPDATE pasto SET " +
                "nomePasto = $2, " +
                "areatotal = $3 " +
                "deleted = $4 " +
                "WHERE pastoid = $1",
                [
                    pastoIDPar,
                    pastoREGPar.nomePasto,
                    pastoREGPar.areatotal,
                    pastoREGPar.deleted,
                ]
            )
        ).rowCount;
    } catch (error) {
        msg = "[mdlPasto|UpdatePasto] " + error.detail;
        linhasAfetadas = -1;
    }

    return { msg, linhasAfetadas };
};

const DeletePasto = async (pastoIDPar) => {
    let linhasAfetadas;
    let msg = "ok";

    try {
        linhasAfetadas = (
            await db.query(
                "UPDATE pasto SET deleted = true WHERE pastoid = $1",
                [pastoIDPar]
            )
        ).rowCount;
    } catch (error) {
        msg = "[mdlPasto|DeletePasto] " + error.detail;
        linhasAfetadas = -1;
    }

    return { msg, linhasAfetadas };
};

module.exports = {
    GetAllPastos,
    GetPastoByID,
    InsertPasto,
    UpdatePasto,
    DeletePasto
};
