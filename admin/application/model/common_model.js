/**
 * Copyright (C) Zero IT Solutions - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential. Dissemination of this information or reproduction 
 * of this material is strictly forbidden unless prior written permission is obtained
 * from Zero IT Solutions.
 
 * 
 * Written By  : anoop kumar <anoop.zeroit@gmail.com>, November 2023
 * Description :    
 * Modified By :
 */

const newModelObj = {},
  nodeMailer = require("nodemailer");

/**
 * Send email function
 * @param     :
 * @returns   :
 * @developer :
 */
newModelObj.generalMail = async function (emailData) {
  let transporter = nodeMailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
      user: "mohitdhiman.zeroit@gmail.com",
      pass: "ptqc vgnm lskb lgaq",
    },
  });

  let mailOptions = {
    from: emailData.from, 
    to: emailData.to, 
    subject: emailData.subject, 
    html: emailData.body, 
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      return false;
    }
    return true;
  });
};
module.exports = newModelObj;