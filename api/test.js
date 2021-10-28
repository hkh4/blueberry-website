const router = require("express").Router()

router.post("/test", async (req, res, next) => {

  try {

    //test

  } catch(e) {
    next(e)
  }

})



module.exports = router;
