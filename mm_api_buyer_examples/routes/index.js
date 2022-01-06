var express = require('express');
var router = express.Router();
var mm_api = require('../src/mercadomype_api');

// Home page
router.get('/', function(req, res, next) {
  res.render('index', { });
});

// Process: Get security token
router.get('/getToken', async function(req, res, next) {
  let apikey = req.query.apikey;
  mm_api.setEnvironment('integration'); // or 'production'
  res.json( await mm_api.getToken(apikey) );
});

// Process: Get buyer information
router.get('/getBuyerInformation', async function(req, res, next) {
  let token = req.query.token;
  mm_api.setEnvironment('integration'); // or 'production'
  res.json( await mm_api.getBuyerInformation(token) );
});

// Process: Get sellers information
router.get('/getSellersInformation', async function(req, res, next) {
  let token = req.query.token;
  mm_api.setEnvironment('integration'); // or 'production'
  res.json( await mm_api.getSellers(token) );
});

// Process: Get documents programmed for payment
router.get('/getProgrammedDocuments', async function(req, res, next) {
  let token = req.query.token;
  mm_api.setEnvironment('integration'); // or 'production'
  res.json( await mm_api.getProgrammedDocuments(token) );
});

// Process: Get documents with advance payment requested
router.get('/getAdvanceRequestedDocuments', async function(req, res, next) {
  let token = req.query.token;
  mm_api.setEnvironment('integration'); // or 'production'
  res.json( await mm_api.getAdvanceRequestedDocuments(token) );
});

// Process: Get documents with advance payment requested
router.get('/testIntegration', async function(req, res, next) {
  let log = [ { dt: mm_api.timestamp(), event: 'Starting test'} ];

  let apikey = req.query.apikey;
  mm_api.setEnvironment('integration'); // or 'production'

  // Get a security token
  tmp = await mm_api.getToken(apikey)
  if(!tmp.success) {
    log.push({ dt: mm_api.timestamp(), event: 'Error retrieving token', data: tmp });
    res.json(log);
    return;
  }
  token = tmp.result;
  log.push({ dt: mm_api.timestamp(), event: 'Token retrieved'});

  // Upload three hypothetical invoices
  let invoices = [
    {
      "provider": "Riskolabs",
      "comment": "Integration test 1",
      "ruc": "24242424241",
      //"rucCreditor": "",
      "number": "F100_TEST_001",
      "amount": 11000,
      "netoutcome": 6422.4,
      "netincome": 12980,
      "deductions": -1557.6,
      "discounts": -5000,
      "amountPaid": 6422.4,
      "paydate": null,
      "paydatesCheduled": null,
      "currency": "USD",
      "typeDocument": "FACTURA",
      "issuedate": "2022-01-01T00:00:00.000Z",
      "observations": "None",
      "enableDetraction": false,
      "status": "RECEIVED",
      "IGV": 1980
    },
    {
      "provider": "Riskolabs",
      "comment": "Integration test 2",
      "ruc": "24242424241",
      //"rucCreditor": "",
      "number": "F100_TEST_002",
      "amount": 11000,
      "netoutcome": 6422.4,
      "netincome": 12980,
      "deductions": -1557.6,
      "discounts": -5000,
      "amountPaid": 6422.4,
      "paydate": null,
      "paydatesCheduled": "2030-02-02T01:00:00.000Z",
      "currency": "USD",
      "typeDocument": "FACTURA",
      "issuedate": "2022-02-02T01:00:00.000Z",
      "observations": "None",
      "enableDetraction": false,
      "status": "PROGRAMMED",
      "IGV": 1980
    }
  ];

  /*tmp = await mm_api.addDocuments(token, invoices);
  if(!tmp.success) {
    log.push({ dt: mm_api.timestamp(), event: 'Error uploading invoices', data: tmp });
    res.json(log);
    return;
  }*/
  log.push({ dt: mm_api.timestamp(), event: 'Two invoices uploaded'});

  // Get documents with requested advance payment
  tmp = await mm_api.getAdvanceRequestedDocuments(token);
  if(!tmp.success) {
    log.push({ dt: mm_api.timestamp(), event: 'Error retrieving advance payment requests', data: tmp });
    res.json(log);
    return;
  }
  log.push({ dt: mm_api.timestamp(), event: 'Advance payment requests retrieved'});

  // Delete just-inserted invoices
  tmp = await mm_api.deleteDocument(token,'24242424241','F100_TEST_001');
  if(!tmp.success) {
    log.push({ dt: mm_api.timestamp(), event: 'Error deleting first document', data: tmp });
    res.json(log);
    return;
  }
  log.push({ dt: mm_api.timestamp(), event: 'First document deleted'});

  tmp = await mm_api.deleteDocument(token,'24242424241','F100_TEST_002');
  if(!tmp.success) {
    log.push({ dt: mm_api.timestamp(), event: 'Error deleting second document', data: tmp });
    res.json(log);
    return;
  }
  log.push({ dt: mm_api.timestamp(), event: 'Second document deleted'});  



  res.json(log);
});

module.exports = router;
