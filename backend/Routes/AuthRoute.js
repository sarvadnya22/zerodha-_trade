const { Signup, Login } = require("../controllers/AuthController");
const router = require("express").Router();

router.post("/signup", Signup);
router.post("/login", Login);
const { userVerification } = require("../middlewares/AuthMiddleware");
router.post("/", userVerification);

module.exports = router;
