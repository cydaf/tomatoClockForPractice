import { Request, Response } from "express";
import { getRepository } from "typeorm";
import { User } from "../../entity/User";
import { HttpStatus } from "../../common/response/response.type";
import * as moment from "moment";
import * as jwt from "jsonwebtoken";
import * as bcrypt from "bcryptjs";
import * as sgMail from "@sendgrid/mail";
export const verify = async function (req: Request, res: Response) {
  const userRepo = getRepository(User);
  const { verifiedCode } = req.query;
  const user = await userRepo.findOne({ where: { verifiedCode } });
  if (!user || verifiedCode != user.verifiedCode)
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
  const emailRepo = await getRepository(User).find({
    where: { email: req.body.email },
  });
  if (emailRepo.length != 0) {
    return res
      .status(HttpStatus.UNAUTHORIZED)
      .json({ status: HttpStatus.UNAUTHORIZED, errors: "email has been used" });
  }
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);
  const verifiedCode = await bcrypt.hash("ABCD12345", salt);
  const newUser = getRepository(User).create({
    name: name,
    email: email,
    password: hashedPassword,
    verifiedCode: verifiedCode,
  });
  const results = await getRepository(User).save(newUser);
  sgMail.setApiKey(process.env.SENDGRID_API_KEY);
  // you can use either text or html
  const msg = {
    to: email, // Change to your recipient
    from: "b123105@gmail.com", // have to use my email account
    subject: "Email Verification",
    text:
      "Hello " +
      req.body.name +
      ",\n\n" +
      "Please verify your account by clicking the link: \n" +
      process.env.verify +
      "/api/auth/verify?verifiedCode=" +
      verifiedCode +
      "\n\nThank You!\n",
  };

  sgMail
    .send(msg)
    .then(() => {
      return res
        .status(HttpStatus.OK)
        .json({ status: HttpStatus.OK, messgae: "please verify email" });
    })
    .catch((error) => {
      console.error(error);
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
  return res
    .status(HttpStatus.OK)
    .json({ status: HttpStatus.OK, data: { token: token } });
};
