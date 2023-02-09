import { getUsernameUser } from '../services/users.js';
import { getIdProduct } from '../services/products.js';
import bcrypt from 'bcrypt';

export const verifyTokenUser = async (req, res, next) => {
    try {
        let token = req.header("Authorization");
        if (!token) {
            res.set("WWW-Authenticate", "Basic").status(401).json();
        }
        else {
            const credentials = Buffer.from(token.split(" ")[1], "base64")
            .toString()
            .split(":");
            const username = credentials[0]
            const password = credentials[1];
            const user = await getUsernameUser(username);
            let passwordHash, isMatch;
            if (user) {
                passwordHash = user.password;
                isMatch = await bcrypt.compare(password, passwordHash);
            }
            if (!isMatch || !user) {
                res.set("WWW-Authenticate", "Basic").status(401).json();
            }
            else {
                const { id } = req.params;
                if (user.id.toString() !== id) {
                    res.status(403).json();
                }
                else{
                    next();
                }
            }
        }
        
    } catch (error) {
        return res.status(500).json({ error: error.message })
    }
}

export const verifyTokenProduct = async (req, res, next) => {
    try {
        let token = req.header("Authorization");
        if (!token) {
            res.set("WWW-Authenticate", "Basic").status(401).json();
        }
        else {
            const credentials = Buffer.from(token.split(" ")[1], "base64")
            .toString()
            .split(":");
            const username = credentials[0]
            const password = credentials[1];
            const user = await getUsernameUser(username);
            let passwordHash, isMatch;
            if (user) {
                passwordHash = user.password;
                isMatch = await bcrypt.compare(password, passwordHash);
            }
            if (!isMatch || !user) {
                res.set("WWW-Authenticate", "Basic").status(401).json();
            }
            else {
                const { id } = req.params;
                const product = await getIdProduct(id);
                if (!product) {
                    res.status(404).json();
                }
                else if (user.id.toString() !== product.owner_user_id.toString()) {
                    res.status(403).json();
                }
                else{
                    next();
                }
            }
        }
    } catch (error) {
        return res.status(500).json({ error: error.message })
    }
}

export const verifyTokenCreateProduct = async (req, res, next) => {
    try {
        let token = req.header("Authorization");
        if (!token) {
            res.set("WWW-Authenticate", "Basic").status(401).json( { msg: "Missing token" } );
        }
        else {
            const credentials = Buffer.from(token.split(" ")[1], "base64")
            .toString()
            .split(":");
            const username = credentials[0]
            const password = credentials[1];
            const user = await getUsernameUser(username);
            let passwordHash, isMatch;
            if (user) {
                passwordHash = user.password;
                isMatch = await bcrypt.compare(password, passwordHash);
            }
            if (!isMatch || !user) {
                res.set("WWW-Authenticate", "Basic").status(401).json();
            }
            else {
                req.body.owner_id = user.id;
                next();
            }
        }
    } catch (error) {
        return res.status(500).json({ error: error.message })
    }
}