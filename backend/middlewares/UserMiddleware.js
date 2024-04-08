import User from '../models/User.js'
import {randomUUID} from 'crypto'

export async function createUser(req, res, next) {
    try {
        const temp = await User.findOne({ Username: req.body.Username });
        if (temp)
            return res.status(400).send("Username already exists!!")
        const newUser = {
            Username: req.body.Username,
            ID: randomUUID()
        }
        await User.create(newUser);
        req.ID = newUser.ID;
    }
    catch (err){
        return res.status(500).json({message: err.message})
    }
    next();
}

export async function deleteAll(req, res, next) {
    try {
        let user = await User.findOne({});
        while (user) {
            await User.findOneAndDelete({ Username: user.Username });
            user = await User.findOne({});
        }
    }
    catch (err) {
        res.status(400).json({ message: err.message });
    }
    next();
}

export async function deleteUser(req, res, next){
    try {
        const receipt = await User.findOneAndDelete({ ID: req.body.ID });
        console.log(receipt);
    }
    catch (err) {
        req.confirmation = false;
    }
    next();
}

export async function getAll(req, res, next) {
    try {
        const users = await User.find();
        req.users = users
    }
    catch (err) {
        res.status(400).json({ message: err.message });
    }
    next();
}

export async function getUser(req, res, next) {
    try {
        const UserFound = await User.findOne({ ID: req.body.id });
        if (!UserFound)
            res.status(400).json(UserFound)
        else
            res.status(202).json(UserFound)
    }
    catch (err) {
        res.status(400).json({message: err.message})
    }
    next();
}