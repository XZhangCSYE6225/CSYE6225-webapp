import { getUsers, getIdUser, createUser, updateUser } from '../services/users.js';

// GET
export const getUserById = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await getIdUser(id);
        delete user.password;
        res.status(200).json(user);
    } catch (error) {
        res.status(404).json({ error: error.message });
    }
}

export const getAllUser = async (req, res) => {
    try {
        const users = await getUsers();
        res.status(200).json(users);
    } catch (error) {
        res.status(404).json({ error: error.message })
    }
}

// PUT
export const updateUserById = async (req, res) => {
    try {
        const {
            username,
            password,
            first_name,
            last_name,
            account_created,
            account_updated,
        } = req.body;
        if ( username || account_created || account_updated ) {
            return res.status(400).json()
        }
        if (first_name === undefined || last_name === undefined || password === undefined) {
            return res.status(400).json()
        }
        const user = updateUser(req.params.id, req.body);
        res.status(204).json(user);
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
}

// POST
export const register = async (req, res) => {
    try {
        const {
            username,
            password,
            first_name,
            last_name,
            account_created,
            account_updated
        } = req.body;
        if (!username || !password || !first_name || !last_name) {
            return res.status(400).json()
        }
        if (account_created || account_updated) {
            return res.status(400).json()
        }
        const pattern = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4}$)/;
        if (!pattern.test(req.body.username)) {
            return res.status(400).json()
        }
        const saveUserId = await createUser(req.body);
        if (saveUserId === -1) {
            return res.status(400).json();
        }
        const saveUser = await getIdUser(saveUserId);
        res.status(201).json(saveUser);
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
}

