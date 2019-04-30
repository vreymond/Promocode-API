
# Promocode API

[![NodeJs](https://img.shields.io/badge/code-NodeJs-brightgreen.svg)](https://nodejs.org/en/)
[![Javascript](https://img.shields.io/badge/code-JavaScript-blue.svg)]()
[![Mysql](https://img.shields.io/badge/db-MySQL-red.svg)](https://www.mysql.com)

This is promocode API program. That allow the user to create a new promocode or request a promocode depending on his age, date and meteo weather.


## Getting Started


### Prerequisites

 Installing node.js

- Mac (homebrew): 
```
brew install node
```

- Linux (packet manager):
```
sudo apt-get install nodejs npm
```

- Node website:
```
https://nodejs.org/
```



### Installing

3) Clone the repository project in the directory of your choice with:

```
git clone https://github.com/vreymond/Promocode-API
```

4)  Move to the project directory, and install all npm modules dependencies needed by the program

```
npm install
```



## Program launch
 
- To access the helping manual of the Api containing the entire options list, use the following command:

```bash
node src/api.js -h 
```
You will get:

```bash
> Usage: api [options]

Options:
  -V, --version             output the version number
  -p, --portAPI <portAPI>   Set API port listening
  -l, --loglevel <logLevel  Set log level
  -h, --help                output usage information
```

The -l (or --loglevel) option allows you to modify the verbosity of the console logs.
To see debug level just use the following command:

```
node src/api.js -l debug
```

## API usage

All the routes have been tested using the [Insomnia program](https://insomnia.rest/).

### 1°) API index

You can access the API by using the URL ```http://localhost:<portAPI>/``` (default port is 3000).

### 2°) API create promo route (GET)

Creating a promo code route using query string URL

```
http://localhost:3000/create-promo/WeatherCode/20?age=eq40lt30gt15&end=test&start=test&meteo=clair&temp=gt15

age query must be like eq<value>lt<value>gt<value>
(eq and lt/gt are optional, but lt (or gt) cannot exist without gt (or lt))

end and start date are not implemented
```
Server response:

```
{
  "message": "WeatherCode promo created!"
}
```

### 3°) API ask promo (POST)

Request a promo code depending on the weather:

```
http://localhost:3000/ask-promo

with post body:
{
    "promocode_name": "WeatherCode",
    "arguments": {
        "age": 25,"meteo": { 
            "town":"Paris"
            }
    }
}
```

Server response:

```
{
  "promocode_name": "WeatherCode",
  "status": "accepted",
  "avantage": {
    "percent": "20"
  }
}
```

# Contributors

> Valentin Reymond

<a href="https://github.com/vreymond/Promocode-API" target="_blank">**Promocode API**</a> 

[<img alt="vreymond" src="https://avatars2.githubusercontent.com/u/25683049?s=460&v=4" width="150">](https://github.com/vreymond) 

<a href="https://github.com/vreymond" target="_blank">`github.com/vreymond`</a>


## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details


