const router = require("express").Router()
const { exec, execFile } = require("child_process");


router.post("/test", async (req, res, next) => {

  try {

    const data = req.body.data

    console.log(data)

    exec(`echo '${data}' > test.blb & cat test.blb`, (error, stdout, stderr) => {
      if (error) {
        console.log(`error ${error.message}`)
      }
      if (stderr) {
        console.log(`stderror ${stderr}`)
      }

      console.log(`stdout ${stdout}`)
    })

    execFile(__dirname + '/command.sh', (error, stdout, stderr) => {
      console.log("in execfile")
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
