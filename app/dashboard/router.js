var express = require("express");
var router = express.Router();
const { isLoginAdmin } = require("../middleware/auth");
const { index } = require("./controller");

router.use(isLoginAdmin);
router.get("/", index);

module.exports = router;
