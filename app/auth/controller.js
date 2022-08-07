const Player = require("../player/models");
const path = require("path");
const fs = require("fs");
const config = require("../../config");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

module.exports = {
  signup: async (req, res, error) => {
    try {
      const payload = req.body;

      if (req.file) {
        let tmp_path = req.file.path;
        let originalExt =
          req.file.originalname.split(".")[
            req.file.originalname.split(".").length - 1
          ];
        let filename = req.file.filename + "." + originalExt;
        let target_path = path.resolve(
          config.rootPath,
          `public/uploads/${filename}`
        );
        const src = fs.createReadStream(tmp_path);
        const dest = fs.createWriteStream(target_path);

        src.pipe(dest);
        src.on("end", async () => {
          try {
            const player = new Player({ ...payload, avatar: filename });

            await player.save();
            delete player._doc.password;
            res.status(201).json({ message: "Success", data: player });
          } catch (error) {
            if (error && error.name === "ValidationError") {
              return res.status(422).json({
                error: 1,
                message: error.message,
                fields: error.errors,
              });
            }
            next(error);
          }
        });
      } else {
        let player = new Player(payload);
        await player.save();

        delete player._doc.password; //mongoose

        res.status(201).json({ data: player });
      }
      //test postman
      //   res.status(200).json({
      //     message: payload,
      //   });
      //
    } catch (error) {
      if (error && error.name === "ValidationError") {
        return res.status(422).json({
          error: 1,
          message: error.message,
          fields: error.errors,
        });
      }
      next(error);
    }
  },
  signin: (req, res, next) => {
    //then
    const { email, password } = req.body;
    Player.findOne({ email: email })
      .then((player) => {
        if (player) {
          const checkPassword = bcrypt.compareSync(password, player.password);
          if (checkPassword) {
            const token = jwt.sign(
              {
                player: {
                  id: player.id,
                  username: player.username,
                  email: player.email,
                  nama: player.nama,
                  phoneNumber: player.phoneNumber,
                  avatar: player.avatar,
                },
              },
              config.jwtKey
            );
            res
              .status(200)
              .json({
                message: `Success, Welcome ${player.email} `,
                data: { token },
              });
          } else {
            res.status(404).json({ message: "Password yg anda masukan salah" }); //forbidden
          }
        } else {
          res
            .status(403)
            .json({ message: "email yg anda masukan belum terdaftar" });
        }
      })
      .catch((error) => {
        res
          .status(500)
          .json({ message: error.message || "Internal Server Error" });
      });
  },
};
