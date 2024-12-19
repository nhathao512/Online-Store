# 🛒ONLINE STORE

<p>This is an Angular (Frontend) and Java Spring Boot (Backend) application using Docker and MySQL.</p>

## Prerequisites

<li>Java JDK 8 or higher</li>
<li>MySQL Server</li>
<li>IntelliJ IDEA</li>
<li>Docker</li>
<li>Visual Studio Code</li>

## Running the Application

> First clone the project: ```https://github.com/nhathao512/Final-Java-ShopApp.git```

> For the Frontend

* Go to the shopapp-angular folder: cd shopapp-angular
* Download yarn: ```npm install -g yarn```
* Download the package: ```yarn install```
* Run: ```yarn start:dev```

> For the Backend

* Open `"cmd"` and navigate to `"cd"` the Final-Java-ShopApp folder
* Paste the commands in the following order:
* Step 1: `docker-compose -f ./deployment.yaml up -d mysql8-container`
* Step 2: `docker-compose -f ./deployment.yaml up -d phpmyadmin8-container`
* Step 3: `docker-compose -f ./deployment.yaml up -d redis-container`
* Step 4: `docker-compose -f ./kafka-deployment.yaml up -d zookeeper-01`
* Step 5: `docker-compose -f ./kafka-deployment.yaml up -d zookeeper-02`
* Step 6: `docker-compose -f ./kafka-deployment.yaml up -d zookeeper-03`
* Step 7: `docker-compose -f ./kafka-deployment.yaml up -d kafka-broker-01`

> Open browser
* Go to [localhost:8100](https://localhost:8100)
* username: `root`
* password: `Abc123456789@`
* Finally import the ShopApp.sql file

## Author
* [Võ Nhật Hào](https://github.com/nhathao512)

* [Đặng Thành Nhân](https://github.com/nhandang02)

* [Nguyễn Thành Nhân](https://github.com/thanhnhanzxc)
