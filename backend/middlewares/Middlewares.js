import Offer from '../models/Offer.js'
import {randomUUID} from 'crypto'
import { CreateListingOnChain, CreateOfferOnChain, CreateUserOnChain, DeleteUserOnChain } from '../integration/Scripts.js';

export async function createUserHandler(req, res, next) {
    try {
        await CreateUserOnChain();
        await User.create(newUser);
        req.newUser = newUser;
    }
    catch (err){
        return res.status(500).json({message: err.message})
    }
    next();
}
