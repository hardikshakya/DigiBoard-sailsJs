# DigiBoard

## Introduction

- A billboard is a large board that shows advertisements. Big cities face problems of managing billboards with the traditional manually booking system.

- Here I propose an approach of the digital automated billboard management system with data analysis. System analyses traffic data with the help of machine learning/pandas, so customers will be able to target a large number of
audiences for their advertisement.

- Also, we introduce a bidding feature that helps organizations to get more profit. Using traffic data DigiBoard suggests starting bid price to a publisher.
Because of one platform management system time allocation, money transaction, advertisement management, and billboard management done very easily.


## Requirements

+ [Sails](https://sailsjs.com/get-started)
+ [Node v10.15+](https://nodejs.org/en/download/current/)
+ [MYSQL](https://www.mysql.com/downloads/)
+ [NumPy](https://numpy.org/)
+ [Pandas](https://pandas.pydata.org/)


## Prerequestics

+ Install Sails globally `sudo npm install sails -g`
+ Make a MySQL Database and run this [SQL File](https://www.mysql.com/downloads/) to setup the database.
+ Setup **OpenCage Geocoding API** for OpenCage apis related to map.
+ Setup **Sendgrid account** for emailing service.
+ Setup **Stripe account** for payment service.
+ Need to add CSV file of traffic data into `assets/csv_data/trafficdata.csv` folder.


## Getting Started

### Repository Setup

+ Clone the repository:
    `git clone <Repository Path>` \\
    `cd DigiBoard`
+ Install all dependencies: `npm install`.
+ Setup **.env** file in the root directory of the project.
+ Add important credential into `config/custom.js` file too.


## Running Locally

### Node server

Run the project on local machine
`sails lift`


## Third Party Deployments

### OpenCage Geocoding API

+ Log into OpenCage `API KEYS` and select/create `DigiBoard` project to get all the credentials and details about the api usage and grant screen.

### Sendgrid

+ We use sendgrid for emailing the users.The API key can be found from the sendgrid dashboard.

### Stripe

+ We use stripe for payment creation while user buy any Maps from application.


# Sails Documentation

+ [Sails framework documentation](https://sailsjs.com/get-started)
+ [Version notes / upgrading](https://sailsjs.com/documentation/upgrading)
+ [Deployment tips](https://sailsjs.com/documentation/concepts/deployment)
+ [Community support options](https://sailsjs.com/support)
+ [Professional / enterprise options](https://sailsjs.com/enterprise)
