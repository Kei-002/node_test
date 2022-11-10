const express = require("express");
// const app = express();
const router = express.Router()
const con = require("../connect-mysql.js")
const multer = require("multer")


const FILE_TYPE_MAP = {
  'image/png': 'png',
  'image/jpeg': 'jpeg',
  'image/jpg': 'jpg'
};

router.get('/', (req, res) => {
  
  let sql = `SELECT * FROM item`;
  con.query(sql, (error, results, fields) => {
      if (error) {
        return console.error(error.message);
      }
      
      console.log(results);
      return res.status(200).json(results);
    });
  
});


const storage = multer.diskStorage({
  destination: function (req, file, cb) {
      const isValid = FILE_TYPE_MAP[file.mimetype];
      let uploadError = new Error('invalid image type');

      if (isValid) {
          uploadError = null;
      }
      cb(uploadError, 'public/uploads');
  },
  filename: function (req, file, cb) {
      const fileName = file.originalname.split(' ').join('-');
      const extension = FILE_TYPE_MAP[file.mimetype];
      cb(null, `${fileName}-${Date.now()}.${extension}`);
  }
});

const uploadOptions = multer({ 
  storage: storage
 });

 

router.post('/', uploadOptions.single('uploads'), (req, res) => {

  const file = req.file;
  
  // console.log(req.file)
  if (!file) return res.status(400).send('No image in the request');

  const fileName = file.filename;
  const basePath = `${req.protocol}://${req.get('host')}/public/uploads/`;
  let img_path = `${basePath}${fileName}`
  let sql = `INSERT INTO item(description, sell_price, cost_price, imagePath) VALUES(?,?,?,?)`;
  console.log(fileName, sql)
  con.query(sql, [req.body.description, req.body.sell_price, req.body.cost_price, img_path], (error, results, fields) => {
      if (error) {
          
          return console.error(error.message);
      }
     
      return res.status(200).json(results)
  });
});

router.get('/:id', (req, res) => {
  
  let sql = `SELECT * FROM item WHERE item_id = ${req.params.id}`;
  con.query(sql, (error, results, fields) => {
      if (error) {
        return console.error(error.message);
      }
      
      console.log(results);
      return res.status(200).json(results);
    });
  
});



module.exports = router;