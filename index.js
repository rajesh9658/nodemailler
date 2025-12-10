const express = require("express");
const nodemailer = require("nodemailer");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.post("/send-mail", async (req, res) => {
  const { firstName, lastName, company, phone, message } = req.body;

  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "padhirajesh88@gmail.com",
        pass: "tnzuzzyzfcnwruno"         }
    });

    const mailOptions = {
      from: "padhirajesh88@gmail.com",
      to: "padhirajesh89@gmail.com",
      subject: `New Contact Form Submission from ${firstName} ${lastName}`,
      text: `
New Message from your website:

First Name: ${firstName}
Last Name: ${lastName}
Company: ${company}
Phone: ${phone}

Message:
${message}
      `,
    };

    await transporter.sendMail(mailOptions);
    res.status(200).json({ message: "Message sent successfully!" });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to send message." });
  }
});

app.listen(5000, () => console.log("Server running on port 5000"));
