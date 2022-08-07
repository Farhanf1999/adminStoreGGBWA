const Payment = require("./models");
const Bank = require("../bank/models");

module.exports = {
  index: async (req, res) => {
    try {
      const alertMessage = req.flash("alertMessage");
      const alertStatus = req.flash("alertStatus");
      const alert = { message: alertMessage, status: alertStatus };

      const payment = await Payment.find().populate("bank"); //bank = nama object
      res.render("admin/payment/view_payment", {
        payment,
        alert,
        name: req.session.user.name,
        title: "Halaman Payment",
      });
    } catch (error) {
      req.flash("alertMessage", `${error.message}`);
      req.flash("alertStatus", "danger");
      res.redirect("/payment");
    }
  },
  viewCreate: async (req, res) => {
    try {
      const bank = await Bank.find();
      res.render("admin/payment/create", {
        bank,
        name: req.session.user.name,
        title: "Halaman Payment",
      });
    } catch (error) {
      req.flash("alertMessage", `${error.message}`);
      req.flash("alertStatus", "danger");
      res.redirect("/payment");
    }
  },
  actionCreate: async (req, res) => {
    try {
      const { tipe, bank } = req.body;
      const payment = await Payment({ tipe, bank });
      await payment.save();
      req.flash("alertMessage", "Berhasil Menambahkan Data");
      req.flash("alertStatus", "success");
      res.redirect("/payment");
    } catch (error) {
      req.flash("alertMessage", `${error.message}`);
      req.flash("alertStatus", "danger");
      res.redirect("/payment");
    }
  },

  actionStatus: async (req, res) => {
    try {
      const { id } = req.params;
      const payment = await Payment.findOne({ _id: id });
      let status = payment.status === "Y" ? "N" : "Y";
      await Payment.findOneAndUpdate(
        {
          _id: id,
        },
        { status }
      );
      req.flash("alertMessage", "Berhasil Menbugah Status");
      req.flash("alertStatus", "success");
      res.redirect("/payment");
    } catch (error) {
      req.flash("alertMessage", `${error.message}`);
      req.flash("alertStatus", "danger");
      req.flash("/payment");
    }
  },
  viewEdit: async (req, res) => {
    try {
      const { id } = req.params;
      const bank = await Bank.find();
      const payment = await Payment.findOne({ _id: id }).populate("bank");
      res.render("admin/payment/edit", {
        payment,
        bank,
        name: req.session.user.name,
        title: "Halaman Payment",
      });
    } catch (error) {
      req.flash("alertMessage", `${error.message}`);
      req.flash("alertStatus", "danger");
      req.flash("/payment");
    }
  },
  actionEdit: async (req, res) => {
    try {
      const { id } = req.params;
      const { tipe, bank } = req.body;

      await Payment.findOneAndUpdate({ _id: id }, { tipe, bank });
      req.flash("alertMessage", "Berhasil Mengubah Data");
      req.flash("alertStatus", "success");
      res.redirect("/payment");
    } catch (error) {
      req.flash("alertMessage", `${error.message}`);
      req.flash("alertStatus", "success");
      res.redirect("/payment");
    }
  },
  actionDelete: async (req, res) => {
    try {
      const { id } = req.params;
      const payment = await Payment.findOne();
      await Payment.findOneAndDelete(
        { _id: id },
        {
          payment,
        }
      );
      req.flash("alertMessage", "Berhasil Menghapus Data");
      req.flash("alertStatus", "success");
      res.redirect("/payment");
    } catch (error) {
      req.flash("alertMessage", `${error.message}`);
      req.flash("alertStatus", "success");
      res.redirect("/payment");
    }
  },
};
