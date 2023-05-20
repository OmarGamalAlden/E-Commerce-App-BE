import { customAlphabet } from "nanoid";
import userModel from "../../../DB/models/user.model.js";
import { catchError, GlobalError } from "../../utils/errorHandling.js";
import {
  generateToken,
  verifyToken,
} from "../../utils/generate&verifyToken.js";
import { compareing, hasing } from "../../utils/hash&compare.js";
import sendEmail from "../../utils/sendEmail.js";

export const signUp = catchError(async (req, res, next) => {
  const { userName, password } = req.body;
  const email = req.body.email.toLowerCase();
  //check email exist??
  const checkUser = await userModel.findOne({ email });
  if (checkUser) {
    return next(
      new GlobalError({ message: "email ia already exist", statusCode: 409 })
    );
  }
  //send confirm email
  const token = generateToken({ payLoad: { email }, expiresIn: 60 * 5 });
  const refreshToken = generateToken({
    payLoad: { email },
    expiresIn: 60 * 60 * 24,
  });

  const link = `${req.protocol}://${req.headers.host}/auth/confirmEmail/${token}`;
  const refreshLink = `${req.protocol}://${req.headers.host}/auth/newConfirmEmail/${refreshToken}`;

  const html = `<!DOCTYPE html>
    <html>
    
    <head>
        <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css">
    </head>
    <style type="text/css">
        body {
            background-color: #88BDBF;
            margin: 0px;
        }
    </style>
    
    <body style="margin:0px;">
        <table border="0" width="50%" style="margin:auto;padding:30px;background-color: #F3F3F3;border:1px solid #630E2B;">
            <tr>
                <td>
                    <table border="0" width="100%">
                        <tr>
                            <td>
                                <h1>
                                    <img width="100px"
                                        src="https://res.cloudinary.com/ddajommsw/image/upload/v1670702280/Group_35052_icaysu.png" />
                                </h1>
                            </td>
                            <td>
                                <p style="text-align: right;"><a href="http://localhost:4200/#/" target="_blank"
                                        style="text-decoration: none;">View In Website</a></p>
                            </td>
                        </tr>
                    </table>
                </td>
            </tr>
            <tr>
                <td>
                    <table border="0" cellpadding="0" cellspacing="0"
                        style="text-align:center;width:100%;background-color: #fff;">
                        <tr>
                            <td style="background-color:#630E2B;height:100px;font-size:50px;color:#fff;">
                                <img width="50px" height="50px"
                                    src="https://res.cloudinary.com/ddajommsw/image/upload/v1670703716/Screenshot_1100_yne3vo.png">
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <h1 style="padding-top:25px; color:#630E2B">Email Confirmation</h1>
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <p style="padding:0px 100px;">
                                </p>
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <a href="${link}"
                                    style="margin:10px 0px 30px 0px;border-radius:4px;padding:10px 20px;border: 0;color:#fff;background-color:#630E2B; ">Verify
                                    Email address</a>
                            </td>
                        </tr>
                        <br>
                        <br>
                        <br>
                        <tr>
                            <td>
                                <a href="${refreshLink}"
                                    style="margin:10px 0px 30px 0px;border-radius:4px;padding:10px 20px;border: 0;color:#fff;background-color:#630E2B; ">Request new email</a>
                            </td>
                        </tr>
                    </table>
                </td>
            </tr>
            <tr>
                <td>
                    <table border="0" width="100%" style="border-radius: 5px;text-align: center;">
                        <tr>
                            <td>
                                <h3 style="margin-top:10px; color:#000">Stay in touch</h3>
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <div style="margin-top:20px;">
    
                                    <a href="${process.env.facebookLink}" style="text-decoration: none;"><span class="twit"
                                            style="padding:10px 9px;color:#fff;border-radius:50%;">
                                            <img src="https://res.cloudinary.com/ddajommsw/image/upload/v1670703402/Group35062_erj5dx.png"
                                                width="50px" hight="50px"></span></a>
    
                                    <a href="${process.env.instegram}" style="text-decoration: none;"><span class="twit"
                                            style="padding:10px 9px;color:#fff;border-radius:50%;">
                                            <img src="https://res.cloudinary.com/ddajommsw/image/upload/v1670703402/Group35063_zottpo.png"
                                                width="50px" hight="50px"></span>
                                    </a>
    
                                    <a href="${process.env.twitterLink}" style="text-decoration: none;"><span class="twit"
                                            style="padding:10px 9px;;color:#fff;border-radius:50%;">
                                            <img src="https://res.cloudinary.com/ddajommsw/image/upload/v1670703402/Group_35064_i8qtfd.png"
                                                width="50px" hight="50px"></span>
                                    </a>
    
                                </div>
                            </td>
                        </tr>
                    </table>
                </td>
            </tr>
        </table>
    </body>
    
    </html>`;

  const sendingEmail = await sendEmail({
    to: email,
    subject: "Email Confirmation",
    html,
  });
  if (!sendingEmail) {
    return next(
      new GlobalError({ message: "email is rejected", statusCode: 400 })
    );
  }
  //hash password
  const hashedPassword = hasing({ plainText: password });
  //create user
  const { _id } = await userModel.create({
    userName,
    email,
    password: hashedPassword,
  });
  return res.status(201).json({ message: "Done", id: _id });
});

export const confirmEmail = catchError(async (req, res, next) => {
  const { token } = req.params;
  const { email } = verifyToken({ token });
  if (!email) {
    return next(
      new GlobalError({ message: "in-valid token payload", statusCode: 400 })
    );
  }
  const checkUser = await userModel.findOne({ email });
  if (!checkUser) {
    return next(
      new GlobalError({ message: "not register account", statusCode: 400 })
    );
  }
  checkUser.confirmEmail = true;
  await checkUser.save();
  return res.status(200).send("<p>your email activation is successfully</p>");
});

export const newConfirmEmail = catchError(async (req, res, next) => {
  const { token } = req.params;
  const { email } = verifyToken({ token });
  if (!email) {
    return next(
      new GlobalError({ message: "in-valid token payload", statusCode: 400 })
    );
  }
  const checkUser = await userModel.findOne({ email });
  if (!checkUser) {
    return next(
      new GlobalError({
        message: "not register account, please signIN...",
        statusCode: 404,
      })
    );
  }
  if (checkUser.confirmEmail == true) {
    return res.status(200).send("<p>your email is already activated!!</p>");
  }
  const newToken = generateToken({ payLoad: { email }, expiresIn: 60 * 3 });

  const link = `${req.protocol}://${req.headers.host}/auth/confirmEmail/${newToken}`;
  const refreshLink = `${req.protocol}://${req.headers.host}/auth/newConfirmEmail/${token}`;

  const html = `<!DOCTYPE html>
  <html>
  
  <head>
      <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css">
  </head>
  <style type="text/css">
      body {
          background-color: #88BDBF;
          margin: 0px;
      }
  </style>
  
  <body style="margin:0px;">
      <table border="0" width="50%" style="margin:auto;padding:30px;background-color: #F3F3F3;border:1px solid #630E2B;">
          <tr>
              <td>
                  <table border="0" width="100%">
                      <tr>
                          <td>
                              <h1>
                                  <img width="100px"
                                      src="https://res.cloudinary.com/ddajommsw/image/upload/v1670702280/Group_35052_icaysu.png" />
                              </h1>
                          </td>
                          <td>
                              <p style="text-align: right;"><a href="http://localhost:4200/#/" target="_blank"
                                      style="text-decoration: none;">View In Website</a></p>
                          </td>
                      </tr>
                  </table>
              </td>
          </tr>
          <tr>
              <td>
                  <table border="0" cellpadding="0" cellspacing="0"
                      style="text-align:center;width:100%;background-color: #fff;">
                      <tr>
                          <td style="background-color:#630E2B;height:100px;font-size:50px;color:#fff;">
                              <img width="50px" height="50px"
                                  src="https://res.cloudinary.com/ddajommsw/image/upload/v1670703716/Screenshot_1100_yne3vo.png">
                          </td>
                      </tr>
                      <tr>
                          <td>
                              <h1 style="padding-top:25px; color:#630E2B">Email Confirmation</h1>
                          </td>
                      </tr>
                      <tr>
                          <td>
                              <p style="padding:0px 100px;">
                              </p>
                          </td>
                      </tr>
                      <tr>
                          <td>
                              <a href="${link}"
                                  style="margin:10px 0px 30px 0px;border-radius:4px;padding:10px 20px;border: 0;color:#fff;background-color:#630E2B; ">Verify
                                  Email address</a>
                          </td>
                      </tr>
                      <br>
                      <br>
                      <br>
                      <tr>
                          <td>
                              <a href="${refreshLink}"
                                  style="margin:10px 0px 30px 0px;border-radius:4px;padding:10px 20px;border: 0;color:#fff;background-color:#630E2B; ">Request new email</a>
                          </td>
                      </tr>
                  </table>
              </td>
          </tr>
          <tr>
              <td>
                  <table border="0" width="100%" style="border-radius: 5px;text-align: center;">
                      <tr>
                          <td>
                              <h3 style="margin-top:10px; color:#000">Stay in touch</h3>
                          </td>
                      </tr>
                      <tr>
                          <td>
                              <div style="margin-top:20px;">
  
                                  <a href="${process.env.facebookLink}" style="text-decoration: none;"><span class="twit"
                                          style="padding:10px 9px;color:#fff;border-radius:50%;">
                                          <img src="https://res.cloudinary.com/ddajommsw/image/upload/v1670703402/Group35062_erj5dx.png"
                                              width="50px" hight="50px"></span></a>
  
                                  <a href="${process.env.instegram}" style="text-decoration: none;"><span class="twit"
                                          style="padding:10px 9px;color:#fff;border-radius:50%;">
                                          <img src="https://res.cloudinary.com/ddajommsw/image/upload/v1670703402/Group35063_zottpo.png"
                                              width="50px" hight="50px"></span>
                                  </a>
  
                                  <a href="${process.env.twitterLink}" style="text-decoration: none;"><span class="twit"
                                          style="padding:10px 9px;;color:#fff;border-radius:50%;">
                                          <img src="https://res.cloudinary.com/ddajommsw/image/upload/v1670703402/Group_35064_i8qtfd.png"
                                              width="50px" hight="50px"></span>
                                  </a>
  
                              </div>
                          </td>
                      </tr>
                  </table>
              </td>
          </tr>
      </table>
  </body>
  
  </html>`;

  const sendingEmail = await sendEmail({
    to: email,
    subject: "Email Confirmation",
    html,
  });
  if (!sendingEmail) {
    return next(
      new GlobalError({ message: "email is rejected", statusCode: 400 })
    );
  }
  return res
    .status(200)
    .send("<p>New email is sent, please check Your Inbox</p>");
});

export const logIn = catchError(async (req, res, next) => {
  const { password } = req.body;
  const email = req.body.email.toLowerCase();
  const checkUser = await userModel.findOne({ email });
  if (!checkUser) {
    return next(
      new GlobalError({
        message: "not register account, please signIN...",
        statusCode: 404,
      })
    );
  }
  if (!checkUser.confirmEmail) {
    return next(
      new GlobalError({
        message: "Please, confirm your email first",
        statusCode: 400,
      })
    );
  }
  const checkPassword = compareing({
    plainText: password,
    hasedValue: checkUser.password,
  });
  if (!checkPassword) {
    return next(
      new GlobalError({
        message: "In correct password account",
        statusCode: 400,
      })
    );
  }
  const access_token = generateToken({
    payLoad: { id: checkUser._id, role: checkUser.role },
    expiresIn: 60 * 30,
  });
  const reFresh_token = generateToken({
    payLoad: { id: checkUser._id, role: checkUser.role },
    expiresIn: 60 * 60 * 24 * 365,
  });
  checkUser.status = "online";
  await checkUser.save();
  return res
    .status(200)
    .json({ message: "loggedIn Successfully", access_token, reFresh_token });
});

export const sendCode = catchError(async (req, res, next) => {
  const email = req.body.email.toLowerCase();
  const user = await userModel.findOne({ email });
  if (!user) {
    return next(
      new GlobalError({ message: "not register account", statusCode: 404 })
    );
  }
  const resetCode = customAlphabet("123456789", 4);
  const sendingCode = resetCode();
  user.resetCode = sendingCode;
  await user.save();

  const html = `<!DOCTYPE html>
  <html>
  
  <head>
      <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css">
  </head>
  <style type="text/css">
      body {
          background-color: #88BDBF;
          margin: 0px;
      }
  </style>
  
  <body style="margin:0px;">
      <table border="0" width="50%" style="margin:auto;padding:30px;background-color: #F3F3F3;border:1px solid #630E2B;">
          <tr>
              <td>
                  <table border="0" width="100%">
                      <tr>
                          <td>
                              <h1>
                                  <img width="100px"
                                      src="https://res.cloudinary.com/ddajommsw/image/upload/v1670702280/Group_35052_icaysu.png" />
                              </h1>
                          </td>
                          <td>
                              <p style="text-align: right;"><a href="http://localhost:4200/#/" target="_blank"
                                      style="text-decoration: none;">View In Website</a></p>
                          </td>
                      </tr>
                  </table>
              </td>
          </tr>
          <tr>
              <td>
                  <table border="0" cellpadding="0" cellspacing="0"
                      style="text-align:center;width:100%;background-color: #fff;">
                      <tr>
                          <td style="background-color:#630E2B;height:100px;font-size:50px;color:#fff;">
                              <img width="50px" height="50px"
                                  src="https://res.cloudinary.com/ddajommsw/image/upload/v1670703716/Screenshot_1100_yne3vo.png">
                          </td>
                      </tr>
                      <tr>
                          <td>
                              <h1 style="padding-top:25px; color:#630E2B">Reset Password Code</h1>
                          </td>
                      </tr>
                      <tr>
                          <td>
                              <p style="padding:0px 100px;">
                              </p>
                          </td>
                      </tr>
                      <tr>
                          <td>
                              <p
                                  style="margin:10px 0px 30px 0px;border-radius:4px;padding:10px 20px;border: 0;color:#fff;background-color:#630E2B; ">${sendingCode}</p>
                          </td>
                      </tr>
                      <br>
                      <br>
                      <br>
                  </table>
              </td>
          </tr>
          <tr>
              <td>
                  <table border="0" width="100%" style="border-radius: 5px;text-align: center;">
                      <tr>
                          <td>
                              <h3 style="margin-top:10px; color:#000">Stay in touch</h3>
                          </td>
                      </tr>
                      <tr>
                          <td>
                              <div style="margin-top:20px;">
  
                                  <a href="${process.env.facebookLink}" style="text-decoration: none;"><span class="twit"
                                          style="padding:10px 9px;color:#fff;border-radius:50%;">
                                          <img src="https://res.cloudinary.com/ddajommsw/image/upload/v1670703402/Group35062_erj5dx.png"
                                              width="50px" hight="50px"></span></a>
  
                                  <a href="${process.env.instegram}" style="text-decoration: none;"><span class="twit"
                                          style="padding:10px 9px;color:#fff;border-radius:50%;">
                                          <img src="https://res.cloudinary.com/ddajommsw/image/upload/v1670703402/Group35063_zottpo.png"
                                              width="50px" hight="50px"></span>
                                  </a>
  
                                  <a href="${process.env.twitterLink}" style="text-decoration: none;"><span class="twit"
                                          style="padding:10px 9px;;color:#fff;border-radius:50%;">
                                          <img src="https://res.cloudinary.com/ddajommsw/image/upload/v1670703402/Group_35064_i8qtfd.png"
                                              width="50px" hight="50px"></span>
                                  </a>
  
                              </div>
                          </td>
                      </tr>
                  </table>
              </td>
          </tr>
      </table>
  </body>
  
  </html>`;

  const sendingEmail = await sendEmail({
    to: email,
    subject: "Reset Password",
    html,
  });
  if (!sendingEmail) {
    return next(
      new GlobalError({ message: "email is rejected", statusCode: 400 })
    );
  }
  return res.status(200).json({ message: "Done", sendCode: sendingCode });
});

export const resetPassword = catchError(async (req, res, next) => {
  const { resetCode, newPassword } = req.body;
  const email = req.body.email.toLowerCase();
  const user = await userModel.findOne({ email });
  if (!user) {
    return next(
      new GlobalError({ message: "not register account", statusCode: 404 })
    );
  }
  if (user.resetCode != resetCode) {
    return next(
      new GlobalError({ message: "In-valid reset code", statusCode: 404 })
    );
  }
  user.password = hasing({ plainText: newPassword });
  user.resetCode = null;
  user.changedPasswordTime = Date.now();
  await user.save();
  return res.status(200).json({ message: "Password reset successfully" });
});
