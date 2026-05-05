const { Op } = require("sequelize");
const Tought = require("../models/Tought");
const User = require("../models/User");

module.exports = class ToughtController {
  static async showToughts(req, res) {
    const message = req.flash("message")[0] || null;

    let search = "";
    let order = "DESC";

    if (req.query.search) {
      search = req.query.search;
    }

    if (req.query.order === "old") {
      order = "ASC";
    } else {
      order = "DESC";
    }

    const toughtsData = await Tought.findAll({
      include: User,
      order: [["createdAt", order]],
      where: {
        title: {
          [Op.like]: `%${search}%`,
        },
      },
    });

    const toughts = toughtsData.map((result) => result.dataValues);

    let toughtsQty = toughts.length;

    if (toughtsQty === 0) {
      toughtsQty = false;
    }

    res.render("toughts/home", { message, toughts, search, toughtsQty });
  }

  /* Exibe o dashboard do usuário com todos os pensamentos associados a ele */
  static async dashboard(req, res) {
    const userId = req.session.userId;

    const user = await User.findOne({
      where: { id: userId },
      include: Tought,
    });

    if (!user) {
      req.flash("message", "Usuário não encontrado.");

      return res.redirect("/login");
    }

    const toughts = user.Toughts.map((result) => result.dataValues);

    let emptyToughts = false;

    if (toughts.length === 0) {
      emptyToughts = true;
    }

    res.render("toughts/dashboard", { toughts, emptyToughts });
  }

  /* APENAS renderiza a view de criação de pensamento */
  static createTought(req, res) {
    res.render("toughts/create");
  }

  static async createToughtSave(req, res) {
    const tought = {
      title: req.body.title,
      userId: req.session.userId,
    };

    try {
      await Tought.create(tought);

      req.flash("message", "Pensamento criado com sucesso!");

      req.session.save(() => {
        res.redirect("/toughts/dashboard");
      });
    } catch (error) {
      req.flash("message", `Erro ao criar pensamento. ${error}`);

      console.log(error);
    }
  }

  static async updateTought(req, res) {
    const id = req.params.id;

    try {
      const tought = await Tought.findOne({ where: { id: id }, raw: true });

      res.render("toughts/edit", { tought });
    } catch (error) {
      req.flash("message", `Erro ao carregar pensamento. ${error}`);

      console.log(error);
    }
  }

  static async updateToughtSave(req, res) {
    const id = req.body.id;

    const tought = {
      title: req.body.title,
    };

    try {
      await Tought.update(tought, { where: { id: id } });

      req.flash("message", "Pensamento atualizado com sucesso!");

      req.session.save(() => {
        res.redirect("/toughts/dashboard");
      });
    } catch (error) {
      req.flash("message", `Erro ao atualizar pensamento. ${error}`);

      console.log(error);
    }
  }

  static async removeTought(req, res) {
    const toughtId = req.body.id;
    const userId = req.session.userId;

    try {
      await Tought.destroy({ where: { id: toughtId, userId: userId } });

      req.flash("message", "Pensamento excluído com sucesso!");

      req.session.save(() => {
        res.redirect("/toughts/dashboard");
      });
    } catch (error) {
      req.flash("message", `Erro ao excluir pensamento. ${error}`);

      console.log(error);
    }
  }
};
