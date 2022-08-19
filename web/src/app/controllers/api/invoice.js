const InvoiceModel = require("../../models/invoice");

const InvoiceController = function () {};

InvoiceController.prototype.get = async (req, res, next) => {
  const { id: LearnerID } = req.user;

  const Invoices = await InvoiceModel.find("*", `LearnerID = "${LearnerID}"`);
  res.status(200).json({ data: Invoices });
};

InvoiceController.prototype.post = async (req, res, next) => {
  const { id: LearnerID } = req.user;
  const { CourseID, Quality, ItemPrice } = req.body;

  const newInvoice = new InvoiceModel({
    LearnerID,
    CourseID,
    Quality,
    ItemPrice,
  });

  try {
    const _ = await newInvoice.create();
    res.status(200).json(newInvoice);
  } catch (err) {
    res.status(500).json({msg: "Something wrong when create a new invoice. Please try again"})
  }

};

module.exports = new InvoiceController();
