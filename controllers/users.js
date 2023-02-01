import { getUsers, getIDUser, createUser, updateUser } from '../services/users.js';

// GET
export const getUserById = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await getIDUser(id);
        delete user[0].account_password;
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
            email,
            firstname,
            lastname,
            account_password,
            created_at,
            modified_at
        } = req.body;
        if ( email || created_at || modified_at ) {
            return res.status(400).json( { msg: "Not allowed to modify" } )
        }
        updateUser(req.params.id, req.body);
        res.status(204).json();
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
}

// POST
export const register = async (req, res) => {
    try {
        const pattern = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4}$)/;
        if (!pattern.test(req.body.email)) {
            return res.status(400).json( { msg: "email address invalid" } )
        }
        const saveid = await createUser(req.body);
        if (saveid === -1) {
            return res.status(400).json( { msg: "Email address already exist" } );
        }
        const user = await getIDUser(saveid);
        delete user[0].account_password;
        res.status(201).json(user);
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
}

