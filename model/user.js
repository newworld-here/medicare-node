const connection = require("../database/sql");
let jwt = require("jsonwebtoken");
let html_to_pdf = require("html-pdf-node");
const path = require("path");
let bcrypt = require("bcryptjs");
var nodemailer = require("nodemailer");
const PDFDocument = require("pdfkit");
let handler = require("../handler/datahandler");
const checksum_lib = require("../Paytm/checksum");
const configPay = require("../Paytm/config");
class quaryHandaler {
  async contact_mail(req, res) {
    console.log(req.body);
    // const PDFDocument = require('pdfkit');

    // const pdfBuffer = await new Promise(resolve => {
    //     const doc = new PDFDocument()

    //     doc.text(req.body.info, 100, 50)
    //     doc.end()

    //     //Finalize document and convert to buffer array
    //     let buffers = []
    //     doc.on("data", buffers.push.bind(buffers))
    //     doc.on("end", () => {
    //         let pdfData = new Uint8Array(Buffer.concat(buffers))
    //        return resolve(pdfData)
    //     })
    // })

    // console.log(pdfBuffer);
    // --------------------------------------
    const pdfBuffer = await new Promise((resolve) => {
      let options = { format: "A4" };
      // Example of options with args //
      // let options = { format: 'A4', args: ['--no-sandbox', '--disable-setuid-sandbox'] };

      let file = { content: "<h1>Welcome to html-pdf-node</h1>" };
      // or //
      html_to_pdf.generatePdf(file, options).then((pdfBuffer) => {
        console.log("PDF Buffer:-", pdfBuffer);
        // res.download(filePath);
        return resolve(pdfBuffer);
      });
    });
    // return
    var transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "saurav@sentientgeeks.com",
        pass: "saurav@123456",
      },
    });

    var mailOptions = {
      from: "saurav@sentientgeeks.com",
      to: "saurav@sentientgeeks.com",
      subject: "contact",
      text: req.body.mailtext,
      attachments: [
        {
          filename: "attachment.pdf",
          content: pdfBuffer,
        },
      ],
    };

    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log(error);
      } else {
        console.log("Email sent: " + info.response);
        res.send({ status: true, msg: "Email sent" });
      }
    });
  }

  /////////////////////////////////////////////////////////////////////////////////////////////
  async pay(req, res) {
    // Route for making payment

    var paymentDetails = {
      amount: req.body.amount,
      customerId: req.body.name,
      customerEmail: req.body.email,
      customerPhone: req.body.phone
  }
  if(!paymentDetails.amount || !paymentDetails.customerId || !paymentDetails.customerEmail || !paymentDetails.customerPhone) {
      res.status(400).send('Payment failed')
  } else {
      var params = {};
      params['MID'] = configPay.PaytmConfig.mid;
      params['WEBSITE'] = configPay.PaytmConfig.website;
      params['CHANNEL_ID'] = 'WEB';
      params['INDUSTRY_TYPE_ID'] = 'Retail';
      params['ORDER_ID'] = 'TEST_'  + new Date().getTime();
      params['CUST_ID'] = paymentDetails.customerId;
      params['TXN_AMOUNT'] = paymentDetails.amount;
      params['CALLBACK_URL'] = 'http://localhost:3000/callback';
      params['EMAIL'] = paymentDetails.customerEmail;
      params['MOBILE_NO'] = paymentDetails.customerPhone;
  
      console.log('hhhhhhhhhhhhhhhhhhhhhhhhh', params);
      checksum_lib.genchecksum(params, configPay.PaytmConfig.key, function (err, checksum) {
          var txn_url = "https://securegw-stage.paytm.in/theia/processTransaction"; // for staging
          // var txn_url = "https://securegw.paytm.in/theia/processTransaction"; // for production
  
          var form_fields = "";
          for (var x in params) {
              form_fields += "<input type='hidden' name='" + x + "' value='" + params[x] + "' >";
          }
          form_fields += "<input type='hidden' name='CHECKSUMHASH' value='" + checksum + "' >";
  console.log('??????????????????????', form_fields);
  res.send({url:txn_url,form: form_fields })
          // res.end();
      });
  }
  }

  async callback(req, res) {
    // Route for verifiying payment

    var body = '';

    req.on('data', function (data) {
      body += data;
      
    });

    req.on('end', function () {
      var html = "";
      var post_data = qs.parse(body);
      console.log('BODY',body);
      // received params in callback
      console.log('Callback Response: ', post_data, "\n");


      // verify the checksum
      var checksumhash = post_data.CHECKSUMHASH;
      // delete post_data.CHECKSUMHASH;
      var result = checksum_lib.verifychecksum(post_data, configPay.PaytmConfig.key, checksumhash);
      // var result = true;
      console.log("Checksum Result => ", result, "\n");


      // Send Server-to-Server request to verify Order Status
      var params = { "MID": configPay.PaytmConfig.mid, "ORDERID": post_data.ORDERID };

      checksum_lib.genchecksum(params, configPay.PaytmConfig.key, function (err, checksum) {

        params.CHECKSUMHASH = checksum;
        post_data = 'JsonData=' + JSON.stringify(params);

        var options = {
          hostname: 'securegw-stage.paytm.in', // for staging
          // hostname: 'securegw.paytm.in', // for production
          port: 443,
          path: '/merchant-status/getTxnStatus',
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Content-Length': post_data.length
          }
        };


        // Set up the request
        var response = "";
        var post_req = https.request(options, function (post_res) {
          post_res.on('data', function (chunk) {
            response += chunk;
          });

          post_res.on('end', function () {
            console.log('S2S Response: ', response, "\n");

            var _result = JSON.parse(response);
            if (_result.STATUS == 'TXN_SUCCESS') {
              res.send({status: true, value : 'payment sucess'})
            } else {
              res.send({status: false, value : 'payment failed'})
            }
          });
        });

        // post the data
        post_req.write(post_data);
        post_req.end();
      });
    });
  }

  /////////////////////////////////////////////////////////////////////////////////////////////


  login(req, res) {
    return new Promise(async (resolve, reject) => {
      try {
        console.log(">>>>>>", req.body);
        if (req.body.email != "") {
          //---------------
          var sql1 =
            "SELECT * FROM user WHERE `phone`= '" +
            req.body.email +
            "' OR `email`= '" +
            req.body.email +
            "'";
          connection.query(sql1, function (error, rows, fields) {
            //Get state data//
            if (error) {
              console.log(error);
            } else {
              // console.log(rows);
              if (rows == "") {
                res.send({ status: false, message: "No Data Found" });
              } else {
                if (rows.filter((e) => e.flag != 0).length == 0) {
                  res.send({ status: false, message: "Inactive User" });
                } else {
                  bcrypt.compare(
                    req.body.password,
                    rows[0].password,
                    (err, result) => {
                      if (result) {
                        res.send({
                          status: true,
                          message: "Login Successful",
                          userData: rows[0],
                        });
                      } else {
                        res.send({ status: false, message: "Login Failed" });
                      }
                    }
                  );
                }
              }
            }
          });
        } else res.status(200).json({ message: "Email Mandatory" });
      } catch (error) {
        reject(error);
      }
    });
  }

  async addUser(req, res) {
    if (isNaN(req.body.phone)) {
      res.send({ message: "Give int value" });
    } else if (req.body.phone === null) {
      res.send({ message: "Not null value" });
    } else {
      // console.log('ggggggggggg');
      let salt = bcrypt.genSaltSync(10);
      let hash = bcrypt.hashSync(req.body.password, salt);
      let userData = {
        nameOfUser: req.body.nameOfUser,
        phone: req.body.phone,
        email: req.body.email,
        password: hash
      };
      // console.log(userData);
      var sql = "INSERT INTO user SET ? ";
      connection.query(sql, userData, function (error, rows, fields) {
        //Get state data//
        if (error) {
          console.log(">>>>>", error);
          res.send({ status: false, message: "Phone no email already exist" });
        } else {
          res.send({ status: true, message: "User Added Successfully" });
        }
      });
    }
  }

  



  async getUsers(req, res) {
    var sql = "SELECT * FROM user";
    connection.query(sql, function (error, rows, fields) {
      //Get state data//
      if (error) {
        console.log(error);
      } else {
        // console.log(rows);
        if (rows == "") {
          res.send({ status: false, message: "No Data Found" });
        } else {
          var userdata = rows;
          var filterUserData = [];
          userdata.forEach((element) => {
            filterUserData.push({
              userId: element.userId,
              nameOfUser: element.nameOfUser,
              phone: element.phone,
              email: element.email,
              flag: element.flag,
              point: element.point,
            });
          });
          res.status(200).json({ status: true, UserList: filterUserData });
        }
        // res.status(200).json({ 'status': true, 'message': 'Course Added Successfully' });
      }
    });
  }
 

  async createmed(req, res) {
    let createMed;
    if (req.body.id) {
      createMed = {
        id: req.body.id,
        name: req.body.name,
        price: req.body.price,
        seller: req.body.seller,
        product_desc: req.body.product_desc,
        offers: req.body.offers,
        current_price: req.body.current_price
      };
      var sql = "UPDATE med_product SET ? WHERE `id`= '" + req.body.id + "'";
    console.log(sql);
    connection.query(sql, createMed, function (error, result) {
      if (error) {
        console.log(">>>>>", error);
        res.send({ status: false, message: "Insertion error" });
      } else {
        res.send({ status: true, message: "Medicine updated Successfully" });
      }
    });
    } else {
      createMed = {
        name: req.body.name,
        price: req.body.price,
        seller: req.body.seller,
        product_desc: req.body.product_desc,
        offers: req.body.offers,
        current_price: req.body.current_price
      };
      var sql = "INSERT INTO med_product SET ?";
      console.log(sql);
      connection.query(sql, createMed, function (error, result) {
        if (error) {
          console.log(">>>>>", error);
          res.send({ status: false, message: "Insertion error" });
        } else {
          res.send({ status: true, message: "Medicine Created Successfully" });
        }
      });
    }

   
  }
  async getMedList(req, res) {
    var sql = "SELECT * FROM med_product";
    // console.log(sql);
    connection.query(sql, function (err, result) {
      if (err) res.send({ err: error });
      else {
        if (result == "") {
          res.send({ status: false, message: "No Data Found" });
        } else {
          res.send({ status: true, message: result });
        }
      }
    });
  }
  async getActiveMedList(req, res) {
    var sql = "SELECT * FROM med_product WHERE flag= 1";
    // console.log(sql);
    connection.query(sql, function (err, result) {
      if (err) res.send({ err: error });
      else {
        if (result == "") {
          res.send({ status: false, message: "No Data Found" });
        } else {
          res.send({ status: true, message: result });
        }
      }
    });
  }
  async activationMed(req, res) {
    var sql = "UPDATE med_product SET flag='"+req.body.flag+"' WHERE id = '" +req.body.id+"'";
    // console.log(sql);
    connection.query(sql, function (err, result) {
      if (err) res.send({ err: error });
      else {
        if (req.body.flag == 0) {
          res.send({ status: true, message: "Medicine Deactivate Successfull" });
        } else {
          res.send({ status: true, message: "Medicine Activate Successfull" });
        }
      }
    });
  }
 
 


  pdf(req, res) {
    let filePath = "pdf/demo.pdf";
    let options = { format: "A4", path: filePath };
    // Example of options with args //
    // let options = { format: 'A4', args: ['--no-sandbox', '--disable-setuid-sandbox'] };

    let file = { content: "<h1>Welcome to html-pdf-node</h1>" };
    // or //
    html_to_pdf.generatePdf(file, options).then((pdfBuffer) => {
      console.log("PDF Buffer:-", pdfBuffer);
      // res.download(filePath);
      res.send(path.join(__dirname, "/demo.pdf"));
    });
  }
  file(req, res) {
    let sampleFile;
    let uploadPath;
    console.log("..........", req.files);
    sampleFile = req.files.foo;

    uploadPath = "uploadfile/" + sampleFile.name;
    // console.log('/uploadfile/' + sampleFile.name)
    // return
    sampleFile.mv(uploadPath, function (err) {
      if (err) {
        // return res.send(err);
        console.log(">eeeeeeeeeeeeee", err);
      }
      res.send({
        success: true,
        path: path.join(__dirname + "/../", uploadPath),
      });
    });
  }
}

module.exports = new quaryHandaler();
