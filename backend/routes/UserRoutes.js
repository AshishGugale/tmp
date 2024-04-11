import { Router } from 'express'
import { createUserHandler } from '../middlewares/Middlewares.js';

const router = Router('/');

router.post('/create', createUserHandler, (req, res) => {
    return res.status(200).json({ newUser: req.newUser });
})

// router.delete('/delete/:ID', deleteUser, (req, res) => {
//     if (req.confirmation)
//         return res.status(201).json({ message: "Deleted successfully!!" })
//     else    
//         return res.status(400).json({message: "Deletion unsuccessful!!" })
// })

// router.delete('/deleteAll', deleteAll);

// router.get('/get/:ID', getUser);

// router.get('/getAll', getAll, (req, res) => {
//     try {
//         res.send(req.users).status(200);
//     }
//     catch (err) {
//         return res.status(400).json({ message: err.message });
//     }
// })

export default router