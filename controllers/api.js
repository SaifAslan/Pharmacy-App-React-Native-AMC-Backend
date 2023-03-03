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
    `https://maps.googleapis.com/maps/api/place/nearbysearch/json?key=${process.env.GOOGLE_API_KEY}&keyword=pharmacy&location=${location}&rankby=distance&type=pharmacy`
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
          opem_now: pharmacy.opening_hours?.open_now,
          place_id: pharmacy.place_id,
        };
      });
      res.status(200).json(pharmacies);
    })
    .catch((err) => {
      res.status(500).json(err)
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};

exports.getPharmacy = (req, res, next) => {
  const errors = validationResult(req).errors;
  if (errors.length > 0) {
    console.log(errors);
    const error = new Error("Enter a valid location.");
    error.statusCode = 400;
    throw error;
  }

  let placeid = req.query.placeid;

  fetch(
    `https://maps.googleapis.com/maps/api/place/details/json?placeid=${placeid}&key=${process.env.GOOGLE_API_KEY}`
  )
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      let result = data.result;
      let pharmacy = {
        weekday_text: result?.current_opening_hours?.weekday_text,
        formatted_address: result.formatted_address,
        international_phone_number:
          result.international_phone_number ?? result.formatted_phone_number,
        icon_background_color: result.icon_background_color,
        place_id: result.place_id,
        rating: result.rating,
        wheelchair_accessible_entrance: result.wheelchair_accessible_entrance,
        delivery: result.delivery,
        reviews: result.reviews?.map((review) => ({
          author_name: review.author_name,
          profile_photo_url: review.profile_photo_url,
          rating: review.rating,
          relative_time_description: review.relative_time_description,
          text: review.text,
        })),
      };
      res.status(200).json(pharmacy);
    })
    .catch((err) => {
      res.status(500).json(err)

      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};
