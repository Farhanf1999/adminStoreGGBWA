const mongoose = require("mongoose");

let voucherSchema = mongoose.Schema(
  {
    name: {
      type: String,
      require: [true, "Nama koin harus diisi"],
    },
    status: {
      type: String,
      enum: ["Y", "N"],
      default: "Y",
    },

    //Image
    thumbnial: {
      type: String,
    },
    //relation with category & nominals
    category: {
      type: mongoose.Schema.Types.ObjectID,
      ref: "Category", //Nama folder
    },
    nominals: [
      {
        type: mongoose.Schema.Types.ObjectID,
        ref: "Nominal",
      },
    ],
    user: {
      type: mongoose.Schema.Types.ObjectID,
      ref: "User", //Nama folder
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Voucher", voucherSchema);
