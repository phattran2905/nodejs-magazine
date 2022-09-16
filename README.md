# Introduction
This is my first __Nodejs__ project. It provides some features which relate to blogs, articles, posts. With this application, the administrator can manage the authors, audiences as well as articles.

I have deploy it on [heroku](http://heroku.com/) server, you can visit it by this link below:
> https://e-newspaper.herokuapp.com/

For administration page:
>https://e-newspaper.herokuapp.com/admin

# Installation
After you cloned my project. There are a few things you need to set up.

### Requisite
Make sure that you have installed these things below:
* [Npm](https://nodejs.org/en/) (version 6.x)
* [Nodejs](https://nodejs.org/en/) (version 12.x)
* [Mongodb](https://www.mongodb.com/) (version 4.x)

### Install npm packages
To install all the packages that were involved in this project, run this command on your terminal:

```shell
npm install
```

### Create environment variables
You have to install environment variables and grab it inside a __*.env*__ file. Make sure you have included these variable:

```
DATABASE_URI="your connect string with mongodb"
PORT="port for server to run on"
SECRET_KEY="key for session and hashing"
NODE_ENV="whether it is 'development' or 'production'"
```

### Run project
After defining environment variables, run this command to start the server:
```shell
npm run dev
```

Or for production:
```shell
npm run start
```

If errors occurred, please add on "cross-env" in [package.json](https://github.com/phatductran/nodejs_electronic_newspaper/blob/master/package.json) like this:
```json
"scripts": {
    "start": "cross-env NODE_ENV=production node server.js",
    "dev": "nodemon server.js"
}
``` 

### Import sample data
I have prepared sample data in folder [dump_data](https://github.com/phatductran/nodejs_electronic_newspaper/tree/master/dump_data) for conveniently testing.
You can find out how to import data from a file with json extension to mongodb database by [mongoimport](https://docs.mongodb.com/manual/reference/program/mongoimport/).

## Avoid
> Since it was my first __Nodejs__ project, it should not be for commercial due to my lack of working experience. Hackers might want to take advantages of bugs to harm your business.
