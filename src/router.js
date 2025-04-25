import express from "express";
import path from "path";
import userController from "./controllers/user.js";
import itemController from "./controllers/item.js";


const router = express.Router();

// FRONT-END //

const pathFrontEnd = path.join(process.cwd(), 'front-end');

router.use('/', express.static(pathFrontEnd));

//  BACKEND  //

router.post('/items', itemController.post)
router.get('/items', itemController.get);
router.get('/items/:id', itemController.getById);
router.patch('/items/:id', itemController.patch);
router.delete('/items/:id', itemController.delete);

router.post('/users', userController.post);
router.get('/users', userController.get);
router.get('/users/:id', userController.getById);
router.patch('/users/:id', userController.patch)
router.delete('/users/:id', userController.delete);


export default router;