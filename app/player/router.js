var express = require("express");
var router = express.Router();
const {
  landingPage,
  detailPage,
  category,
  checkout,
  history,
} = require("./controller");
const { isLoginPlayer } = require("../middleware/auth");
/* GET home page. */
router.get("/landingpage", landingPage);
router.get("/detailPage/:id", detailPage);
router.get("/category", category);
router.post("/checkout", isLoginPlayer, checkout);
router.get("/history", isLoginPlayer, history);

module.exports = router;
