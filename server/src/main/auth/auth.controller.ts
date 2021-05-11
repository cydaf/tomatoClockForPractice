import { Request, Response } from "express";
import { getRepository } from "typeorm";
import { User } from "../../entity/User";
import { HttpStatus } from "../../common/response/response.type";
import * as nodemailer from "nodemailer";
import * as moment from "moment";
import * as jwt from "jsonwebtoken";
import * as bcrypt from "bcryptjs";

export const verify = async function (req: Request, res: Response) {
  const userRepo = getRepository(User);
  const { verifiedCode } = req.query;
  const user = await userRepo.findOne({ where: { verifiedCode } });
  if (!user)
    return res.status(HttpStatus.UNAUTHORIZED).json({
      status: HttpStatus.UNAUTHORIZED,
      auth: false,
      message: "link incorrect",
    });
  user.verified = true;
  user.verifiedAt = moment(moment().valueOf()).format(
    "YYYY-MM-DDTHH:mm:ss.SSS"
  );
  const results = userRepo.save(user);
  return res.status(HttpStatus.OK).redirect(process.env.Redirect);
};

export const register = async function (req: Request, res: Response) {
  const { name, email, password } = req.body;
  const userRepo = getRepository(User);
  const emailRepo = await userRepo.find({
    where: { email: req.body.email },
  });
  if (emailRepo.length != 0) {
    return res.status(HttpStatus.UNAUTHORIZED).json({
      status: HttpStatus.UNAUTHORIZED,
      errors: { email: "email has been used" },
    });
  }
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);
  const verifiedCode = await bcrypt.hash("ABCD12345", salt);
  const newUser = userRepo.create({
    name: name,
    email: email,
    password: hashedPassword,
    verifiedCode: verifiedCode,
  });
  const results = userRepo.save(newUser);
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.USEREMAIL,
      pass: process.env.PASSWORD,
    },
  });
  var mailOptions = {
    from: process.env.USEREMAIL, // sender address
    to: email, // list of receivers
    subject: "Email Verification", // Subject line
    text:
      "Hello " +
      req.body.name +
      ",\n\n" +
      "Please verify your account by clicking the link: \n" +
      process.env.verify +
      "/api/auth/verify?verifiedCode=" +
      verifiedCode +
      "\n\nThank You!\n", // plain text body
  };

  transporter.sendMail(mailOptions, function (err, response) {
    if (err) {
      return res.status(HttpStatus.BAD_REQUEST);
    } else {
      return res.status(HttpStatus.OK).json({
        status: HttpStatus.OK,
        data: { message: "please verify email", verified: false },
      });
    }
  });
};

export const signin = async function (req: Request, res: Response) {
  const { email, password } = req.body;
  const userRepo = getRepository(User);
  const user = await getRepository(User).findOne({ email: email });
  if (!user) {
    return res
      .status(HttpStatus.UNAUTHORIZED)
      .json({ status: HttpStatus.UNAUTHORIZED, errors: "email doesn't exist" });
  }
  if (user.verified == false) {
    return res.status(HttpStatus.UNAUTHORIZED).json({
      status: HttpStatus.UNAUTHORIZED,
      errors: "please verify your email",
    });
  }
  const validPassword = bcrypt.compareSync(password, user.password);
  if (!validPassword) {
    return res
      .status(HttpStatus.UNAUTHORIZED)
      .json({ status: HttpStatus.UNAUTHORIZED, errors: "password incorrect" });
  }
  const payload = {
    id: user.id,
    name: user.name,
    email: user.email,
  };
  const token = jwt.sign(payload, process.env.TOKEN_SECRET, {
    expiresIn: "1h",
  });
  return res.status(HttpStatus.OK).json({ status: HttpStatus.OK, data: token });
};
