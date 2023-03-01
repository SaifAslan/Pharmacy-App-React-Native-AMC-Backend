const { validationResult } = require("express-validator");
const fetch = (...args) =>
  import("node-fetch").then(({ default: fetch }) => fetch(...args));

exports.getPharmacies = (req, res, next) => {
  const errors = validationResult(req).errors;
  if (errors.length > 0) {
    console.log(errors);
    const error = new Error("Enter a valid location.");
    error.statusCode = 400;
    throw error;
  }

  let location = req.query.location;
  fetch(
    `https://maps.googleapis.com/maps/api/place/nearbysearch/json?key=${process.env.GOOGLE_API_KEY}&keyword=pharmacy&location=${location}&radius=1500&type=pharmacy`
  )
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      let pharmacies = data.results.map((pharmacy) => {
        return {
          icon: pharmacy.icon,
          name: pharmacy.name,
          address: pharmacy.vicinity,
          location: pharmacy.geometry.location,
          opem_now: pharmacy.opening_hours.open_now,
          place_id: pharmacy.place_id,
        };
      });
      res.status(200).json(pharmacies);
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};
