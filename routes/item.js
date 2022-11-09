const express = require("express");
// const app = express();
const router = express.Router()
const con = require("../connect-mysql.js")

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

module.exports = router;