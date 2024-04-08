import Bid from '../models/Bid.js'
import {randomUUID} from 'crypto'

export async function createBid(req, res, next) {
    try {
        // Payment ka add karna padega for bid
    }
    catch (err){
        return res.status(500).json({message: err.message})
    }
    next();
}

// export async function deleteAll(req, res, next) {
//     try {
//         let user = await Bid.findOne({});
//         while (user) {
//             await Bid.findOneAndDelete({ username: user.username });
//             user = await Bid.findOne({});
//         }
//     }
//     catch (err) {
//         res.status(400).json({ message: err.message });
//     }
//     next();
// }

export async function deleteBid(req, res, next){
    try {
        // Delete ke 
    }
    catch (err) {
        req.confirmation = false;
    }
    next();
}

export async function getAll(req, res, next) {
    try {
        const users = await Bid.find();
        req.users = users
    }
    catch (err) {
        res.status(400).json({ message: err.message });
    }
    next();
}

export async function getBid(req, res, next) {
    try {
        const BidFound = await Bid.findOne({ ID: req.body.id });
        if (!BidFound)
            res.status(400).json(BidFound)
        else
            res.status(202).json(BidFound)
    }
    catch (err) {
        res.status(400).json({message: err.message})
    }
    next();
}