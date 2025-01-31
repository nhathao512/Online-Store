# 🛒ONLINE STORE

<p>This is an Angular (Frontend) and Java Spring Boot (Backend) application using MySQL (Database) and Docker.</p>

## 🔦Prerequisites

<li>Java JDK 17 or higher</li>
<li>MySQL Server</li>
<li>IntelliJ IDEA</li>
<li>Docker</li>
<li>Postman</li>
<li>Visual Studio Code</li>

## 💻Running the Application

> First clone the project: 
<pre>
    <code id="code">https://github.com/nhathao512/Online-Store.git</code><button class="copy-btn" onclick="copyCode()"></button>
</pre>

> For the Frontend

* Go to the shopapp-angular folder: cd shopapp-angular
* Download yarn: 
<pre>
    <code id="code">npm install -g yarn</code><button class="copy-btn" onclick="copyCode()"></button>
</pre>
* Download the package: 
<pre>
    <code id="code">yarn install</code><button class="copy-btn" onclick="copyCode()"></button>
</pre>
* Run code:
<pre>
    <code id="code">yarn start:dev</code><button class="copy-btn" onclick="copyCode()"></button>
</pre>

> For the Backend

* Open `"cmd"` and navigate to `"cd"` the Final-Java-ShopApp folder
* Paste the commands in the following order:
* Step 1: 
<pre>
    <code id="code">docker-compose -f ./deployment.yaml up -d mysql8-container</code><button class="copy-btn" onclick="copyCode()"></button>
</pre>
* Step 2: 
<pre>
    <code id="code">docker-compose -f ./deployment.yaml up -d phpmyadmin8-container</code><button class="copy-btn" onclick="copyCode()"></button>
</pre>
* Step 3: 
<pre>
    <code id="code">docker-compose -f ./deployment.yaml up -d redis-container</code><button class="copy-btn" onclick="copyCode()"></button>
</pre>
* Step 4:
<pre>
    <code id="code">docker-compose -f ./kafka-deployment.yaml up -d zookeeper-01</code><button class="copy-btn" onclick="copyCode()"></button>
</pre>
* Step 5: 
<pre>
    <code id="code">docker-compose -f ./kafka-deployment.yaml up -d zookeeper-02</code><button class="copy-btn" onclick="copyCode()"></button>
</pre>
* Step 6: 
<pre>
    <code id="code">docker-compose -f ./kafka-deployment.yaml up -d zookeeper-03</code><button class="copy-btn" onclick="copyCode()"></button>
</pre>
* Step 7:
<pre>
    <code id="code">docker-compose -f ./kafka-deployment.yaml up -d kafka-broker-01</code><button class="copy-btn" onclick="copyCode()"></button>
</pre>

> Open browser
* Go to [localhost:8100](https://localhost:8100)
* username:
<pre>
    <code id="code">root</code><button class="copy-btn" onclick="copyCode()"></button>
</pre>
* password: 
<pre>
    <code id="code">Abc123456789</code><button class="copy-btn" onclick="copyCode()"></button>
</pre>
* Finally import the `ShopApp.sql` file

## 📹Demo Video
A walkthrough of the application can be accessed via the following link:
[Demo Video](https://www.youtube.com/live/42gNaysrR_8)

## ⚖️ License
This project is licensed under the [License](LICENSE.md).

## 🧑‍💻Author
* [Võ Nhật Hào](https://github.com/nhathao512)

* [Đặng Thành Nhân](https://github.com/nhandang02)

* [Nguyễn Thành Nhân](https://github.com/thanhnhanzxc)

---

### Thanks for visting our project ❤️! 
