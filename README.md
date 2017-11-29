# Express

Express is the most popular Node web framework, and is the underlying library for a number of other popular Node web frameworks. It provides mechanisms to:

Write handlers for requests with different HTTP verbs at different URL paths (routes).
Integrate with "view" rendering engines in order to generate responses by inserting data into templates.
Set common web application settings like the port to use for connecting, and the location of templates that are used for rendering the response.
Add additional request processing "middleware" at any point within the request handling pipeline.

## 비동기 프로그래밍

JavaScript code frequently uses asynchronous rather than synchronous APIs for operations that may take some time to complete. A synchronous API is one in which each operation must complete before the next operation can start. For example, the following log functions are synchronous, and will print the text to the console in order (First, Second).

```javascript
console.log('First');
console.log('Second');
```

By contrast, an asynchronous API is one in which the API will start an operation and immediately return (before the operation is complete). Once the operation finishes, the API will use some mechanism to perform additional operations. For example, the code below will print out "Second, First" because even though setTimeout() method is called first, and returns immediately, the operation doesn't complete for several seconds.

```javascript
setTimeout(function() {
  console.log('First');
}, 3000);

console.log('Second');
```

Using non-blocking asynchronous APIs is even more important on Node than in the browser, because Node is a single threaded event-driven execution environment. "single threaded" means that all requests to the server are run on the same thread (rather than being spawned off into separate processes). This model is extremely efficient in terms of speed and server resources, but it does mean that if any of your functions call synchronous methods that take a long time to complete, they will block not just the current request, but every other request being handled by your web application.

## Routing

In our Hello World Express example see above we defined a (callback) route handler function for HTTP GET requests to the site root ('/').

```javascript
app.get('/', function(req, res) {
  res.send('Hello World!');
});
```

The callback function takes a request and a response object as arguments. In this case the method simply calls send() on the response to return the string "Hello World!" There are a number of other response methods for ending the request/response cycle, for example you could call res.json() to send a JSON response or res.sendFile() to send a file.

There is a special routing method, app.all(), which will be called in response to any HTTP method. This is used for loading middleware functions at a particular path for all request methods. The following example (from the Express documentation) shows a handler that will be executed for requests to /secret irrespective of the HTTP verb used (provided it is supported by the http module).

```javascript
app.all('/secret', function(req, res, next) {
  console.log('Accessing the secret section ...');
  next(); // pass control to the next handler
});
```
Routes allow you to match particular patterns of characters in a URL, and extract some values from the URL and pass them as parameters to the route handler (as attributes of the request object passed as a parameter).

## Middleware

Middleware is used extensively in Express apps, for tasks from serving static files to error handling, to compressing HTTP responses. Whereas route functions end the HTTP request-response cycle by returning some response to the HTTP client, middleware functions typically perform some operation on the request or response and then call the next function in the "stack", which might be more middleware or a route handler. The order that middleware is called is up to the app developer.

You can add a middleware function to the processing chain with either app.use() or app.add(), depending on whether you want to apply the middleware to all responses or to responses with a particular HTTP verb (GET, POST, etc). You specify routes the same in both cases, though the route is optional when calling app.use().

The example below shows how you can add the middleware function using both methods, and with/without a route.

```javascript
var express = require('express');
var app = express();

// An example middleware function
var a_middleware_function = function(req, res, next) {
  // ... perform some operations
  next(); // Call next() so Express will call the next middleware function in the chain.
}

// Function added with use() for all routes and verbs
app.use(a_middleware_function);

// Function added with use() for a specific route
app.use('/someroute', a_middleware_function);

// A middleware function added for a specific HTTP verb and route
app.get('/', a_middleware_function);

app.listen(3000);
```

## Error Handling

Errors are handled by one or more special middleware functions that have four arguments, instead of the usual three: (err, req, res, next). For example:

```javascript
app.use(function(err, req, res, next) {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});
```

These can return any content required, but must be called after all other app.use() and routes calls so that they are the last middleware in the request handling process!

Express comes with a built-in error handler, which takes care of any remaining errors that might be encountered in the app. This default error-handling middleware function is added at the end of the middleware function stack. If you pass an error to next() and you do not handle it in an error handler, it will be handled by the built-in error handler; the error will be written to the client with the stack trace.

## Database

xpress apps can use any database mechanism supported by Node (Express itself doesn't define any specific additional behaviour/requirements for database management). There are many options, including PostgreSQL, MySQL, Redis, SQLite, MongoDB, etc.

In order to use these you have to first install the database driver using NPM. For example, to install the driver for the popular NoSQL MongoDB you would use the command:

```
$ npm install mongodb
```

The database itself can be installed locally or on a cloud server. In your Express code you require the driver, connect to the database, and then perform create, read, update, and delete (CRUD) operations. The example below (from the Express documentation) shows how you can find "mammal" records using MongoDB.

```javascript
var MongoClient = require('mongodb').MongoClient;

MongoClient.connect('mongodb://localhost:27017/animals', function(err, db) {
  if (err) throw err;

  db.collection('mammals').find().toArray(function (err, result) {
    if (err) throw err;

    console.log(result);
  });
});
```

Another popular approach is to access your database indirectly, via an Object Relational Mapper ("ORM"). In this approach you define your data as "objects" or "models" and the ORM maps these through to the underlying database format. This approach has the benefit that as a developer you can continue to think in terms of JavaScript objects rather than database semantics, and that there is an obvious place to perform validation and checking of incoming data. We'll talk more about databases in a later article.

For more information see [Database integration](https://expressjs.com/en/guide/database-integration.html) (Express docs).

## Rendering

Template engines (referred to as "view engines" by Express) allow you to specify the structure of an output document in a template, using placeholders for data that will be filled in when a page is generated. Templates are often used to create HTML, but can also create other types of document. Express has support for a number of template engines, and there is a useful comparison of the more popular engines here: Comparing JavaScript Templating Engines: Jade, Mustache, Dust and More.

In your application settings code you set the template engine to use and the location where Express should look for templates using the 'views' and 'view engines' settings, as shown below (you will also have to install the package containing your template library too!)

```javascript
var express = require('express');
var app = express();

// Set directory to contain the templates ('views')
app.set('views', path.join(__dirname, 'views'));

// Set view engine to use, in this case 'some_template_engine_name'
app.set('view engine', 'some_template_engine_name');
```

The appearance of the template will depend on what engine you use. Assuming that you have a template file named "index.<template_extension>" that contains placeholders for data variables named 'title' and "message", you would call Response.render() in a route handler function to create and send the HTML response:

```javascript
app.get('/', function(req, res) {
  res.render('index', { title: 'About dogs', message: 'Dogs rock!' });
});
```

For more information see [Using template engines with Express](http://expressjs.com/en/guide/using-template-engines.html) (Express docs).
