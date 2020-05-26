/*
    klasa Game
*/

function Game() {


    var test = 10;

    // (białe 1, czarne 0)
    var szachownica = [

        [1, 0, 1, 0, 1, 0, 1, 0],
        [0, 1, 0, 1, 0, 1, 0, 1],
        [1, 0, 1, 0, 1, 0, 1, 0],
        [0, 1, 0, 1, 0, 1, 0, 1],
        [1, 0, 1, 0, 1, 0, 1, 0],
        [0, 1, 0, 1, 0, 1, 0, 1],
        [1, 0, 1, 0, 1, 0, 1, 0],
        [0, 1, 0, 1, 0, 1, 0, 1],

    ];

    // (białe - 1, czarne - 2, 0 - puste)
    var pionki = [

        [0, 2, 0, 2, 0, 2, 0, 2],
        [2, 0, 2, 0, 2, 0, 2, 0],
        [0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0],
        [0, 1, 0, 1, 0, 1, 0, 1],
        [1, 0, 1, 0, 1, 0, 1, 0],

    ];


    this.user = 1;

    var init = function () {
        $("h1").html("gra startuje, zmienna test = " + test)

        scene = new THREE.Scene();
        camera = new THREE.PerspectiveCamera(
            45, // kąt patrzenia kamery (FOV - field of view)
            $(window).width() / $(window).height(), // proporcje widoku, powinny odpowiadać proporjom naszego ekranu przeglądarki
            0.1, // minimalna renderowana odległość
            10000 // maxymalna renderowana odległość
        );
        var renderer = new THREE.WebGLRenderer();
        renderer.setSize($(window).width(), $(window).height());
        $("#root").append(renderer.domElement);
        camera.position.x = 1400;
        camera.position.y = 600;
        camera.position.z = 0;
        renderer.setClearColor(0x666699);

        var geometry = new THREE.BoxGeometry(100, 10, 100);
        cylinder_geometry = new THREE.CylinderGeometry(50, 50, 10, 100);

        pawn_holder = [];

        var material_black = new THREE.MeshBasicMaterial({
            color: 0x414449,
            side: THREE.DoubleSide,
            opacity: 1,
            map: new THREE.TextureLoader().load("mats/blackblock.jpg")
        });
        var material_white = new THREE.MeshBasicMaterial({
            color: 0xffffff,
            side: THREE.DoubleSide,
            opacity: 1,
            map: new THREE.TextureLoader().load("mats/whiteblock.jpg")
        });
        cylinder_material_black = new THREE.MeshBasicMaterial({
            color: 0x724c0a,
            side: THREE.DoubleSide,
            opacity: 1,
            map: new THREE.TextureLoader().load("mats/dark.jpg")
        });
        cylinder_material_black_hover = new THREE.MeshBasicMaterial({
            color: 0xFFFFFF,
            side: THREE.DoubleSide,
            opacity: 1,
            map: new THREE.TextureLoader().load("mats/dark.jpg")
        });
        cylinder_material_white = new THREE.MeshBasicMaterial({
            color: 0xddca1f,
            side: THREE.DoubleSide,
            opacity: 1,
            map: new THREE.TextureLoader().load("mats/white.jpg")
        });
        cylinder_material_white_hover = new THREE.MeshBasicMaterial({
            color: 0xb3bac6,
            side: THREE.DoubleSide,
            opacity: 1,
            map: new THREE.TextureLoader().load("mats/white.jpg")
        });

        var x = 300;
        var y = 0;
        var z = -400;
        for (var i = 0; i < szachownica.length; i++) {
            for (var k = 0; k < szachownica[i].length; k++) {
                var cube_black = new THREE.Mesh(geometry, material_black);
                var cube_white = new THREE.Mesh(geometry, material_white);
                if (szachownica[i][k] == 1) {
                    cube_white.userData = { color: "white", row: i, column: k };
                    scene.add(cube_white)
                    cube_white.position.set(x, y, z)
                }
                else if (szachownica[i][k] == 0) {
                    cube_black.userData = { color: "black", row: i, column: k };
                    scene.add(cube_black)
                    cube_black.position.set(x, y, z)
                }
                z += 100
                if (z == 400) {
                    z = -400
                    x -= 100
                }
            }
        }

        camera.lookAt(scene.position)
        function render() {
            requestAnimationFrame(render);

            renderer.render(scene, camera);
        }
        render();

    }

    init();

    var raycaster = new THREE.Raycaster(); 
    var mouseVector = new THREE.Vector2() 
    var mid_move = false

    $(document).mousedown(function (event) {
        mouseVector.x = (event.clientX / $(window).width()) * 2 - 1;
        mouseVector.y = -(event.clientY / $(window).height()) * 2 + 1;

        raycaster.setFromCamera(mouseVector, camera);

        var intersects = raycaster.intersectObjects(scene.children);


        if (intersects.length > 0) {
            if (game.user == 2) {
                if (mid_move == false) {
                    if (intersects[0].object.geometry.type == "CylinderGeometry" && intersects[0].object.userData.color == "white") {
                        intersects[0].object.material = cylinder_material_white_hover
                        pawn = intersects[0].object
                        mid_move = true
                    }
                }
                else if (mid_move) {
                    var row = pawn.userData.row
                    var column = pawn.userData.column
                    var zbijany_right = scene.getObjectByName("r" + (row - 1) + "c" + (column + 1))
                    var zbijany_left = scene.getObjectByName("r" + (row - 1) + "c" + (column - 1))
                    if (intersects[0].object.geometry.type == "BoxGeometry" && intersects[0].object.userData.color == "black" && intersects[0].object.userData.row - pawn.userData.row == -1
                        && (intersects[0].object.userData.column - pawn.userData.column == -1 || intersects[0].object.userData.column - pawn.userData.column == 1)) {
                        pawn.position.x = intersects[0].object.position.x
                        pawn.position.z = intersects[0].object.position.z
                        pionki[intersects[0].object.userData.row][intersects[0].object.userData.column] = 1
                        pionki[pawn.userData.row][pawn.userData.column] = 0

                        game.EnemyTurn()
                        net.endTurn()
                        net.sendTable(pionki)
                        net.checkWhoPlays()

                        pawn.material = cylinder_material_white
                        mid_move = false
                    }
                    else if (intersects[0].object.geometry.type == "BoxGeometry" && intersects[0].object.userData.color == "black" && intersects[0].object.userData.row - pawn.userData.row == -2
                        && zbijany_right != undefined && intersects[0].object.userData.column - pawn.userData.column == 2) {
                        if (zbijany_right.userData.color == "black") {
                            pawn.position.x = intersects[0].object.position.x
                            pawn.position.z = intersects[0].object.position.z
                            pionki[intersects[0].object.userData.row][intersects[0].object.userData.column] = 1
                            pionki[pawn.userData.row][pawn.userData.column] = 0
                            pionki[row - 1][column + 1] = 0

                            scene.remove(zbijany_right);

                            game.EnemyTurn()
                            net.endTurn()
                            net.sendTable(pionki)
                            net.checkWhoPlays()
                            game.addPawns()

                            pawn.material = cylinder_material_white
                            mid_move = false
                        }
                    }
                    else if (intersects[0].object.geometry.type == "BoxGeometry" && intersects[0].object.userData.color == "black" && intersects[0].object.userData.row - pawn.userData.row == -2
                        && zbijany_left != undefined && intersects[0].object.userData.column - pawn.userData.column == -2) {
                        if (zbijany_left.userData.color == "black") {
                            pawn.position.x = intersects[0].object.position.x
                            pawn.position.z = intersects[0].object.position.z
                            pionki[intersects[0].object.userData.row][intersects[0].object.userData.column] = 1
                            pionki[pawn.userData.row][pawn.userData.column] = 0
                            pionki[row - 1][column - 1] = 0
                            
                            scene.remove(zbijany_left);

                            game.EnemyTurn()
                            net.endTurn()
                            net.sendTable(pionki)
                            net.checkWhoPlays()
                            game.addPawns()

                            pawn.material = cylinder_material_white
                            mid_move = false
                        }
                    }
                    else if (intersects[0].object.geometry.type == "CylinderGeometry" && intersects[0].object.userData.color == "white") {
                        intersects[0].object.material = cylinder_material_white_hover
                        pawn.material = cylinder_material_white
                        pawn = intersects[0].object
                    }
                }
            }
            if (game.user == 1) {
                if (mid_move == false) {
                    if (intersects[0].object.geometry.type == "CylinderGeometry" && intersects[0].object.userData.color == "black") {
                        intersects[0].object.material = cylinder_material_black_hover
                        pawn = intersects[0].object
                        mid_move = true
                    }
                }
                else if (mid_move) {
                    var row = pawn.userData.row
                    var column = pawn.userData.column
                    var zbijany_left = scene.getObjectByName("r" + (row + 1) + "c" + (column + 1))
                    var zbijany_right = scene.getObjectByName("r" + (row + 1) + "c" + (column - 1))
                    if (intersects[0].object.geometry.type == "BoxGeometry" && intersects[0].object.userData.color == "black" && intersects[0].object.userData.row - pawn.userData.row == 1
                        && (intersects[0].object.userData.column - pawn.userData.column == -1 || intersects[0].object.userData.column - pawn.userData.column == 1)) {
                        pawn.position.x = intersects[0].object.position.x
                        pawn.position.z = intersects[0].object.position.z
                        pionki[intersects[0].object.userData.row][intersects[0].object.userData.column] = 2
                        pionki[pawn.userData.row][pawn.userData.column] = 0

                        game.EnemyTurn()
                        net.endTurn()
                        net.sendTable(pionki)
                        net.checkWhoPlays()
                        game.addPawns()

                        pawn.material = cylinder_material_black
                        mid_move = false
                    }
                    else if (intersects[0].object.geometry.type == "BoxGeometry" && intersects[0].object.userData.color == "black" && intersects[0].object.userData.row - pawn.userData.row == 2
                        && zbijany_right != undefined && intersects[0].object.userData.column - pawn.userData.column == -2) {
                        if (zbijany_right.userData.color == "white") {
                            pawn.position.x = intersects[0].object.position.x
                            pawn.position.z = intersects[0].object.position.z
                            pionki[intersects[0].object.userData.row][intersects[0].object.userData.column] = 2
                            pionki[pawn.userData.row][pawn.userData.column] = 0
                            pionki[row + 1][column - 1] = 0

                            scene.remove(zbijany_right);

                            game.EnemyTurn()
                            net.endTurn()
                            net.sendTable(pionki)
                            net.checkWhoPlays()
                            game.addPawns()

                            pawn.material = cylinder_material_black
                            mid_move = false
                        }
                    }
                    else if (intersects[0].object.geometry.type == "BoxGeometry" && intersects[0].object.userData.color == "black" && intersects[0].object.userData.row - pawn.userData.row == 2
                        && zbijany_left != undefined && intersects[0].object.userData.column - pawn.userData.column == 2) {
                        if (zbijany_left.userData.color == "white") {
                            pawn.position.x = intersects[0].object.position.x
                            pawn.position.z = intersects[0].object.position.z
                            pionki[intersects[0].object.userData.row][intersects[0].object.userData.column] = 2
                            pionki[pawn.userData.row][pawn.userData.column] = 0
                            pionki[row + 1][column + 1] = 0
                            
                            scene.remove(zbijany_left);

                            game.EnemyTurn()
                            net.endTurn()
                            net.sendTable(pionki)
                            net.checkWhoPlays()
                            game.addPawns()

                            pawn.material = cylinder_material_black
                            mid_move = false
                        }
                    }
                    else if (intersects[0].object.geometry.type == "CylinderGeometry" && intersects[0].object.userData.color == "black") {
                        intersects[0].object.material = cylinder_material_black_hover
                        pawn.material = cylinder_material_black
                        pawn = intersects[0].object
                    }
                }
            }
        }
    })

    this.addPawns = function () {
        var x = 300;
        var y = 10;
        var z = -400;

        for (var i = 0; i < pawn_holder.length; i++) {
            scene.remove(pawn_holder[i])
        }
        pawn_holder = []



        for (var i = 0; i < pionki.length; i++) {
            for (var k = 0; k < pionki[i].length; k++) {
                var cylinder_white = new THREE.Mesh(cylinder_geometry, cylinder_material_white);
                var cylinder_black = new THREE.Mesh(cylinder_geometry, cylinder_material_black);
                if (pionki[i][k] == 1) {
                    cylinder_white.userData = { color: "white", row: i, column: k };
                    cylinder_white.name = "r" + i + "c" + k
                    pawn_holder.push(cylinder_white)
                    scene.add(cylinder_white)
                    cylinder_white.position.set(x, y, z)
                }
                else if (pionki[i][k] == 2) {
                    cylinder_black.userData = { color: "black", row: i, column: k };
                    cylinder_black.name = "r" + i + "c" + k
                    pawn_holder.push(cylinder_black)
                    scene.add(cylinder_black)
                    cylinder_black.position.set(x, y, z)
                }
                else if (pionki[i][k] == 0) { }
                z += 100
                if (z == 400) {
                    z = -400
                    x -= 100
                }
            }
        }

    }
    this.MyTurn = function () {
        $("#turn_end").css("display", "none")
    }

    this.EnemyTurn = function () {
        $("#turn_end").css("display", "block")
    }

    this.updateBoards = function (table) {
        $(".tab_image").html("")
        pionki = table
        if (game.user == 1) {
            for (var i = pionki.length - 1; i >= 0; i--) {
                for (var x = pionki.length - 1; x >= 0; x--) {
                    var string = pionki[i][x]
                    $(".tab_image").append(string)
                }
                var br = "<br>"
                $(".tab_image").append(br)
            }
        }
        else if (game.user == 2) {
            for (var i = 0; i < pionki.length; i++) {
                for (var x = 0; x < pionki[i].length; x++) {
                    var string = pionki[i][x]
                    $(".tab_image").append(string)
                }
                var br = "<br>"
                $(".tab_image").append(br)
            }
        }
    }
    this.drawBoards = function () {
        if (game.user == 1) {
            var tab_image = $("<div>")
            tab_image.addClass("tab_image")
            for (var i = pionki.length - 1; i >= 0; i--) {
                for (var x = pionki.length - 1; x >= 0; x--) {
                    var string = pionki[i][x]
                    tab_image.append(string)
                }
                var br = "<br>"
                tab_image.append(br)
            }
            $("#root").append(tab_image)
        }
        else if (game.user == 2) {
            var tab_image = $("<div>")
            tab_image.addClass("tab_image")
            for (var i = 0; i < pionki.length; i++) {
                for (var x = 0; x < pionki[i].length; x++) {
                    var string = pionki[i][x]
                    tab_image.append(string)
                }
                var br = "<br>"
                tab_image.append(br)
            }
            $("#root").append(tab_image)
        }
    }

    this.setTest = function (val) {
        test = val;
        $("h1").html("ustawiam test w klasie Game na: " + test)
    }

    this.getTest = function () {
        return test;
    }

    this.user1Camera = function () {
        camera.position.set(800, 1000, 0)
        camera.lookAt(scene.position)
    }
    this.user2Camera = function () {
        camera.position.set(-800, 1000, 0)
        camera.lookAt(scene.position)
        camera.position.z = -100
        camera.position.x = -900
    }

}
