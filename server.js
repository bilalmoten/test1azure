require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const formData = require('form-data');
const Mailgun = require('mailgun.js');
const fs = require('fs');
const path = require('path');
const app = express();

// Initialize Mailgun client
const mailgun = new Mailgun(formData);
const mg = mailgun.client({ username: 'api', key: process.env.MAILGUN_API_KEY });

// Use body-parser middleware to parse JSON and urlencoded request bodies
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Serve static files from the 'public' directory
app.use(express.static('public'));

// Health check endpoint
app.get('/ping', (req, res) => {
  res.status(200).send('pong');
});

// Subscribe endpoint
app.post('/subscribe', (req, res) => {
  const email = req.body.email;

  // Validate that the email address is present
  if (!email) {
    console.error('Email address is required.');
    return res.status(400).json({ success: false, message: 'Email address is required.' });
  }

  // Check if Mailgun API key and recipient email are set in the .env file
  if (!process.env.MAILGUN_API_KEY || !process.env.MAILGUN_RECIPIENT) {
    console.error('Mailgun API key and recipient email must be set in the .env file.');
    return res.status(500).json({ success: false, message: 'Mailgun configuration error.' });
  }

  const DOMAIN = process.env.MAILGUN_DOMAIN;
  const data = {
    from: 'Mailgun Sandbox <postmaster@' + DOMAIN + '>',
    to: process.env.MAILGUN_RECIPIENT,
    subject: 'New Subscription',
    text: 'A new user with the email ' + email + ' has subscribed to the mailing list!'
  };

  mg.messages.create(DOMAIN, data)
    .then(body => {
      console.log('Subscription email sent successfully:', body);
      res.json({ success: true, message: 'Subscription successful.' });
    })
    .catch(error => {
      console.error('Failed to send subscription email via Mailgun:', error.message, error.stack);
      res.status(500).json({ success: false, message: 'Failed to send subscription email.' });
    });
});

// Contact Us form submission endpoint
app.post('/contact', (req, res) => {
  const { name, email, message } = req.body;

  // Simple validation to check if all fields are filled
  if (!name || !email || !message) {
    return res.status(400).json({ success: false, message: 'All fields are required.' });
  }

  const mailData = {
    from: 'Mailgun Sandbox <postmaster@' + process.env.MAILGUN_DOMAIN + '>',
    to: process.env.MAILGUN_RECIPIENT,
    subject: 'Contact Form Submission',
    text: `You have a new submission from:\nName: ${name}\nEmail: ${email}\nMessage: ${message}`
  };

  // Send email using the Mailgun client
  mg.messages.create(process.env.MAILGUN_DOMAIN, mailData)
    .then(info => {
      console.log('Contact form email sent successfully:', info);
      res.json({ success: true, message: 'Message sent successfully.' });
    })
    .catch(error => {
      console.error('Error sending contact form email:', error.message, error.stack);
      res.status(500).json({ success: false, message: 'Error sending email.' });
    });
});

// Blog posts endpoint
app.get('/blog-posts', (req, res) => {
  // Placeholder blog post data
  const blogPosts = [
    {
      title: 'The Future of Web Development',
      snippet: 'Discover how AI is revolutionizing the web development industry...',
      link: '/blog/the-future-of-web-development'
    },
    {
      title: 'Understanding AI in Website Building',
      snippet: 'Learn about the role of artificial intelligence in creating bespoke websites...',
      link: '/blog/understanding-ai-in-website-building'
    },
    // Additional placeholder posts can be added here
  ];

  console.log('Serving blog posts data');
  res.json(blogPosts);
});

// Endpoint to serve the 'uniqueFeatures.html' partial
app.get('/unique-features', (req, res) => {
  const featuresPartialPath = path.join(__dirname, 'public', 'partials', 'uniqueFeatures.html');
  fs.readFile(featuresPartialPath, 'utf8', (err, data) => {
    if (err) {
      console.error('Error reading unique features partial:', err.message);
      res.status(500).send('An error occurred');
    } else {
      res.send(data);
    }
  });
});

// Listen on a configurable port
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
}).on('error', (error) => {
  console.error('Error occurred starting the server:', error.message, error.stack);
});