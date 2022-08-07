const Player = require("./models");
let Voucher = require("../voucher/models");
let Category = require("../category/models");
let Nominal = require("../nominal/models");
let Bank = require("../bank/models");
let Payment = require("../payment/models");
let Transaction = require("../transaction/models");
module.exports = {
  landingPage: async (req, res) => {
    try {
      const voucher = await Voucher.find()
        .select("_id name status category thumbnial")
        .populate("category");
      res.status(200).json({ data: voucher });
    } catch (error) {
      res
        .status(500)
        .json({ message: error.message || "Terjadi kelasahan pada server" });
    }
  },
  detailPage: async (req, res) => {
    try {
      const { id } = req.params;
      const voucher = await Voucher.findOne({ _id: id })
        //find = data []
        //findone = message error
        .populate("category")
        .populate("nominals")
        .populate("user", "_id name phoneNumber ");

      if (!voucher) {
        res.status(404).json({ message: `Voucher ${id} not found !` });
      }

      res.status(200).json({ data: voucher });
    } catch (error) {
      res
        .status(500)
        .json({ message: error.message || "Terjadi kelasahan pada server" });
    }
  },
  category: async (req, res) => {
    try {
      const category = await Category.find();
      res.status(200).json({ data: category });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },
  checkout: async (req, res) => {
    try {
      const { accountUser, name, nominal, voucher, payment, bank } = req.body;

      const res_voucher = await Voucher.findOne({ _id: voucher })
        .select("name category _id thumbnail user")
        .populate("category")
        .populate("user");

      if (res_voucher == false)
        return res
          .status(404)
          .json({ message: "Voucher game tidak ditemukan" });

      const res_nominal = await Nominal.findOne({ _id: nominal });
      if (res_nominal == false)
        return res.status(404).json({ message: "Nominal tidak ditemukan" });
      const res_payment = await Payment.findOne({ _id: payment });
      if (!res_payment)
        return res.status(404).json({ message: "Payment tidak ditemukan" });
      const res_bank = await Bank.findOne({ _id: bank });
      if (!res_bank)
        return res.status(404).json({ message: "Bank tidak ditemukan" });
      const tax = (10 / 100) * res_nominal._doc.price;
      const value = res_nominal._doc.price - tax;

      console.log(" >>>>> ");
      console.log(res_payment._doc);
      const payload = {
        historyVoucherTopup: {
          gameName: res_voucher._doc.name,
          category: res_voucher._doc.category
            ? res_voucher._doc.category.name
            : " ",
          thumbnail: res_voucher._doc.thumbnail,
          coinName: res_nominal._doc.coinName,
          coinQuantity: res_nominal._doc.coinQuantity,
          price: res_nominal._doc.price,
        },
        historyPayment: {
          name: res_bank._doc.name,
          type: res_payment._doc.type,
          namaBank: res_bank._doc.namaBank,
          noRekening: res_bank._doc.noRekening,
        },
        name: name,
        accountUser: accountUser,
        tax: tax,
        value: value,
        player: req.player._id,
        historyUser: {
          name: res_voucher._doc.user?.name,
          phoneNumber: res_voucher._doc.user?.phoneNumber,
        },
        category: res_voucher._doc.category?._id,
        user: res_voucher._doc.user?._id,
      };

      const transaction = new Transaction(payload);
      await transaction.save();
      res.status(201).json({ data: payload });
    } catch (error) {
      res
        .status(500)
        .json({ message: error.message || "Internal Server Error" });
    }
  },
  history: async (req, res) => {
    try {
      const { status = "" } = req.query; //postman
      let criteria = {};
      if (status.length) {
        criteria = {
          ...criteria,
          status: { $regex: `${status}`, $options: "i" },
          //regex = validais
          //option: i = match uppercase & lowercase in str
        };
      }
      if (req.player._id) {
        criteria = {
          ...criteria,
          player: req.player._id,
        };
      }
      const history = await Transaction.find(criteria);
      //agregate = return computed result
      const total = await Transaction.aggregate([
        { $match: criteria },
        {
          $group: {
            _id: null,
            value: { $sum: "$value" },
          },
        },
      ]);

      res.status(201).json({
        data: history,
        total: total.length ? total[0].value : 0,
      });
    } catch (error) {
      res
        .status(500)
        .json({ message: error.message || "Internal Server Error" });
    }
  },
};
