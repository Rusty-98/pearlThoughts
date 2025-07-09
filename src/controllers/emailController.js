import EmailService from "../services/emailService.js";

const emailService = new EmailService();

const sendEmail = async (req, res) => {
  try {
    const status = await emailService.sendEmail(req.body);
    res.status(200).json({ status });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getStatus = (req, res) => {
  try {
    const status = emailService.getStatus(req.params.id);
    res.json({ status });
  } catch (error) {
    res.status(500).json({ error: error.message });    
  }
};


export { sendEmail, getStatus };
