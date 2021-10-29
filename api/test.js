const router = require("express").Router()
const { exec } = require("child_process");

router.post("/test", async (req, res, next) => {

  try {

    const data = req.body.data

    console.log(data)

    exec("cat test.txt", (error, stdout, stderr) => {
      if (error) {
        console.log(`error ${error.message}`)
      }
      if (stderr) {
        console.log(`stderror ${stderr}`)
      }

      console.log(`stdout ${stdout}`)
    })

    res.send("Success!");

  } catch(e) {
    next(e)
  }

})



module.exports = router;
