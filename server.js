var http = require("http");
var fs = require("fs");
var qs = require("querystring");
var player_tab = [];
var player1_turn = true
var player2_turn = false
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


function add_user() {
    if (player_tab.length < 2) {
        if (finishObj.user == player_tab[0]) {
            finishObj.user = "taken"
        }
        else {
            player_tab.push(finishObj.user)
            finishObj.user_number = player_tab.length
        }

    }
    else {
        finishObj.user = "full"
    }
}

function clear_array() {
    player_tab = []
}

function check_for_two_users() {
    if (player_tab.length == 2) finishObj.check_user = true
}

function check_who_plays() {
    if (player1_turn) finishObj.who_plays = "u1"
    else if (player2_turn) finishObj.who_plays = "u2"
}

function end_turn() {
    turn_end = true
    if (player1_turn) {
        player1_turn = false
        player2_turn = true
    }
    else {
        player1_turn = true
        player2_turn = false
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
            case "ADD_USER":
                add_user();
                res.end(JSON.stringify(finishObj));
                break;
            case "DELETE_USER":
                clear_array()
                res.end(JSON.stringify(finishObj));
                break;
            case "CHECK_USERS":
                check_for_two_users()
                res.end(JSON.stringify(finishObj));
                break;
            case "CHECK":
                check_who_plays()
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