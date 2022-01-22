import {Router} from 'express'
import {verifyToken,verifyAdmin} from '../auth/auth';
import { cartController } from '../controller/CartController';
import { categoryController } from '../controller/CategoryController';
import { orderController } from '../controller/OrderController';
import { productController } from '../controller/ProductController';

import { userController } from '../controller/UserController';
import { weightController } from '../controller/WeightController';
const router = Router();

//userRouter
router.put('/login',userController.login)
router.post('/register',userController.create)
router.get('/getMe',userController.getMe)

//cartRouter
router.put('/cart/get',cartController.get)
router.put('/cart/add',cartController.add)
router.put('/cart/delete',cartController.delete)
router.put('/cart/update',cartController.update)
router.put('/cart/done',cartController.close)



//productRouter
router.put('/product/list',productController.list)
router.post('/product/add',productController.add)
router.post('/product/get',productController.get)

router.post('/product/update/image',productController.updateImage)

router.post('/product/update',productController.updateProduct)
router.post('/product/update/productLine',productController.updateProductLine)

router.post('/product/delete',productController.deleteProduct)
router.post('/product/delete/image',productController.removeImage)
router.post('/product/delete/productLine',productController.deleteProductLine)

//OrderRouter
// router.put('/order/get',verifyToken,orderController.get)
router.put('/order/get',orderController.get)


//adminRouter
router.get('/admin',verifyAdmin,userController.admin)


//Router category
router.get('/admin/category/get',categoryController.list)



//router weight
router.get('/admin/weight/get',weightController.list)

export default router;