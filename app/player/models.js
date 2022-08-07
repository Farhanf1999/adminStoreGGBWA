const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const HAS_ROUND = 10;
let playerSchema = mongoose.Schema(
  {
    role: {
      type: String,
      enum: ["admin", "user"],
      default: "user",
    },
    email: {
      type: String,
    },
    password: {
      type: String,
      require: [true, "Password harus diisi"],
      maxLength: [225, "Panjang password max 225 karakter"],
    },
    name: {
      type: String,
      require: [true, "Nama harus diisi"],
      maxLength: [225, "Panjang nama harus antara 3 - 225 karakter"],
      minLength: [3, "Panjang nama harus antara 3 - 225 karakter"],
    },
    username: {
      type: String,
      require: [true, "Username harus diisi"],
      maxLength: [225, "Panjang nama harus antara 3 - 225 karakter"],
      minLength: [3, "Panjang nama harus antara 3 - 225 karakter"],
    },
    status: {
      type: String,
      enum: ["Y", "N"],
      default: "Y",
    },
    phoneNumber: {
      type: Number,
      require: [true, "Nomor telepon harus diisi"],
      maxLength: [13, "Panjang nomor harus antara 9-13 karakter"],
      minLength: [9, "Panjang nomor harus antara 9-13 karakter"],
    },
    avatar: {
      type: String,
    },
    fileName: {
      type: String,
    },
    favorite: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
    },
  },
  { timestamps: true }
);
playerSchema.path("email").validate(
  async function (value) {
    try {
      const count = await this.model("Player").countDocuments({ email: value });
      return !count;
    } catch (error) {
      throw error;
    }
  },
  (attr) => `${attr.value} sudah terdaftar`
);

playerSchema.pre("save", function (next) {
  this.password = bcrypt.hashSync(this.password, HAS_ROUND);
  next();
});

module.exports = mongoose.model("Player", playerSchema);
