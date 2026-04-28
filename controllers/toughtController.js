const Tought = require("../models/Tought");
const User = require("../models/User");

module.exports = class ToughtController {
  static async showToughts(req, res) {
    const message = req.flash("message")[0] || null;

    res.render("toughts/home", { message });
  }
};
