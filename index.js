const express = require('express');
const serveIndex = require('serve-index')


const app = express();


app.get('/headers', (req, res) => {
  res.set('Content-Type', 'application/json')
  res.send(JSON.stringify(req.headers, null, 2))
});

app.get('/in-iframe', (req, res) => {
  res.set('Content-Type', 'text/html')
  console.log(req.query)
  let content = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>iframe</title>
    <style>
    body, html {width: 100%; height: 100%; margin: 0; padding: 0}
    iframe {
        width: 100%;
        height: 100%;
        border: none;
      }
    </style>
</head>
<body>
    
    ${ req.query.delay
    ? `<script> 
      setTimeout(() => {
        let iframe = document.createElement('iframe');
        iframe.src = "${req.query.url}";
        document.body.appendChild(iframe);

      }, ${req.query.delay})

    </script>`
    : `<iframe src="${req.query.url}"></iframe>`
    
    }
  
</body>
</html>
  `
  res.send(content)
});

app.get('/redirect-post', (req, res) => {
  let content = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Document</title>
</head>
<body>
  <form action="${req.query.url}" method="POST">
    <button type="submit">submit</button>
  </form>
  <script>document.querySelector('form').submit()</script>
</body>
</html>`

console.log(`redirect with POST to ${req.query.url}`)
res.send(content)
});

app.post('/post-get-pdf', (req, res) => {

  console.log('post request', req.body)
  res.sendFile(`${__dirname}/static/files/FormMonitor.pdf`)

})

app.get('/fakesourcemap.map', (req, res) => {
  res.set('Content-Type', 'application/javascript')
  res.cookie('DevTools', true, {
    maxAge: 3000
  })
  console.log(`DEVTOOLS OPENED from ${req.headers['user-agent']}`)

  res.send({})

})

// these need to be last
app.use(express.static('static'))
app.use(serveIndex('static', { 'icons': true }))

app.listen(3000, () => {
  console.log('server started');
});