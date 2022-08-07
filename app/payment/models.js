const mongoose = require("mongoose");
let paymentSchema = mongoose.Schema(
  {
    tipe: {
      type: String,
      require: [true, "Tipe harus diisi"],
    },
    status: {
      type: String,
      enum: ["Y", "N"],
      default: "Y",
    },
    bank: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Bank",
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Payment", paymentSchema);
