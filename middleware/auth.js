import db from "../database/database.js";
import bcrypt from 'bcrypt';

export const verifyToken = async (req, res, next) => {
    try {
        let token = req.header("Authorization");
        if (!token) {
            res.set("WWW-Authenticate", "Basic").status(401).json( { msg: "Missing token" } );
        }
        else {
            const credentials = Buffer.from(token.split(" ")[1], "base64")
            .toString()
            .split(":");
            const email = credentials[0]
            const password = credentials[1];
            const [rows] = await db.query(`
            SELECT * FROM appuser WHERE email = ?;
            `, [email]);
            let passwordHash, isMatch;
            if (rows) {
                passwordHash = rows[0].account_password;
                isMatch = await bcrypt.compare(password, passwordHash);
            }
            if (!isMatch || !rows) {
                res.set("WWW-Authenticate", "Basic").status(401).json( { msg: "Incorrect email or password" } );
            }
            else {
                const { id } = req.params;
                if (rows[0].id.toString() !== id) {
                    res.status(403).json( { msg: "Not allowed to get other user's profile" } );
                }
                else{
                    next();
                }
            }
        }
        
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
}