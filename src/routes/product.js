const router = require('express').Router();
const productController = require('../controllers/productController');

router.get("/", productController.index);
router.get("/:idProduct", productController.getProduct);
router.post("/", productController.store);
router.post("/promotion/", productController.setPromotion);
router.put("/:idRestaurant", productController.update);
router.delete("/:idRestaurant", productController.destroy);


module.exports = router