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

module.exports = router;
