//1. Require Mongoose
//2. Mongoose Schema
//3. isi didalam tabel (object)
//4. export modul exports (mongoose.model('Nama model', nama schema))
const mongoose = require("mongoose");
let bankSchema = mongoose.Schema(
  {
    name: {
      type: String,
      require: [true, "Nama pemilik harus diisi"],
    },
    namaBank: {
      type: String,
      require: [true, "Nama Bank harus diisi"],
    },
    noRekening: {
      type: Number,
      require: [true, "No Rekening harus diisi"],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Bank", bankSchema);
