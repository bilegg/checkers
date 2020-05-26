/*
    obsługa komunikację Ajax - serwer
*/

function Net() {

    this.sendTable = function (x) {
        $.ajax({
            url: "",
            data: {
                akcja: "SEND_TABLE",
                table: JSON.stringify(x)
            },
            type: "POST",
            success: function (data) {

                var obj = JSON.parse(data)
            },
            error: function (xhr, status, error) {
                console.log(xhr);
            },
        });
    }

    this.canIPlay = function () {
        var checking = setInterval(function () {
            $.ajax({
                url: "",
                data: {
                    akcja: "CAN_I_PLAY",
                    table: null
                },
                type: "POST",
                success: function (data) {

                    var obj = JSON.parse(data)
                    var new_table = obj.table
                    if (obj.canIPlay == true) {
                        clearInterval(checking)
                        net.checkWhoPlays()
                        game.updateBoards(JSON.parse(new_table))
                        game.addPawns()
                    }

                },
                error: function (xhr, status, error) {
                    console.log(xhr);
                },
            });
        }, 1000)
    }

    this.endTurn = function () {
        $.ajax({
            url: "",
            data: {
                akcja: "END_TURN"
            },
            type: "POST",
            success: function (data) {

            },
            error: function (xhr, status, error) {
                console.log(xhr);
            },
        });
    }
    this.checkWhoPlays = function () {
        $.ajax({
            url: "",
            data: {
                akcja: "CHECK"
            },
            type: "POST",
            success: function (data) {

                var obj = JSON.parse(data)
                if (obj.who_plays == "u1") {
                    if (game.user == 1) {
                        game.MyTurn()
                    }
                    if (game.user == 2) {
                        game.EnemyTurn()
                        net.canIPlay()
                    }
                }
                else if (obj.who_plays == "u2") {
                    if (game.user == 1) {
                        game.EnemyTurn()
                        net.canIPlay()
                    }
                    if (game.user == 2) {
                        game.MyTurn()
                    }
                }
            },
            error: function (xhr, status, error) {
                console.log(xhr);
            },
        });
    }

    this.sendData = function () {
        $.ajax({
            url: "",
            data: {
                akcja: "DODAJ_UZYTKOWNIKA",
                user: $("#txt1").val(),
                user_number: 0,
                check_user: false
            },
            type: "POST",
            success: function (data) {

                var obj = JSON.parse(data)
                if (obj.user !== "full") {
                    if (obj.user == "zajete") {
                        alert("Nazwa zajeta")
                    }
                    else {
                        if (obj.user_number == 1) {
                            game.user1Camera()
                            game.drawBoards()
                            game.user = 1
                            $("#waiting").css("display", "block")
                            $("#cover").css("display", "none")
                            var xd = setInterval(function () {
                                $.ajax({
                                    url: "",
                                    data: {
                                        akcja: "SPRAWDZ_UZYTKOWNIKA",
                                        user_number: 0,
                                        check_user: false
                                    },
                                    type: "POST",
                                    success: function (data) {
                                        var obj = JSON.parse(data)

                                        if (obj.check_user == true) {
                                            clearInterval(xd)
                                            $("#waiting").css("display", "none")
                                            $("#cover").css("display", "none")
                                            $("#root").css("display", "block")
                                        }
                                    },
                                    error: function (xhr, status, error) {
                                        console.log(xhr);
                                    },
                                });
                            }, 1000)
                        }
                        if (obj.user_number == 2) {
                            game.user2Camera()
                            game.user = 2
                            game.drawBoards()
                            $("#waiting").css("display", "none")
                            $("#cover").css("display", "none")
                            $("#root").css("display", "block")
                        }
                    }
                }
                else {
                    alert("Juz jest 2 graczy")
                }
            },
            error: function (xhr, status, error) {
                console.log(xhr);
            },
        });
    }
    this.deleteData = function () {
        $.ajax({
            url: "",
            data: {
                akcja: "USUN_UZYTKOWNIKA",
            },
            type: "POST",
            success: function (data) {
                alert("Zresetowano dane")
            },
            error: function (xhr, status, error) {
                console.log(xhr);
            },
        });
    }

}