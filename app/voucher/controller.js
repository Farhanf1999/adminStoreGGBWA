const Voucher = require("./models");
const Category = require("../category/models");
const Nominal = require("../nominal/models");
const path = require("path");
const fs = require("fs");
const config = require("../../config");

module.exports = {
  index: async (req, res) => {
    try {
      const alertMessage = req.flash("alertMessage");
      const alertStatus = req.flash("alertStatus");
      const alert = {
        message: alertMessage,
        status: alertStatus,
      };
      const voucher = await Voucher.find()
        .populate("category")
        .populate("nominals");
      // console.log("voucher >>" + voucher);
      //Menampilkan data dari category & nominal = populate

      res.render("admin/voucher/view_voucher", {
        voucher,
        alert,
        name: req.session.user.name,
        title: "Halaman Voucher",
      });
    } catch (error) {
      req.flash("alertMessage", `${error.message}`);
      req.flash("alertStatus", "danger");
      res.redirect("/voucher");
    }
  },
  viewCreate: async (req, res) => {
    try {
      const category = await Category.find();
      const nominal = await Nominal.find();
      res.render("admin/voucher/create", {
        category,
        nominal,
        name: req.session.user.name,
        title: "Halaman Voucher",
      });
    } catch (error) {
      req.flash("alertMessage", `${error.message}`);
      req.flash("alertStatus", "danger");
      res.redirect("/voucher");
    }
  },
  actionCreate: async (req, res) => {
    try {
      const { name, category, nominals } = req.body;
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
            const voucher = new Voucher({
              name,
              category,
              nominals,
              thumbnial: filename,
            });

            await voucher.save();
            req.flash("alertMessage", "Berhasil Menambah Voucher");
            req.flash("alertStatus", "success");
            res.redirect("/voucher");
          } catch (error) {
            req.flash("alertMessage", `${error.message}`);
            req.flash("alertStatus", "danger");
            res.redirect("/voucher");
          }
        });
      } else {
        // const voucher = new Voucher({
        //   name,
        //   category,
        //   nominals,
        // });
        try {
          const voucher = new Voucher({
            name,
            category,
            nominals,
            // thumbnial: filename,
          });

          await voucher.save();
          req.flash("alertMessage", "Berhasil Menambah Voucher");
          req.flash("alertStatus", "success");
          res.redirect("/voucher");
        } catch (error) {
          req.flash("alertMessage", `${error.message}`);
          req.flash("alertStatus", "danger");
          res.redirect("/voucher");
        }
      }
    } catch (error) {
      req.flash("alertMessage", `${error.message}`);
      req.flash("alertStatus", "danger");
      res.redirect("/voucher");
    }
  },
  viewEdit: async (req, res) => {
    try {
      const { id } = req.params;
      const category = await Category.find();
      const nominal = await Nominal.find();
      const voucher = await Voucher.findOne({ _id: id })
        .populate("category")
        .populate("nominals");
      //Populate nama collections - SQL(Relation)
      res.render("admin/voucher/edit", {
        voucher,
        category,
        nominal,
        name: req.session.user.name,
        title: "Halaman Voucher",
      });
    } catch (error) {
      req.flash("alertmessage", `${error.message}`);
      req.flash("alertStatus", "danger");
      res.redirect("/voucher");
    }
  },
  actionEdit: async (req, res) => {
    try {
      const { id } = req.params;
      const { name, category, nominals } = req.body;
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
            const voucher = await Voucher.findOne({ _id: id });
            let currentImage = `${config.rootPath}/public/uploads/${voucher.thumbnial}`;
            //Cek apakah ada image didalam folder
            if (fs.existsSync(currentImage)) {
              fs.unlinkSync(currentImage);
            }
            await Voucher.findOneAndUpdate(
              {
                _id: id,
              },
              { name, category, nominals, thumbnial: filename }
            );

            req.flash("alertMessage", "Berhasil Ubah Voucher");
            req.flash("alertStatus", "success");
            res.redirect("/voucher");
          } catch (error) {
            req.flash("alertMessage", `${error.message}`);
            req.flash("alertStatus", "danger");
            res.redirect("/voucher");
          }
        });
      } else {
        await Voucher.findOneAndUpdate(
          {
            _id: id,
          },
          { name, category, nominals }
        );
        req.flash("alertMessage", "Berhasil Ubah Voucher");
        req.flash("alertStatus", "success");
        res.redirect("/voucher");
      }
    } catch (error) {
      req.flash("alertMessage", `${error.message}`);
      req.flash("alertStatus", "danger");
      res.redirect("/voucher");
    }
  },
  actionDelete: async (req, res) => {
    try {
      const { id } = req.params;
      await Voucher.findOneAndDelete({
        _id: id,
      });
      req.flash("alertMessage", "Berhasil Menghapus Data");
      req.flash("alertStatus", "success");
      res.redirect("/voucher");
    } catch (error) {
      req.flash("alertMessage", `${error.message}`);
      req.flash("alertStatus", "success");
      res.redirect("/voucher");
    }
  },
  actionStatus: async (req, res) => {
    try {
      const { id } = req.params;
      const voucher = await Voucher.findOne({ _id: id });
      let status = voucher.status === "Y" ? "N" : "Y";

      voucher = await Voucher.findOneAndUpdate(
        {
          _id: id,
        },
        { status }
      );
      req.flash("alertMessage", "Berhasil Menghapus Data");
      req.flash("alertStatus", "success");
      res.redirect("/voucher");
    } catch (error) {
      req.flash("alertMessage", `${error.message}`);
      req.flash("alertStatus", "success");
      res.redirect("/voucher");
    }
  },
};
