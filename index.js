const express = require("express");
const server = express();
const mongoose = require("mongoose");
const cors = require("cors");
const session = require("express-session");
const passport = require("passport");

const jwt = require("jsonwebtoken");

const LocalStrategy = require("passport-local").Strategy;

const JwtStrategy = require("passport-jwt").Strategy;
const ExtractJwt = require("passport-jwt").ExtractJwt;

const crypto = require("crypto");
// Routes imports
const productRouter = require("./routes/Products");
const brandsRouter = require("./routes/Brands");
const categoriesRouter = require("./routes/Categories");
const usersRouter = require("./routes/Users");
const authRouter = require("./routes/Auth");
const cartRouter = require("./routes/Cart");
const ordersRouter = require("./routes/Order");
const { User } = require("./model/User");
const { isAuth, sanitizeUser } = require("./services/common");
const cookieParser = require("cookie-parser");

const SECRET_KEY = "SECRET_KEY";
// JWT Options
const opts = {};
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = SECRET_KEY;

// Middlewares
server.use(cookieParser());
server.use(
  session({
    secret: "keyboard cat",
    resave: false, // don't save session if unmodified
    saveUninitialized: false, // don't create session until something stored
  })
);

server.use(passport.authenticate("session"));

server.use(
  cors({
    exposedHeaders: ["X-Total-count"],
  })
);
server.use(express.json()); // to parse json from req.body
server.use("/products", isAuth(), productRouter.router);
server.use("/brands",isAuth(), brandsRouter.router);
server.use("/categories", isAuth(),categoriesRouter.router);
server.use("/users", isAuth(),usersRouter.router);
server.use("/auth", authRouter.router);
server.use("/cart",isAuth(), cartRouter.router);
server.use("/orders", isAuth(),ordersRouter.router);

//passport strategy
passport.use(
  "local",
  new LocalStrategy( {usernameField:'email'},async function (email, password, done) {
    try {
      const user = await User.findOne({ email: email }).exec();
      if (!user) {
        done(null, false, { message: "Invalid Credentials" });
      }
      crypto.pbkdf2(
        password,
        user.salt,
        310000,
        32,
        "sha256",
        async function (err, hashedPassword) {
          if (!crypto.timingSafeEqual(user.password, hashedPassword)) {
            return done(null, false, { message: "Invalid Credentials" });
          }
          const token = jwt.sign(sanitizeUser(user), SECRET_KEY);

          done(null, {id:user.id, role:user.role, token});
        }
      );
    } catch (error) {
      done(error);
    }
  })
);
passport.use(
  "jwt",
  new JwtStrategy(opts, async function (jwt_payload, done) {
    try {
      const user = await User.findOne(
        { id: jwt_payload.sub }
      );
      if (user) {
        return done(null, sanitizeUser(user));
      } else {
        return done(null, false);
        // or you could create a new account
      }
    } catch (error) {
      if (error) {
        return done(error, false);
      }
    }
  })  
);

//creates session variables for req.user on first time it is called
passport.serializeUser(function (user, cb) {
  process.nextTick(function () {
    return cb(null, { id: user.id, role: user.role });
  });
});

// this changes session variable i.e. req.user, when called from authorized request
passport.deserializeUser(function (user, cb) {
  process.nextTick(function () {
    return cb(null, user);
  });
});

// mongodb compass connection
main().catch((err) => console.log(err));

async function main() {
  await mongoose.connect("mongodb://127.0.0.1:27017/ecommerce");
  console.log("database connected");
}
server.set("trust proxy");
server.get("/", (req, res) => {
  const ip = req.socket.remoteAddress || null;
  res.send("Your ip : " + req.ip);
});

server.listen(8080, () => {
  console.log("server started");
});
