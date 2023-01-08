const router = require("express").Router()
const { exec, execFile } = require("child_process");
const fs = require("fs"); 
const path = require('path');

// try and make the pdf
router.post("/test", async (req, res, next) => { 

  try {

    const data = req.body.data

    const fileName = new Date().getTime()

    let returnData = {}

    exec(`echo '${data}' > ${fileName}.blb & cat ${fileName}.blb`, (error, stdout, stderr) => {
      if (error) {
        console.log(`error ${error.message}`)
        res.json({
          error
        })
        return
      }
      if (stderr) {
        console.log(`stderror ${stderr}`)
        res.json({
          stderr
        })
        return
      }

      console.log(`stdout ${stdout}`)
    })


    execFile(__dirname + '/command.sh', [`-f ${fileName}`], (error, stdout, stderr) => {
      console.log("in execfile")
      if (error) {
        console.log(`error ${error.message}`)
        res.json({
          error
        })
        return
      }
      if (stderr) {
        console.log(`stderror ${stderr}`)
        res.json({
          stderr
        })
        return
      }

      console.log(`stdout ${stdout}`)
      res.json({
        success: true,
        fileName
      })

    })

  } catch(e) {
    next(e)
  }

})


router.get("/test", async (req, res, next) => {

  try {

    const fileName = req.query.fileName
    const dirPath = path.join(__dirname, `../${fileName}.pdf`);

    // get pdf
    file = fs.createReadStream(dirPath)

    file.pipe(res)

  } catch(e)  {
    next(e)
  }

})


router.delete("/test", async (req, res, next) => {

  try {

    const fileName = req.body.fileName

    // delete pdf
    exec(`rm ${fileName}.pdf`, (error, stderr, stdout) => {
      console.log("in exec")
      if (error) {
        console.log(`error ${error.message}`)
        res.json({
          error
        })
        return
      }
      if (stderr) {
        console.log(`stderror ${stderr}`)
        res.json({
          stderr
        })
        return
      }
    })

    res.json({
      success: true
    })

  } catch(e) {
    next(e)
  }

})



module.exports = router;
