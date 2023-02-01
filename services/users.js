import db from '../database/database.js';
import bcrypt, { hash } from 'bcrypt';


export async function getUsers() {
    const [rows] = await db.query("SELECT * FROM appuser");
    return rows;
}

export async function getIDUser(id) {
    const [rows] = await db.query(`
    SELECT * FROM appuser WHERE id = ?
    `, [id]);
    return rows;
}

export async function getEmailUser(email) {
    const [[ rows ]] = await db.query(`
    SELECT * FROM appuser WHERE email = ?
    `, [email]);
    return rows;
}

export async function updateUser(id, body) {
    const [[rows]] = await db.query(`
    SELECT DISTINCT  FROM appuser WHERE id = ? 
    `, [id]);
    let {
        account_password,
        lastname,
        firstname
    } = body;

    if (!account_password) {
        account_password = rows.account_password;
    }
    else {
        const salt = await bcrypt.genSalt();
        account_password = await bcrypt.hash(body.account_password, salt);
    }
    if (!lastname) {
        lastname = rows.lastname;
    }
    if (!firstname) {
        firstname = rows.firstname;
    }
    await db.query(`
    UPDATE appuser
    SET account_password = ?, lastname = ?, firstname = ?
    WHERE id = ?`, [account_password, lastname, firstname, id]);
}

export async function createUser(body) {
    const emailInDatabase = await getEmailUser(body.email);
    if (emailInDatabase) {
        return -1;
    }
    const salt = await bcrypt.genSalt();
    const passwordHash = await bcrypt.hash(body.account_password, salt);
    const [result] = await db.query(`
    INSERT INTO appuser (email, firstname, lastname, account_password)
    VALUE (?, ?, ?, ?);
    `, [body.email, body.firstname, body.lastname, passwordHash]);
    const id = result.insertId;
    return id;
}