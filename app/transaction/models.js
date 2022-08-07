const mongoose = require("mongoose");

let transactionSchema = mongoose.Schema({
  historyVoucherTopup: {
    gameName: { type: String, require: [true, "Nama game harus diisi"] },
    category: { type: String, require: [true, "Kategori harus diisi"] },
    thumbnail: { type: String },
    coinName: { type: String, require: [true, "Nama Coin harus diisi"] },
    coinQuantity: { type: String, require: [true, "Jumlah Coin harus diisi"] },
    price: { type: Number },
  },
  historyPayment: {
    name: { type: String, require: [true, "Nama game harus diisi"] },
    type: { type: String, require: [true, "Tipe pembayaran harus diisi"] },
    namaBank: { type: String, require: [true, "Nama bank harus diisi"] },
    noRekening: { type: String, require: [true, "Nomor rekening harus diisi"] },
  },
  name: {
    type: String,
    require: ["true", "Nama harus diiisi"],
    maxLength: [225, "Panjang nama harus antara 3 - 225 karakter"],
    minLength: [3, "Panjang nama harus antara 3 - 225 karakter"],
  },
  accountUser: {
    type: String,
    require: ["true", "Nama akun diiisi"],
    maxLength: [225, "Panjang nama harus antara 3 - 225 karakter"],
    minLength: [3, "Panjang nama harus antara 3 - 225 karakter"],
  },
  tax: {
    type: Number,
    default: 0,
  },
  value: {
    type: Number,
    default: 0,
  },
  status: {
    type: String,
    enum: ["pending", "success", "failed"],
    default: "pending",
  },
  player: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Player", //nama di schema mongoose.model("Player", playerSchema)
  },
  historyUser: {
    name: { type: String, require: [true, "Nama player harus diisi"] },
    phoneNumber: {
      type: Number,
      require: [true, "Nomor telefon harus diisi"],
      maxLength: [13, "Panjang no harus 9 - 13"],
      minLength: [9, "Panjang no harus 9 - 13"],
    },
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Player",
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
});

module.exports = mongoose.model("Transaction", transactionSchema);
