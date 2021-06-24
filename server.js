/*
###
###
###
###
###
###
###
###
###
###
###
###       PLEASE DO NOT EDIT THIS FILE
###       FOR DevMastery TESTING PURPOSES!
###
###       THIS FILE IS FOR DevMastery TO BE ABLE TO TEST YOUR CODE PROPERLY
###       CHANGING THIS FILE CAN BREAK THE PROCESS OF VERIFICATION

██████╗░███████╗██╗░░░██╗███╗░░░███╗░█████╗░░██████╗████████╗███████╗██████╗░██╗░░░██╗
██╔══██╗██╔════╝██║░░░██║████╗░████║██╔══██╗██╔════╝╚══██╔══╝██╔════╝██╔══██╗╚██╗░██╔╝
██║░░██║█████╗░░╚██╗░██╔╝██╔████╔██║███████║╚█████╗░░░░██║░░░█████╗░░██████╔╝░╚████╔╝░
██║░░██║██╔══╝░░░╚████╔╝░██║╚██╔╝██║██╔══██║░╚═══██╗░░░██║░░░██╔══╝░░██╔══██╗░░╚██╔╝░░
██████╔╝███████╗░░╚██╔╝░░██║░╚═╝░██║██║░░██║██████╔╝░░░██║░░░███████╗██║░░██║░░░██║░░░
╚═════╝░╚══════╝░░░╚═╝░░░╚═╝░░░░░╚═╝╚═╝░░╚═╝╚═════╝░░░░╚═╝░░░╚══════╝╚═╝░░╚═╝░░░╚═╝░░░

###
###
###
###
###
###
###
###
###
###
*/

const express = require("express");
const app = express();
app.use(express.static("public"))
let mongoose;
try {
  mongoose = require("mongoose");
} catch (e) {
  console.log(e);
}
const fs = require("fs");
const path = require("path");
const bodyParser = require("body-parser");
const router = express.Router();

const cors = require("cors");
app.use(cors());

const TIMEOUT = 10000;

app.use(bodyParser.urlencoded({ extended: "false" }));
app.use(bodyParser.json());

app.get("/", function (req, res) {
  res.sendFile(path.join(__dirname, "views", "index.html"));
});

router.get("/file/*?", function (req, res, next) {
  if (req.params[0] === ".env") {
    return next({ status: 401, message: "ACCESS DENIED" });
  }
  fs.readFile(path.join(__dirname, req.params[0]), function (err, data) {
    if (err) {
      return next(err);
    }
    res.type("txt").send(data.toString());
  });
});

router.get("/is-mongoose-ok", function (req, res) {
  if (mongoose) {
    res.json({ isMongooseOk: !!mongoose.connection.readyState });
  } else {
    res.json({ isMongooseOk: false });
  }
});

const User = require("./main.js").UserModel;

router.use(function (req, res, next) {
  if (req.method !== "OPTIONS" && User.modelName !== "User") {
    return next({ message: "User Model is not correct" });
  }
  next();
});

router.post("/mongoose-model", function (req, res, next) {
  let p;
  p = new User(req.body);
  res.json(p);
});

const createUser = require("./main.js").createAndSaveUser;
router.get("/create-and-save-user", function (req, res, next) {
  let t = setTimeout(() => {
    next({ message: "timeout" });
  }, TIMEOUT);
  createUser(function (err, data) {
    clearTimeout(t);
    if (err) {
      return next(err);
    }
    if (!data) {
      console.log("Missing `done()` argument");
      return next({ message: "Missing callback argument" });
    }
    User.findById(data._id, function (err, pers) {
      if (err) {
        return next(err);
      }
      res.json(pers);
      pers.remove();
    });
  });
});

const createUsers = require("./main.js").createManyUsers;
router.post("/create-many-users", function (req, res, next) {
  User.remove({}, function (err) {
    if (err) {
      return next(err);
    }
    let t = setTimeout(() => {
      next({ message: "timeout" });
    }, TIMEOUT);
    createUsers(req.body, function (err, data) {
      clearTimeout(t);
      if (err) {
        return next(err);
      }
      if (!data) {
        console.log("Missing `done()` argument");
        return next({ message: "Missing callback argument" });
      }
      User.find({}, function (err, pers) {
        if (err) {
          return next(err);
        }
        res.json(pers);
        User.remove().exec();
      });
    });
  });
});

const findByLastName = require("./main.js").findUsersByLastName;
router.post("/find-all-by-last-name", function (req, res, next) {
  let t = setTimeout(() => {
    next({ message: "timeout" });
  }, TIMEOUT);
  User.create(req.body, function (err, pers) {
    if (err) {
      return next(err);
    }
    findByLastName(pers.lastName, function (err, data) {
      clearTimeout(t);
      if (err) {
        return next(err);
      }
      if (!data) {
        console.log("Missing `done()` argument");
        return next({ message: "Missing callback argument" });
      }
      res.json(data);
      User.remove().exec();
    });
  });
});

const findByLanguage = require("./main.js").findOneUserBySpokenLanguage;
router.post("/find-one-by-language", function (req, res, next) {
  let t = setTimeout(() => {
    next({ message: "timeout" });
  }, TIMEOUT);
  let p = new User(req.body);
  p.save(function (err, pers) {
    if (err) {
      return next(err);
    }
    findByLanguage(pers.spokenLanguages[0], function (err, data) {
      clearTimeout(t);
      if (err) {
        return next(err);
      }
      if (!data) {
        console.log("Missing `done()` argument");
        return next({ message: "Missing callback argument" });
      }
      res.json(data);
      p.remove();
    });
  });
});

const findById = require("./main.js").findUserById;
router.get("/find-by-id", function (req, res, next) {
  let t = setTimeout(() => {
    next({ message: "timeout" });
  }, TIMEOUT);
  let p = new User({ firstName: "John", lastName: "Doe", email: "johndoe@gmail.com", birthYear: 2000, spokenLanguages: ["arabic"] });
  p.save(function (err, pers) {
    if (err) {
      return next(err);
    }
    findById(pers._id, function (err, data) {
      clearTimeout(t);
      if (err) {
        return next(err);
      }
      if (!data) {
        console.log("Missing `done()` argument");
        return next({ message: "Missing callback argument" });
      }
      res.json(data);
      p.remove();
    });
  });
});

const findEdit = require("./main.js").findEditThenSave;
router.post("/find-edit-save", function (req, res, next) {
  let t = setTimeout(() => {
    next({ message: "timeout" });
  }, TIMEOUT);
  let p = new User(req.body);
  p.save(function (err, pers) {
    if (err) {
      return next(err);
    }
    try {
      findEdit(pers._id, function (err, data) {
        clearTimeout(t);
        if (err) {
          return next(err);
        }
        if (!data) {
          console.log("Missing `done()` argument");
          return next({ message: "Missing callback argument" });
        }
        res.json(data);
        p.remove();
      });
    } catch (e) {
      console.log(e);
      return next(e);
    }
  });
});

const update = require("./main.js").findAndUpdate;
router.post("/find-one-update", function (req, res, next) {
  let t = setTimeout(() => {
    next({ message: "timeout" });
  }, TIMEOUT);
  let p = new User(req.body);
  p.save(function (err, pers) {
    if (err) {
      return next(err);
    }
    try {
      update(pers.email, function (err, data) {
        clearTimeout(t);
        if (err) {
          return next(err);
        }
        if (!data) {
          console.log("Missing `done()` argument");
          return next({ message: "Missing callback argument" });
        }
        res.json(data);
        p.remove();
      });
    } catch (e) {
      console.log(e);
      return next(e);
    }
  });
});

const removeOne = require("./main.js").removeById;
router.post("/remove-one-user", function (req, res, next) {
  User.remove({}, function (err) {
    if (err) {
      return next(err);
    }
    let t = setTimeout(() => {
      next({ message: "timeout" });
    }, TIMEOUT);
    let p = new User(req.body);
    p.save(function (err, pers) {
      if (err) {
        return next(err);
      }
      try {
        removeOne(pers._id, function (err, data) {
          clearTimeout(t);
          if (err) {
            return next(err);
          }
          if (!data) {
            console.log("Missing `done()` argument");
            return next({ message: "Missing callback argument" });
          }
          console.log(data);
          User.count(function (err, cnt) {
            if (err) {
              return next(err);
            }
            data = data.toObject();
            data.count = cnt;
            console.log(data);
            res.json(data);
          });
        });
      } catch (e) {
        console.log(e);
        return next(e);
      }
    });
  });
});

const removeMany = require("./main.js").removeManyUsers;
router.post("/remove-many-users", function (req, res, next) {
  User.remove({}, function (err) {
    if (err) {
      return next(err);
    }
    let t = setTimeout(() => {
      next({ message: "timeout" });
    }, TIMEOUT);
    User.create(req.body, function (err, pers) {
      if (err) {
        return next(err);
      }
      try {
        removeMany(function (err, data) {
          clearTimeout(t);
          if (err) {
            return next(err);
          }
          if (!data) {
            console.log("Missing `done()` argument");
            return next({ message: "Missing callback argument" });
          }
          User.count(function (err, cnt) {
            if (err) {
              return next(err);
            }
            if (data.ok === undefined) {
              // for mongoose v4
              try {
                data = JSON.parse(data);
              } catch (e) {
                console.log(e);
                return next(e);
              }
            }
            res.json({
              n: data.n,
              count: cnt,
              ok: data.ok,
            });
          });
        });
      } catch (e) {
        console.log(e);
        return next(e);
      }
    });
  });
});

const chain = require("./main.js").queryChain;
router.post("/query-tools", function (req, res, next) {
  let t = setTimeout(() => {
    next({ message: "timeout" });
  }, TIMEOUT);
  User.remove({}, function (err) {
    if (err) {
      return next(err);
    }
    User.create(req.body, function (err, pers) {
      if (err) {
        return next(err);
      }
      try {
        chain(function (err, data) {
          clearTimeout(t);
          if (err) {
            return next(err);
          }
          if (!data) {
            console.log("Missing `done()` argument");
            return next({ message: "Missing callback argument" });
          }
          res.json(data);
        });
      } catch (e) {
        console.log(e);
        return next(e);
      }
    });
  });
});

app.use("/_api", router);

// Error handler
app.use(function (err, req, res, next) {
  if (err) {
    res
      .status(err.status || 500)
      .type("txt")
      .send(err.message || "SERVER ERROR");
  }
});

// Unmatched routes handler
app.use(function (req, res) {
  if (req.method.toLowerCase() === "options") {
    res.end();
  } else {
    res.status(404).type("txt").send("Not Found");
  }
});

const PORT = process.env.PORT || 9000;

app.listen(PORT, function () {
  console.log(`Server is listening at http://localhost:${PORT}`);
});

/*
###
###
###
###
###
###
###
###
###
###
###
###       PLEASE DO NOT EDIT THIS FILE
###       FOR DevMastery TESTING PURPOSES!
###
###       THIS FILE IS FOR DevMastery TO BE ABLE TO TEST YOUR CODE PROPERLY
###       CHANGING THIS FILE CAN BREAK THE PROCESS OF VERIFICATION

██████╗░███████╗██╗░░░██╗███╗░░░███╗░█████╗░░██████╗████████╗███████╗██████╗░██╗░░░██╗
██╔══██╗██╔════╝██║░░░██║████╗░████║██╔══██╗██╔════╝╚══██╔══╝██╔════╝██╔══██╗╚██╗░██╔╝
██║░░██║█████╗░░╚██╗░██╔╝██╔████╔██║███████║╚█████╗░░░░██║░░░█████╗░░██████╔╝░╚████╔╝░
██║░░██║██╔══╝░░░╚████╔╝░██║╚██╔╝██║██╔══██║░╚═══██╗░░░██║░░░██╔══╝░░██╔══██╗░░╚██╔╝░░
██████╔╝███████╗░░╚██╔╝░░██║░╚═╝░██║██║░░██║██████╔╝░░░██║░░░███████╗██║░░██║░░░██║░░░
╚═════╝░╚══════╝░░░╚═╝░░░╚═╝░░░░░╚═╝╚═╝░░╚═╝╚═════╝░░░░╚═╝░░░╚══════╝╚═╝░░╚═╝░░░╚═╝░░░

###
###
###
###
###
###
###
###
###
###
*/
