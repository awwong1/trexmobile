# trexmobile
Client requested website for trexmobile.ca. Written in Node.js running express with Mailgun integration. Writen specifically for deployment on OpenShift's PaaS v3.

Photos have been taken from Unsplash, extending off their Creative Commons Zero License.

* [Openshift Url](http://trexmobile-trexmobile.193b.starter-ca-central-1.openshiftapps.com)
* [Live Url](https://www.trexmobile.ca/)

## Environment Variables

| Environment Variable      | Value        | Description       |
|---------------------------|--------------|-------------------|
| `NODE_ENV`                | `production` | node environment  |
| `NODE_CLUSTER_WORKERS`    | `4`          | # cluster workers |
| `MAILGUN_API_KEY`         | `key`        | mailgun api key   |
| `MAILGUN_DOMAIN`          | `domain`     | mailgun domain    |
| `GOOGLE_RECAPTCHA_SECRET` | `secret`     | recaptcha secret  |
| `NODE_PORT`               | `8080`       | node app port     |
| `NODE_IP`                 | `0.0.0.0`    | node app ip       |

## License

The MIT License (MIT)

Copyright (c) 2016 Alexander Wong

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
