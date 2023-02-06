import sequelize from '../models/index.js'
import bcrypt from 'bcrypt';


export async function getUsers() {
    const users = await sequelize.models.user.findAll();
    return users;
}

export async function getIdUser(id) {
    const user = await sequelize.models.user.findOne({
        attributes: ["id", "first_name", "last_name", "username", "account_created", "account_updated"],
        where: {
            id: id
        }
    });
    return user;
}

export async function getUsernameUser(username) {
    const user = await sequelize.models.user.findOne({
        where: {
            username: username
        }
    });
    return user;
}

export async function updateUser(id, body) {
    const user = getIdUser(id);
    let { newPassword } = body;

    if (!newPassword) {
        newPassword = user.password;
    }
    else {
        const salt = await bcrypt.genSalt();
        newPassword = await bcrypt.hash(body.password, salt);
    }
    body.password = newPassword;
    const updatedUser = await sequelize.models.user.update(body, {
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
    const user = await sequelize.models.user.create(body)
    return user.id;
}