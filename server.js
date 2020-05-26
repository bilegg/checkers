var http = require("http");
var fs = require("fs");
var qs = require("querystring");
var user_tab = [];
var user1_turn = true
var user2_turn = false
var turn_end = false
var table = [];
var server = http.createServer(function (req, res) {
    console.log(req.url)
    switch (req.method) {
        case "GET":
            if (req.url === "/")
                fs.readFile("static/index.html", function (error, data) {
                    res.writeHead(200, { 'Content-Type': 'text/html' });
                    res.write(data);
                    res.end();
                })
            else if (req.url === "/js/jquery.js") {
                fs.readFile("static/js/jquery.js", function (error, data) {
                    res.writeHead(200, { 'Content-Type': 'application/javascript' });
                    res.write(data);
                    res.end();
                })
            }
            else if (req.url === "/js/Game.js") {
                fs.readFile("static/js/Game.js", function (error, data) {
                    res.writeHead(200, { 'Content-Type': 'application/javascript' });
                    res.write(data);
                    res.end();
                })
            }
            else if (req.url === "/js/Main.js") {
                fs.readFile("static/js/Main.js", function (error, data) {
                    res.writeHead(200, { 'Content-Type': 'application/javascript' });
                    res.write(data);
                    res.end();
                })
            }
            else if (req.url === "/js/Net.js") {
                fs.readFile("static/js/Net.js", function (error, data) {
                    res.writeHead(200, { 'Content-Type': 'application/javascript' });
                    res.write(data);
                    res.end();
                })
            }
            else if (req.url === "/js/UI.js") {
                fs.readFile("static/js/UI.js", function (error, data) {
                    res.writeHead(200, { 'Content-Type': 'application/javascript' });
                    res.write(data);
                    res.end();
                })
            }
            else if (req.url === "/js/three.js") {
                fs.readFile("static/js/three.js", function (error, data) {
                    res.writeHead(200, { 'Content-Type': 'application/javascript' });
                    res.write(data);
                    res.end();
                })
            }
            else if (req.url === "/css/stylesheet.css") {
                fs.readFile("static/css/stylesheet.css", function (error, data) {
                    res.writeHead(200, { 'Content-Type': 'text/css' });
                    res.write(data);
                    res.end();
                })
            }
            else if (req.url === "/mats/dark.jpg") {
                fs.readFile("static/js/mats/dark.jpg", function (error, data) {
                    res.writeHead(200, { 'Content-Type': 'image/jpeg' });
                    res.write(data);
                    res.end();
                })
            }
            else if (req.url === "/mats/white.jpg") {
                fs.readFile("static/js/mats/white.jpg", function (error, data) {
                    res.writeHead(200, { 'Content-Type': 'image/jpeg' });
                    res.write(data);
                    res.end();
                })
            }
            else if (req.url === "/mats/blackblock.jpg") {
                fs.readFile("static/js/mats/blackblock.jpg", function (error, data) {
                    res.writeHead(200, { 'Content-Type': 'image/jpeg' });
                    res.write(data);
                    res.end();
                })
            }
            else if (req.url === "/mats/whiteblock.jpg") {
                fs.readFile("static/js/mats/whiteblock.jpg", function (error, data) {
                    res.writeHead(200, { 'Content-Type': 'image/jpeg' });
                    res.write(data);
                    res.end();
                })
            }
            break;
        case "POST":

            servResponse(req, res)

            break;

    }
})


function dodajUseraDoTablicy() {
    if (user_tab.length < 2) {
        if (finishObj.user == user_tab[0]) {
            finishObj.user = "zajete"
        }
        else {
            user_tab.push(finishObj.user)
            finishObj.user_number = user_tab.length
        }

    }
    else {
        finishObj.user = "full"
    }
}

function wyczyscTablicaUserow() {
    user_tab = []
}

function czyJestDwochUserow() {
    if (user_tab.length == 2) finishObj.check_user = true
}

function check() {
    if (user1_turn) finishObj.who_plays = "u1"
    else if (user2_turn) finishObj.who_plays = "u2"
}

function end_turn() {
    turn_end = true
    if (user1_turn) {
        user1_turn = false
        user2_turn = true
    }
    else {
        user1_turn = true
        user2_turn = false
    }
}
function can_i_play() {
    if (turn_end == true) {
        finishObj.canIPlay = true
        finishObj.table = table
        turn_end = false
    }
}
function send_table() {
    table = finishObj.table
}

function servResponse(req, res) {
    var allData = "";

    req.on("data", function (data) {
        allData += data;
    })

    req.on("end", function (data) {
        finishObj = qs.parse(allData)

        switch (finishObj.akcja) {
            case "DODAJ_UZYTKOWNIKA":
                dodajUseraDoTablicy();
                res.end(JSON.stringify(finishObj));
                break;
            case "USUN_UZYTKOWNIKA":
                wyczyscTablicaUserow()
                res.end(JSON.stringify(finishObj));
                break;
            case "SPRAWDZ_UZYTKOWNIKA":
                czyJestDwochUserow()
                res.end(JSON.stringify(finishObj));
                break;
            case "CHECK":
                check()
                res.end(JSON.stringify(finishObj));
                break;
            case "CAN_I_PLAY":
                can_i_play()
                res.end(JSON.stringify(finishObj));
                break;
            case "END_TURN":
                end_turn()
                res.end(JSON.stringify(finishObj));
                break;
            case "SEND_TABLE":
                send_table()
                res.end(JSON.stringify(finishObj));
                break;
        }
    })

}



server.listen(3000, function () {
    console.log("serwer startuje na porcie 3000")
});