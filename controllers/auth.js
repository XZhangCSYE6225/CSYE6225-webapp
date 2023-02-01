import { getEmailUser } from "../services/users.js";

export const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await getEmailUser(email);
        if(user) {
            res.status(401).json({ msg: "User does not exist" });
        }
        const token = Buffer.from(`${email}:${password}`, "utf8");
        delete user[0].password;
        res.status(200).json({ token, user });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}