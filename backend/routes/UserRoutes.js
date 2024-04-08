import { Router } from 'express'
import { createUser, deleteUser, getUser, getAll, deleteAll } from '../middlewares/UserMiddleware.js';

const router = Router('/');

router.post('/create', createUser, (req, res) => {
    return res.status(200).json({ ID: req.ID });
})

router.delete('/delete/:ID', deleteUser, (req, res) => {
    if (req.confirmation)
        return res.status(201).json({ message: "Deleted successfully!!" })
    else    
        return res.status(400).json({message: "Deletion unsuccessful!!" })
})

router.delete('/deleteAll', deleteAll);

router.get('/get/:ID', getUser);

router.get('/getAll', getAll, (req, res) => {
    try {
        res.send(req.users).status(200);
    }
    catch (err) {
        return res.status(400).json({ message: err.message });
    }
})

export default router