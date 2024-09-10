var express = require('express');
var router = express.Router();
const path = require('path');
const util = require('util');
const exec = util.promisify(require('child_process').exec);
const ElectronPDF = require('electron-pdf');
const fs = require('fs');


/* GET home page. */
router.get('/', async function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.post('/pdf', async (req, res) => {
  try {
    const { url } = req.body;

    // Check if url is provided
    if (!url) {
      return res.status(400).json({ error: 'URL is required' });
    }

    // Generate a unique filename for the PDF
    const filename = Date.now() + '.pdf';
    const filePath = path.join(__dirname, '..', 'public', filename);

    // Execute the electron-pdf command
    const command = `electron-pdf ${url} ${filePath}`;
    const { stdout, stderr } = await exec(command);
    console.log('stdout:', stdout);
    console.log('stderr:', stderr);

    // Send the PDF as a media response
    console.log(filePath);
    res.sendFile(filePath, {}, function (err) {
      if(err){
        res.status(500).json({ error: 'Unable to send file...' });
      }else{
        // fs.unlinkSync(filePath);
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
