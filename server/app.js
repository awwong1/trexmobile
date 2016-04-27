'use strict';

var bodyParser = require('body-parser');
var express = require('express');
var helmet = require('helmet');
var https = require('https');
var Mailgun = require('mailgun-js');
var mustacheExpress = require('mustache-express');
var querystring = require('querystring');

var mailgun_api_key = process.env.MAILGUN_API_KEY || 'key';
var mailgun_domain = process.env.MAILGUN_DOMAIN || 'domain';
var mailgun = new Mailgun({apiKey: mailgun_api_key, domain: mailgun_domain});

var gCaptchaSecret = process.env.GOOGLE_RECAPTCHA_SECRET || 'secret';

var app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(helmet());
app.engine('html', mustacheExpress());
app.set('view engine', 'html');
app.set('views', 'client');

/**
 * Verify the google recaptcha response with google
 * @param key Value of g-recaptcha-response
 * @param ip End user IP
 * @param callback Callback function to send the success
 */
function verifyRecaptcha(key, ip, callback) {
  var postData = querystring.stringify({
    secret: gCaptchaSecret,
    response: key,
    remoteip: ip
  });
  var postOptions = {
    host: 'google.com',
    port: '443',
    path: '/recaptcha/api/siteverify',
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Content-Length': Buffer.byteLength(postData)
    }
  };
  // Set up the request
  var post_req = https.request(postOptions, function(res) {
    var data = '';
    res.setEncoding('utf8');
    res.on('data', function (chunk) {
      data += chunk.toString();
    });
    res.on('end', function () {
      try {
        var parsedData = JSON.parse(data);
        callback(parsedData.success);
      } catch (e) {
        callback(false);
      }
    });
  });
  // post the data
  post_req.write(postData);
  post_req.end();
}

/**
 * Serve the index on root GET
 */
app.get('/', function (req, res) {
  res.render('index', {
    contactForm: true
  });
});

/**
 * Submit some mail on root POST if captcha is filled out properly
 */
app.post('/', function (req, res) {
  var ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
  var fromName = req.body.name || 'No Name';
  var fromEmail = req.body.email || 'noreply@trexmobile.ca';
  var fromMessage = req.body.message || 'No message';
  var gCaptchaResponse = req.body['g-recaptcha-response'] || 'no_response';

  verifyRecaptcha(gCaptchaResponse, ip, function (success) {
    if (success) {
      var fromField = fromName + ' <' + fromEmail + '>';
      var toField = 'Taurik Taha <taurik@trexmobile.ca>';
      // var bccField = 'Alexander Wong <admin@alexander-wong.com>';
      var subject = 'T-Rex Mobile Contact Form';

      var data = {
        from: fromField,
        to: toField,
        // bcc: bccField,
        subject: subject,
        text: fromMessage,
        html: fromMessage
      };

      mailgun.messages().send(data, function (err, body) {
        //If there is an error, render the error page
        if (err) {
          res.render('index', {
            contactForm: false,
            contactMessage: 'Message could not be sent. Please contact using email or telephone?'
          });
        }
        else {
          res.render('index', {
            contactForm: false,
            contactMessage: 'Message has been sent successfully! Thank you!'
          });
        }
      });
    } else {
      res.render('index', {
        contactForm: true,
        contactName: fromName,
        contactEmail: fromEmail,
        contactBodyMessage: fromMessage,
        contactMessage: 'Message could not be sent. (ReCaptcha Verification Failed) ' +
        'Please verify the reCaptcha.'
      })
    }
  });
});

// serve all static files inside the client directory
app.use(express.static('client'));

// health probe check for OpenShift
app.get('/health', function (req, res) {
  res.send('1');
});

app.listen(process.env.NODE_PORT || 3000, process.env.NODE_IP || 'localhost', function () {
  console.log(`Application worker ${process.pid} started...`);
});
