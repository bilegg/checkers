/*
    UI - obsługa interfejsu użytkownika
*/

function Ui() {

    $("#bt1").on("click", function () {
        net.sendData()
        net.checkWhoPlays()
        game.addPawns()
    })

    $("#bt2").on("click", function () {
        net.deleteData()
    })
}