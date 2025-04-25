import express from "express";
import path from "path";
import userController from "./controllers/user.js";
import itemController from "./controllers/item.js";


const router = express.Router();

// FRONT-END //

const pathFrontEnd = path.join(process.cwd(), 'front-end');

router.use('/', express.static(pathFrontEnd));

//  BACKEND  //

router.get('/users', userController.get);

export default router;