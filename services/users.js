import { user } from '../models/user.js'
import bcrypt from 'bcrypt';


export async function getUsers() {
    const users = await user.findAll();
    return users;
}

export async function getIdUser(id) {
    const users = await user.findOne({
        attributes: ["id", "first_name", "last_name", "username", "account_created", "account_updated"],
        where: {
            id: id
        }
    });
    return users;
}

export async function getUsernameUser(username) {
    const users = await user.findOne({
        where: {
            username: username
        }
    });
    return users;
}

export async function updateUser(id, body) {
    const users = getIdUser(id);
    let { newPassword } = body;

    if (!newPassword) {
        newPassword = users.password;
    }
    else {
        const salt = await bcrypt.genSalt();
        newPassword = await bcrypt.hash(body.password, salt);
    }
    body.password = newPassword;
    const updatedUser = await user.update(body, {
        where: {
            id: id
        }
    });
    return updatedUser;
}

export async function createUser(body) {
    const emailInDatabase = await getUsernameUser(body.username);
    if (emailInDatabase) {
        return -1;
    }
    const salt = await bcrypt.genSalt();
    const passwordHash = await bcrypt.hash(body.password, salt);
    body.password = passwordHash;
    const users = await user.create(body)
    return users.id;
}