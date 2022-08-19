const FreetimeController = function () {};

FreetimeController.prototype.get = function (req, res, next) {
  res.status(200).json({
    data: [
      "08:00-17:00 (2, 4, 6)",
      "08:00-17:00 (7 days)",
      "08:30-11:30 (7)",
      "18:00-21:00 (2, 4, 6)",
      "18:00-21:00 (3, 5)",
    ],
  });
};

module.exports = new FreetimeController();
