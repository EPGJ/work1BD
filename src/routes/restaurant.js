const router = require('express').Router();
const restaurantController = require('../controllers/restaurantController');
const multer = require("multer");
const { multerConfig } = require('../utils/multer');
const connection = require('../utils/databaseConnection');



router.get("/", restaurantController.index);
router.get("/:id", restaurantController.getRestaurant);
router.get("/allProducts/:id", restaurantController.getAllRestaurantProducts);
router.post("/" , restaurantController.store);

router.post("/upload", multer(multerConfig()).single('file'), (req,res) => {
    return res.json(req.file.filename + " uploaded");
});

router.put("/:id", restaurantController.update);
router.delete("/:id", restaurantController.destroy);


module.exports = router