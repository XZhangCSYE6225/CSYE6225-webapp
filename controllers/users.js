import { getUsers, getIdUser, createUser, updateUser } from '../services/users.js';
import logger from '../config/logger.js';
import statsdClient from '../config/statsd.js';

function logInfo(status, message, endpoint, method) {
    const information = {
        status: status,
        endpoint: endpoint,
        method: method
    }
    logger.info(information);
    logger.info(message);
}

function logError(status, message, endpoint, method) {
    const information = {
        status: status,
        endpoint: endpoint,
        method: method
    }
    logger.error(information);
    logger.error(message);
}

// GET
export const getUserById = async (req, res) => {
    const method = "GET";
    const endpoint = `/v1/user/${req.params.id}`;
    try {
        statsdClient.increment("User.GET");
        const { id } = req.params;
        const user = await getIdUser(id);
        delete user.password;
        logInfo(200, user, endpoint, method);
        res.status(200).json(user);
    } catch (error) {
        logError(404, error, endpoint, method);
        res.status(404).json({ msg: error });
    }
}

export const getAllUser = async (req, res) => {
    const method = "GET";
    const endpoint = "/v1/user";
    try {
        statsdClient.increment("Users.GET");
        const users = await getUsers();
        logInfo(200, users, endpoint, method);
        res.status(200).json(users);
    } catch (error) {
        logError(404, error, endpoint, method);
        res.status(400).json({ msg: error });
    }
}

// PUT
export const updateUserById = async (req, res) => {
    const endpoint = `/v1/user/${req.params.id}`;
    const method = "PUT"
    try {
        statsdClient.increment("User.PUT");
        const {
            username,
            password,
            first_name,
            last_name,
            account_created,
            account_updated,
        } = req.body;
        if ( username || account_created || account_updated ) {
            logError(400, { msg: "Not allowed to update" }, endpoint, method)
            return res.status(400).json()
        }
        if (first_name === undefined || last_name === undefined || password === undefined) {
            logError(400, { msg: "Information incomplete" }, endpoint, method);
            return res.status(400).json()
        }
        const user = updateUser(req.params.id, req.body);
        logInfo(204, { msg: "Updated" }, endpoint, method);
        res.status(204).json(user);
    } catch (error) {
        logError(400, error, endpoint, method)
        res.status(400).json({ msg: error });
    }
}

// POST
export const register = async (req, res) => {
    const method = "POST";
    const endpoint = "/v1/user"; 
    try {
        statsdClient.increment("User.POST");
        const {
            username,
            password,
            first_name,
            last_name,
            account_created,
            account_updated
        } = req.body;
        if (!username || !password || !first_name || !last_name) {
            logError(400, { msg: "Information incomplete" }, endpoint, method);
            return res.status(400).json()
        }
        if (account_created || account_updated) {
            logError(400, { msg: "account_created & account_updated" }, endpoint, method);
            return res.status(400).json()
        }
        const pattern = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4}$)/;
        if (!pattern.test(req.body.username)) {
            logError(400,{ msg: "Invalid email" }, endpoint, method);
            return res.status(400).json()
        }
        const saveUserId = await createUser(req.body);
        if (saveUserId === -1) {
            logError(400, { msg: "Already exist" }, endpoint, method);
            return res.status(400).json();
        }
        const saveUser = await getIdUser(saveUserId);
        logInfo(200, saveUser, endpoint, method);
        res.status(201).json(saveUser);
    } catch (error) {
        logError(400, error, endpoint, method);
        res.status(400).json({ msg: error });
    }
}

