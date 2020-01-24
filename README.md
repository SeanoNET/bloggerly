# Bloggerly
A Blogging platform built with Node.js and Express. 

## Getting Started

These instructions will get your clone of Bloggerly up and running on your local machine for development.

### Prerequisites

* Install [Node.js](https://nodejs.org) version 8.10 or higher
* Install [mongoDB](https://www.mongodb.com/) version 4.0.5 or higher

### Running the project locally

Restore npm packages

- `cd <path to bloggerly clone>/src`

- `npm install`

Start Bloggerly

- `npm start`

Update the connection string to mongodb in `dev-data.js` to `mongodb://localhost:27017/bloggerly`

Navigate to [localhost:5000](http://localhost:5000) in your browser. You can use the generate posts tool in the admin dashboard to populate the app with mock posts.

### Running in Docker

Download and install [docker](https://www.docker.com/get-started) and [docker-compose](https://docs.docker.com/compose/install/)

Build the image and start container `docker-compose up --build`

> The `src/views/` directory has been setup as a bind mount. You can edit the html views without rebuilding/restarting the container.

Once finished you can run `docker-compose down` to remove the running containers and network. To include volumes in the removal run `docker-compose down -v`

Navigate to [localhost:5000](http://localhost:5000) in your browser.

You can use the Generate Posts tool in the admin dashboard to populate the app with mock posts.

## Dependencies

* [bcryptjs](https://www.npmjs.com/package/bcryptjs)
* [body-parser](https://www.npmjs.com/package/body-parser)
* [connect-flash](https://www.npmjs.com/package/connect-flash)
* [express](https://www.npmjs.com/package/express)
* [express-fileupload](https://www.npmjs.com/package/express-fileupload)
* [express-handlebars](https://www.npmjs.com/package/express-handlebars)
* [express-session](https://www.npmjs.com/package/express-session)
* [faker](https://www.npmjs.com/package/faker)
* [method-override](https://www.npmjs.com/package/method-override)
* [moment](https://www.npmjs.com/package/moment)
* [mongoose](https://www.npmjs.com/package/mongoose)
* [mongoose-url-slugs](https://www.npmjs.com/package/mongoose-url-slugs)
* [passport](https://www.npmjs.com/package/passport)
* [passport-local](https://www.npmjs.com/package/passport-local)

## Authors

* **Sean O'Loughlin** - [SeanoNET](https://github.com/SeanoNET)

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE) file for details


