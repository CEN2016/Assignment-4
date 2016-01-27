
/* Dependencies */
var mongoose = require('mongoose'),
    Listing = require('../models/listings.server.model.js');
    config = require('../config/config.js');


/* Create a listing */
exports.create = function(req, res) {

  /* Instantiate a Listing */
  var listing = new Listing(req.body);

  /* save the coordinates (located in req.results if there is an address property) */
  if(req.results) {
    listing.coordinates = {
      latitude: req.results.lat,
      longitude: req.results.lng
    };
  }

  /* Then save the listing */
  listing.save(function(err) {
    if(err) {
      console.log(err);
      res.status(404).send(err);
    } else {
      res.json(listing);
      console.log('Created new listing');
    }
  });
};

/* Show the current listing */
exports.read = function(req, res) {
  /* send back the listing as json from the request */
  console.log('Read ' + req.listing.name);
  res.json(req.listing);
};

/* Update a listing */
exports.update = function(req, res) {
  var listing = req.listing;

  /* Save the article */
  if(req.body.name)
    listing.name = req.body.name;
  if(req.body.code)
    listing.code = req.body.code;
  if(req.body.address)
    listing.address = req.body.address;

  if(req.results) {
    listing.coordinates = {
      latitude: req.results.lat,
      longitude: req.results.lng
    };
  }


  listing.save(function(err) {
    if(err) {
      console.log(err);
      res.status(404).send(err);
    } else {
      res.json(listing);
      console.log('Listing updated.')
    }
  });
};

/* Delete a listing */
exports.delete = function(req, res) {
  var listing = req.listing;

  /* Remove the article */
  listing.remove(function(err) {
    if(err) {
      console.log(err);
      res.status(404).send(err);
    } else {
      res.json(listing);
      console.log('Listing removed.')
    }
  })
};

/* Retreive all the directory listings, sorted alphabetically by listing code */
exports.list = function(req, res) {
  /* Your code here */
  console.log("Lists");

   Listing.find({}, function(err, docs) {
   if(err) throw err;
   res.json(docs);
   console.log('Got docs ' + docs.length);
 });

  /* Remove the article */
};

/*
  Middleware: find a listing by its ID, then pass it to the next request handler.
*/
exports.listingByID = function(req, res, next, id) {
  Listing.findById(id).exec(function(err, listing) {
    if(err) {
      res.status(404).send(err);
    } else {
      req.listing = listing;
      if(listing)
        next();
      else {
        console.log('No such listing');
        res.json({});
      }
    }
  })
};
