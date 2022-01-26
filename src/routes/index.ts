import {Router} from 'express'
import {verifyToken,verifyAdmin} from '../auth/auth';
import { cartController } from '../controller/CartController';
import { categoryController } from '../controller/CategoryController';
import { orderController } from '../controller/OrderController';
import { productController } from '../controller/ProductController';
import { userController } from '../controller/UserController';
import { weightController } from '../controller/WeightController';
import { colorController } from '../controller/ColorController';
import { wishListController } from '../controller/WishListController';
const router = Router();

//userRouter
router.put('/login',userController.login)
router.post('/register',userController.create)
router.get('/getMe',userController.getMe)

//cartRouter
router.put('/cart/get',verifyToken,cartController.get)
router.put('/cart/add',verifyToken,cartController.add)
router.put('/cart/delete',verifyToken,cartController.delete)
router.put('/cart/update',verifyToken,cartController.update)
router.put('/cart/done',verifyToken,cartController.close)

//productRouter
router.put('/product/list',productController.list)
router.post('/product/add',verifyAdmin,productController.add)
router.post('/product/get',productController.get)

router.post('/product/update/image',verifyAdmin,productController.updateImage)

router.put('/product/update',verifyAdmin,productController.updateProduct)
router.post('/product/update/productLine',verifyAdmin,productController.updateProductLine)

router.post('/product/delete',verifyAdmin,productController.deleteProduct)
router.post('/product/delete/image',verifyAdmin,productController.removeImage)
router.post('/product/delete/productLine',verifyAdmin,productController.deleteProductLine)

//OrderRouter
// router.put('/order/get',verifyToken,orderController.get)
router.put('/order/get',verifyToken,orderController.get)


//adminRouter
router.get('/admin',verifyAdmin,userController.admin)


//Router category
router.get('/admin/category/get',categoryController.list)


//router weight
router.get('/admin/weight/get',weightController.list)

//router color
router.get('/admin/color/get',colorController.list)

//router wish list

router.put('/wishlist/get',wishListController.list)
router.put('/wishlist/add',wishListController.add)
router.put('/wishlist/delete',wishListController.delete)

export default router;