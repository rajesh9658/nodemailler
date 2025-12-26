const express = require("express");
const nodemailer = require("nodemailer");
const bodyParser = require("body-parser");
const cors = require("cors");
require("dotenv").config();

const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.send("Yes, I am alive and well!");
});

app.post("/send-mail", async (req, res) => {
  const { firstName, lastName, company, phone, message, email } = req.body;

  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: `"Website Contact" <${process.env.EMAIL_USER}>`,
      to: process.env.EMAIL_USER,
      subject: `📩 New Contact Message from ${firstName} ${lastName}`,
      html: `
    <div style="font-family: Arial, sans-serif; background:#f4f6f8; padding:20px;">
      <div style="max-width:600px; margin:auto; background:#ffffff; padding:20px; border-radius:8px;">
        <h2 style="color:#2c3e50;">New Contact Form Submission</h2>

        <table style="width:100%; border-collapse: collapse;">
          <tr>
            <td style="padding:8px; font-weight:bold;">Name:</td>
            <td style="padding:8px;">${firstName} ${lastName}</td>
          </tr>
          <tr>
            <td style="padding:8px; font-weight:bold;">Email:</td>
            <td style="padding:8px;">${email}</td>
          </tr>
          <tr>
            <td style="padding:8px; font-weight:bold;">Company:</td>
            <td style="padding:8px;">${company}</td>
          </tr>
          <tr>
            <td style="padding:8px; font-weight:bold;">Phone:</td>
            <td style="padding:8px;">${phone}</td>
          </tr>
        </table>

        <hr style="margin:20px 0" />

        <h3>Message</h3>
        <p style="white-space: pre-line;">${message}</p>

        <hr />

        <p style="font-size:12px; color:#777;">
          This email was generated automatically from your website contact form.
        </p>
      </div>
    </div>
  `,
    };
    //simple msg 


    await transporter.sendMail(mailOptions);

    res.status(200).json({
      success: true,
      message: "Message sent successfully!",
    });
  } catch (error) {
    console.error("Email error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to send message",
    });
  }
});


app.post("/send-personalized-mails", async (req, res) => {
  const { users } = req.body;

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  try {
    for (const user of users) {
      const mailOptions = {
        from: `"Your Company" <${process.env.EMAIL_USER}>`,
        to: user.email,
        subject: `Special Offer Just for You, ${user.name}! 🎁`,
        html: `
          <div style="font-family: Arial; padding: 20px;">
            <h2>Hello ${user.name},</h2>
            <p>We have an exclusive product recommendation just for you:</p>

            <div style="border:1px solid #ddd; padding:15px; border-radius:8px;">
              <h3>${user.product}</h3>
              <p><strong>Price:</strong> ${user.price}</p>
            </div>

            <p>Let us know if you'd like to order.</p>

            <p>Regards,<br/>Your Company Team</p>
          </div>
        `,
      };

      await transporter.sendMail(mailOptions);
    }

    res.status(200).json({
      success: true,
      message: "Personalized emails sent successfully!",
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to send emails" });
  }
});


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
