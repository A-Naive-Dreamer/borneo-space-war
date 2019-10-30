'use strict'

let borneoSpaceWar = angular.module('borneoSpaceWar', [])

borneoSpaceWar.constant('BODY', angular.element('body'))
borneoSpaceWar.constant('CLOCK_IMAGES', angular.element('#clock > img'))
borneoSpaceWar.constant('DATE', new Date())
borneoSpaceWar.constant('DELAY_TIME', 1220)
borneoSpaceWar.constant('ENEMY_BULLET_IMAGE', angular.element('#enemy-bullet > img'))
borneoSpaceWar.constant('ENEMY_IMAGES', angular.element('#enemy > img'))
borneoSpaceWar.constant('EXPLOSION_IMAGES', angular.element('#explosion > img'))
borneoSpaceWar.constant('GAME', angular.element('#game'))
borneoSpaceWar.constant('GAME_OVER', angular.element('#game-over'))
borneoSpaceWar.constant('PLAYER_1_BULLETS_IMAGE', angular.element('#player-1-bullets > img'))
borneoSpaceWar.constant('PLAYER_2_BULLETS_IMAGE', angular.element('#player-2-bullets > img'))
borneoSpaceWar.constant('PLAYER_1_IMAGES', angular.element('#player-1 > img'))
borneoSpaceWar.constant('PLAYER_2_IMAGES', angular.element('#player-2 > img'))
borneoSpaceWar.constant('PLAYERS_CONTROLLER', angular.element('#players-controller'))
borneoSpaceWar.constant('SOUNDTRACK_1', angular.element('#soundtrack-1'))
borneoSpaceWar.constant('SOUNDTRACK_2', angular.element('#soundtrack-2'))
borneoSpaceWar.constant('SOUNDTRACK_3', angular.element('#soundtrack-3'))
borneoSpaceWar.constant('TIMER_CLOCK', angular.element('#timer-clock'))

borneoSpaceWar.value('countdown', undefined)
borneoSpaceWar.value('defeatedEnemiesNumber', 0)
borneoSpaceWar.value('defeatedPlayersNumber', 0)
borneoSpaceWar.value('enemies', [])
borneoSpaceWar.value('firstClick', true)
borneoSpaceWar.value('framesEnemiesBullets', [])
borneoSpaceWar.value('framesExplosion', [])
borneoSpaceWar.value('framesPlayer1', undefined)
borneoSpaceWar.value('framesPlayer2', undefined)
borneoSpaceWar.value('framesPlayer1Bullets', [])
borneoSpaceWar.value('framesPlayer2Bullets', [])
borneoSpaceWar.value('framesEnemies', [])
borneoSpaceWar.value('isGamePause', true)
borneoSpaceWar.value('isGameStop', false)
borneoSpaceWar.value('moveEnemies1', undefined)
borneoSpaceWar.value('moveEnemies2', [])
borneoSpaceWar.value('player1Delay', 0)
borneoSpaceWar.value('player2Delay', 0)
borneoSpaceWar.value('pointer1', 0)
borneoSpaceWar.value('pointer2', 0)
borneoSpaceWar.value('pointer3', [])
borneoSpaceWar.value('pointer4', [])
borneoSpaceWar.value('pointer5', 0)

borneoSpaceWar.controller('startMenuController', function($scope, $window, BODY, SOUNDTRACK_3) {
    $scope.goToGame = function() {
        $window.location.href = './pages/game.min.html'
    }

    $scope.askPlayersName = function() {
        let player1Name = '',
            player2Name = ''

        BODY.eq(0).css({
            'height': $window.innerHeight + 'px',
            'width': $window.innerWidth + 'px'
        })

        SOUNDTRACK_3[0].play()

        if(localStorage.getItem('player1Name')) {
            localStorage.setItem('player1Name', localStorage.getItem('player1Name'))
        } else {
            localStorage.setItem('player1Name', 'Bloody Cloud')
        }

        if(localStorage.getItem('player2Name')) {
            localStorage.setItem('player2Name', localStorage.getItem('player2Name'))
        } else {
            localStorage.setItem('player2Name', 'Peaceful Sky')
        }

        player1Name = $window.prompt('Please input name of player 1/red.', localStorage.getItem('player1Name'))
        player2Name = $window.prompt('Please input name of player 2/blue.', localStorage.getItem('player2Name'))

        if(!player1Name || !player2Name) {
            $scope.askPlayersName()
            return
        }

        localStorage.setItem('player1Name', player1Name)
        localStorage.setItem('player2Name', player2Name)
    }

    $scope.goToScoreboard = function() {
        $window.location.href = './pages/scoreboard.min.html'
    }

    $scope.goToTutorial = function() {
        $window.location.href = './pages/tutorial.min.html'
    }

    $scope.goToCredits = function() {
        $window.location.href = './pages/credits.min.html'
    }
})

borneoSpaceWar.controller('tutorialController', function($scope, $window, BODY, SOUNDTRACK_2) {
    $scope.prepareTutorial = function() {
        BODY.eq(0).css({
            'height': $window.innerHeight + 'px',
            'width': $window.innerWidth + 'px'
        })

        SOUNDTRACK_2[0].play()
    }

    $scope.goToStartMenu = function() {
        location.assign('./../index.min.html')
    }
})

borneoSpaceWar.controller('creditsController', function($scope, $window, BODY, SOUNDTRACK_3) {
    $scope.prepareCredits = function() {
        BODY.eq(0).css({
            'height': $window.innerHeight + 'px',
            'width': $window.innerWidth + 'px'
        })

        SOUNDTRACK_3[0].play()
    }

    $scope.goToStartMenu = function() {
        location.assign('./../index.min.html')
    }
})

borneoSpaceWar.controller('scoreboardController', function($scope, $window, BODY, SOUNDTRACK_2) {
    $scope.prepareScoreboard = function() {
        SOUNDTRACK_2[0].play()

        if(localStorage.getItem('records')) $scope.records = JSON.parse(localStorage.getItem('records'))

        BODY.eq(0).css({
            'height': $window.innerHeight + 'px',
            'width': $window.innerWidth + 'px'
        })
    }

    $scope.goToStartMenu = function() {
        location.assign('./../index.min.html')
    }

    function makeStringSafe(text) {
        text = text.toString().trim()

        if(text.length <= 0) return

        let newText = ''

        for(let x = 0; x < text.length; ++x) {
            newText += '&#' + text.charCodeAt(x) + ';'
        }

        return newText
    }
})

borneoSpaceWar.controller('gameController', function($document, $interval, $scope, $window, CLOCK_IMAGES, DATE, DELAY_TIME, ENEMY_BULLET_IMAGE, ENEMY_IMAGES, EXPLOSION_IMAGES, GAME, GAME_OVER, PLAYER_1_BULLETS_IMAGE,
    PLAYER_2_BULLETS_IMAGE, PLAYER_1_IMAGES, PLAYER_2_IMAGES, PLAYERS_CONTROLLER, SOUNDTRACK_1, TIMER_CLOCK, countdown, defeatedEnemiesNumber, defeatedPlayersNumber, enemies,
    firstClick, framesEnemiesBullets, framesExplosion, framesPlayer1, framesPlayer2, framesPlayer1Bullets, framesPlayer2Bullets, framesEnemies, isGamePause, isGameStop, moveEnemies1, moveEnemies2, pointer1,
    player1Delay, player2Delay, pointer2, pointer3, pointer4, pointer5) {
    const CANVAS_WIDTH = parseInt(GAME.eq(0).attr('width')),
        CANVAS_HEIGHT = parseInt(GAME.eq(0).attr('height')),
        FRAMES_LIMIT_1 = PLAYER_1_IMAGES.length,
        FRAMES_LIMIT_2 = PLAYER_2_IMAGES.length,
        PAINTER = GAME[0].getContext('2d'),
        PLAYER_1_BULLETS = (function() {
            const PLAYER_1_BULLETS = {
                    width: parseInt(PLAYER_1_BULLETS_IMAGE.eq(0).css('width')),
                    height: parseInt(PLAYER_1_BULLETS_IMAGE.eq(0).css('height'))
                }

            return {
                getWidth: function() {
                    return PLAYER_1_BULLETS.width
                },
                getHeight: function() {
                    return PLAYER_1_BULLETS.height
                }
            }
        })(),
        PLAYER_2_BULLETS = (function() {
            const PLAYER_2_BULLETS = {
                    width: parseInt(PLAYER_2_BULLETS_IMAGE.eq(0).css('width')),
                    height: parseInt(PLAYER_2_BULLETS_IMAGE.eq(0).css('height'))
                }

            return {
                getWidth: function() {
                    return PLAYER_2_BULLETS.width
                },
                getHeight: function() {
                    return PLAYER_2_BULLETS.height
                }
            }
        })(),
        PLAYER_1 = (function() {
            const PLAYER_1 = {
                currentImage: PLAYER_1_IMAGES[pointer1],
                height: parseInt(PLAYER_1_IMAGES.eq(0).attr('height')),
                width: parseInt(PLAYER_1_IMAGES.eq(0).attr('width')),
                x: CANVAS_WIDTH - parseInt(PLAYER_1_IMAGES.eq(0).attr('width')),
                y: CANVAS_HEIGHT - parseInt(PLAYER_1_IMAGES.eq(0).attr('height')),
                bullets: [],
                lives: 0,
                points: 0,
                crushedStatus: false
            }

            return {
                startGame: function() {
                    PLAYER_1.lives = 5
                },
                crushed: function() {
                    PLAYER_1.crushedStatus = true
                },
                isCrushed: function() {
                    return PLAYER_1.crushedStatus
                },
                bulletsCrushed: function(x) {
                    PLAYER_1.bullets[x].crushedStatus = true

                    return PLAYER_1.bullets[x].crushedStatus
                },
                isBulletsCrushed: function(x) {
                    return PLAYER_1.bullets[x].crushedStatus
                },
                getHeight: function() {
                    return PLAYER_1.height
                },
                getWidth: function() {
                    return PLAYER_1.width
                },
                getX: function() {
                    return PLAYER_1.x
                },
                getY: function() {
                    return PLAYER_1.y
                },
                setX: function(x) {
                    PLAYER_1.x = x
                },
                setY: function(y) {
                    PLAYER_1.y = y
                },
                getCurrentImage: function() {
                    return PLAYER_1.currentImage
                },
                setCurrentImage: function(currentImage) {
                    PLAYER_1.currentImage = currentImage
                },
                getBullets: function() {
                    return PLAYER_1.bullets
                },
                setBulletsYCord: function(x, y) {
                    PLAYER_1.bullets[x].y = y
                },
                addBullets: function() {
                    PLAYER_1.bullets.push({
                        x: PLAYER_1.x,
                        y: CANVAS_HEIGHT - PLAYER_1.height - PLAYER_1_BULLETS.getHeight(),
                        width: PLAYER_1_BULLETS.getWidth(),
                        height: PLAYER_1_BULLETS.getHeight(),
                        crushedStatus: false
                    })
                },
                getPoints: function() {
                    return PLAYER_1.points;
                },
                add1Point: function() {
                    ++PLAYER_1.points
                    $scope.player1Points = PLAYER_1.points
                },
                add2Points: function() {
                    PLAYER_1.points += 2
                    $scope.player1Points = PLAYER_1.points
                },
                subtractLive: function() {
                    --PLAYER_1.lives
                    $scope.player1Lives = PLAYER_1.lives
                },
                getLives: function() {
                    return PLAYER_1.lives
                }
            }
        })(),
        PLAYER_2 = (function() {
            const PLAYER_2 = {
                currentImage: PLAYER_2_IMAGES[pointer2],
                height: parseInt(PLAYER_2_IMAGES.eq(0).attr('height')),
                width: parseInt(PLAYER_2_IMAGES.eq(0).attr('width')),
                x: 0,
                y: 0,
                bullets: [],
                lives: 0,
                points: 0,
                crushedStatus: false
            }

            return {
                startGame: function() {
                    PLAYER_2.lives = 5
                },
                crushed: function() {
                    PLAYER_2.crushedStatus = true
                },
                isCrushed: function() {
                    return PLAYER_2.crushedStatus
                },
                bulletsCrushed: function(x) {
                    PLAYER_2.bullets[x].crushedStatus = true

                    return PLAYER_2.bullets[x].crushedStatus
                },
                isBulletsCrushed: function(x) {
                    return PLAYER_2.bullets[x].crushedStatus
                },
                getHeight: function() {
                    return PLAYER_2.height
                },
                getWidth: function() {
                    return PLAYER_2.width
                },
                getX: function() {
                    return PLAYER_2.x
                },
                getY: function() {
                    return PLAYER_2.y
                },
                setX: function(x) {
                    PLAYER_2.x = x
                },
                setY: function(y) {
                    PLAYER_2.y = y
                },
                getCurrentImage: function() {
                    return PLAYER_2.currentImage
                },
                setCurrentImage: function(currentImage) {
                    PLAYER_2.currentImage = currentImage
                },
                getBullets: function() {
                    return PLAYER_2.bullets
                },
                setBulletsYCord: function(x, y) {
                    PLAYER_2.bullets[x].y = y
                },
                addBullets: function() {
                    PLAYER_2.bullets.push({
                        x: PLAYER_2.x,
                        y: PLAYER_2.y + PLAYER_2.height,
                        width: PLAYER_2_BULLETS.getWidth(),
                        height: PLAYER_2_BULLETS.getHeight(),
                        crushedStatus: false
                    })
                },
                getPoints: function() {
                    return PLAYER_2.points;
                },
                add1Point: function() {
                    ++PLAYER_2.points
                    $scope.player2Points = PLAYER_2.points
                },
                add2Points: function() {
                    PLAYER_2.points += 2
                    $scope.player2Points = PLAYER_2.points
                },
                subtractLive: function() {
                    --PLAYER_2.lives
                    $scope.player2Lives = PLAYER_2.lives
                },
                getLives: function() {
                    return PLAYER_2.lives
                }
            }
        })()

    $scope.action = 'Start'
    $scope.player1Lives = 5
    $scope.player2Lives = 5
    $scope.player1Points = 0
    $scope.player2Points = 0
    $scope.time = 20

    function moveUpEnemies(pointer) {
        if(enemies[pointer].isCrushed()) return

        let y = enemies[pointer].getY() - 32

        PAINTER.clearRect(enemies[pointer].getX(), enemies[pointer].getY(), enemies[pointer].getWidth(), enemies[pointer].getHeight())

        enemies[pointer].setY(y)

        PAINTER.drawImage(enemies[pointer].getCurrentImage(), enemies[pointer].getX(), y)
        PAINTER.globalCompositeOperation = 'destination-over'
    }

    function moveDownEnemies(pointer) {
        if(enemies[pointer].isCrushed()) return

        let y = enemies[pointer].getY() + 32

        PAINTER.clearRect(enemies[pointer].getX(), enemies[pointer].getY(), enemies[pointer].getWidth(), enemies[pointer].getHeight())

        enemies[pointer].setY(y)

        PAINTER.drawImage(enemies[pointer].getCurrentImage(), enemies[pointer].getX(), y)
        PAINTER.globalCompositeOperation = 'destination-over'
    }

    function moveLeftEnemies(pointer) {
        if(enemies[pointer].isCrushed()) return

        let x = enemies[pointer].getX() - 32

        PAINTER.clearRect(enemies[pointer].getX(), enemies[pointer].getY(), enemies[pointer].getWidth(), enemies[pointer].getHeight())

        enemies[pointer].setX(x)

        PAINTER.drawImage(enemies[pointer].getCurrentImage(), x, enemies[pointer].getY())
        PAINTER.globalCompositeOperation = 'destination-over'
    }

    function moveRightEnemies(pointer) {
        if(enemies[pointer].isCrushed()) return

        let x = enemies[pointer].getX() + 32

        PAINTER.clearRect(enemies[pointer].getX(), enemies[pointer].getY(), enemies[pointer].getWidth(), enemies[pointer].getHeight())

        enemies[pointer].setX(x)

        PAINTER.drawImage(enemies[pointer].getCurrentImage(), x, enemies[pointer].getY())
        PAINTER.globalCompositeOperation = 'destination-over'
    }

    function moveEnemies1() {
        let colsLimit = 9,
            pointer = 0,
            rowsLimit = 3,
            x = (CANVAS_WIDTH - (parseInt(ENEMY_IMAGES.eq(0).attr('width')) * colsLimit)) / 2,
            y = (CANVAS_HEIGHT - (parseInt(ENEMY_IMAGES.eq(0).attr('height')) * rowsLimit)) / 2

        for(let rowsNumber = 0; rowsNumber < rowsLimit; ++rowsNumber) {
            for(let colsNumber = 0; colsNumber < colsLimit; ++colsNumber) {
                pointer = (rowsNumber * colsLimit) + colsNumber
                pointer3.push(0)
                pointer4.push([
                    [6, true],
                    [34, true],
                    [2, true],
                    [12, true],
                    [2, true],
                    [12, true],
                    [56, true],
                    [2, true],
                    [12, true],
                    [2, true],
                    [12, true],
                    [56, true],
                    [2, true],
                    [12, true],
                    [2, true],
                    [12, true]
                ])
                framesEnemiesBullets.push([])

                enemies.push((function() {
                    const ENEMY = {
                        bullets1: [],
                        bullets2: [],
                        crushedStatus: false,
                        currentImage: ENEMY_IMAGES[0],
                        height: parseInt(ENEMY_IMAGES.eq(0).attr('height')),
                        width: parseInt(ENEMY_IMAGES.eq(0).attr('width')),
                        x: x,
                        y: y
                    }

                    return {
                        crushed: function() {
                            ENEMY.crushedStatus = true
                        },
                        isCrushed: function() {
                            return ENEMY.crushedStatus
                        },
                        getBullets1: function() {
                            return ENEMY.bullets1
                        },
                        getBullets2: function() {
                            return ENEMY.bullets2
                        },
                        setBullets1YCord: function(x, y) {
                            ENEMY.bullets1[x].y = y
                        },
                        setBullets1XCord: function(x1, x2) {
                            ENEMY.bullets1[x1].x = x2
                        },
                        setBullets2YCord: function(x, y) {
                            ENEMY.bullets2[x].y = y
                        },
                        setBullets2XCord: function(x1, x2) {
                            ENEMY.bullets2[x1].x = x2
                        },
                        addBullets1: function() {
                            ENEMY.bullets1.push({
                                x: ENEMY.x,
                                y: ENEMY.y,
                                height: parseInt(ENEMY_BULLET_IMAGE.eq(0).css('height')),
                                width: parseInt(ENEMY_BULLET_IMAGE.eq(0).css('width')),
                                crushedStatus: false
                            })
                        },
                        addBullets2: function() {
                            ENEMY.bullets2.push({
                                x: ENEMY.x,
                                y: ENEMY.y,
                                height: parseInt(ENEMY_BULLET_IMAGE.eq(0).css('height')),
                                width: parseInt(ENEMY_BULLET_IMAGE.eq(0).css('width')),
                                crushedStatus: false
                            })
                        },
                        bullets1Crushed: function(x) {
                            ENEMY.bullets1[x].crushedStatus = true

                            return ENEMY.bullets1[x].crushedStatus
                        },
                        isBullets1Crushed: function(x) {
                            return ENEMY.bullets1[x].crushedStatus
                        },
                        bullets2Crushed: function(x) {
                            ENEMY.bullets2[x].crushedStatus = true

                            return ENEMY.bullets2[x].crushedStatus
                        },
                        isBullets2Crushed: function(x) {
                            return ENEMY.bullets2[x].crushedStatus
                        },
                        setCurrentImage: function(currentImage) {
                            ENEMY.currentImage = currentImage
                        },
                        getCurrentImage: function() {
                            return ENEMY.currentImage
                        },
                        setX: function(x) {
                            ENEMY.x = x
                        },
                        setY: function(y) {
                            ENEMY.y = y
                        },
                        getX: function() {
                            return ENEMY.x
                        },
                        getY: function() {
                            return ENEMY.y
                        },
                        getWidth: function() {
                            return ENEMY.width
                        },
                        getHeight: function() {
                            return ENEMY.height
                        }
                    }
                })())

                if(angular.isDefined(moveEnemies2[pointer])) return

                moveEnemies2.push($interval((function () {
                    const COLS_LIMIT = colsLimit,
                        CURRENT_ROW_NUMBER = rowsNumber,
                        CURRENT_COL_NUMBER = colsNumber,
                        POINTER = pointer,
                        ROWS_LIMIT = rowsLimit

                    return function() {
                        if(isGamePause) return

                        if(pointer4[POINTER][1][1]) {
                            if(pointer4[POINTER][0][1]) {
                                --pointer4[POINTER][1][0]
                                --pointer4[POINTER][0][0]

                                if(pointer4[POINTER][0][0] <= 0) pointer4[POINTER][0][1] = false

                                let pointer = (COLS_LIMIT * CURRENT_ROW_NUMBER) + ((COLS_LIMIT - 1) - CURRENT_COL_NUMBER)

                                moveRightEnemies(pointer)
                            } else if(pointer4[POINTER][2][1]) {
                                --pointer4[POINTER][1][0]
                                --pointer4[POINTER][2][0]

                                if(pointer4[POINTER][2][0] <= 0) pointer4[POINTER][2][1] = false

                                let pointer = ((ROWS_LIMIT - 1 - CURRENT_ROW_NUMBER) * 9) + CURRENT_COL_NUMBER

                                moveDownEnemies(pointer)
                            } else if(pointer4[POINTER][3][1]) {
                                --pointer4[POINTER][1][0]
                                --pointer4[POINTER][3][0]

                                if(pointer4[POINTER][3][0] <= 0) pointer4[POINTER][3][1] = false

                                let pointer = (COLS_LIMIT * CURRENT_ROW_NUMBER) + CURRENT_COL_NUMBER

                                moveLeftEnemies(pointer)
                            } else if(pointer4[POINTER][4][1]) {
                                --pointer4[POINTER][1][0]
                                --pointer4[POINTER][4][0]

                                if(pointer4[POINTER][4][0] <= 0) pointer4[POINTER][4][1] = false

                                let pointer = ((ROWS_LIMIT - 1 - CURRENT_ROW_NUMBER) * 9) + CURRENT_COL_NUMBER

                                moveDownEnemies(pointer)
                            } else if(pointer4[POINTER][5][1]) {
                                --pointer4[POINTER][1][0]
                                --pointer4[POINTER][5][0]

                                if(pointer4[POINTER][5][0] <= 0) pointer4[POINTER][5][1] = false

                                let pointer = (COLS_LIMIT * CURRENT_ROW_NUMBER) + ((COLS_LIMIT - 1) - CURRENT_COL_NUMBER)

                                moveRightEnemies(pointer)
                            }

                            if(pointer4[POINTER][1][0] <= 0) pointer4[POINTER][1][1] = false
                        } else if(pointer4[POINTER][6][1]) {
                            if(pointer4[POINTER][7][1]) {
                                --pointer4[POINTER][6][0]
                                --pointer4[POINTER][7][0]

                                if(pointer4[POINTER][7][0] <= 0) {
                                    pointer4[POINTER][7][0] = 2
                                    pointer4[POINTER][7][1] = false

                                    pointer4[POINTER][8][1] = true
                                }

                                moveUpEnemies(POINTER)
                            } else if(pointer4[POINTER][8][1]) {
                                --pointer4[POINTER][6][0]
                                --pointer4[POINTER][8][0]

                                if(pointer4[POINTER][8][0] <= 0) {
                                    pointer4[POINTER][8][0] = 12
                                    pointer4[POINTER][8][1] = false

                                    pointer4[POINTER][9][1] = true
                                }

                                let pointer = (COLS_LIMIT * CURRENT_ROW_NUMBER) + CURRENT_COL_NUMBER

                                moveLeftEnemies(pointer)
                            } else if(pointer4[POINTER][9][1]) {
                                --pointer4[POINTER][6][0]
                                --pointer4[POINTER][9][0]

                                if(pointer4[POINTER][9][0] <= 0) {
                                    pointer4[POINTER][9][0] = 2
                                    pointer4[POINTER][9][1] = false

                                    pointer4[POINTER][10][1] = true
                                }

                                moveUpEnemies(POINTER)
                            } else if(pointer4[POINTER][10][1]) {
                                --pointer4[POINTER][6][0]
                                --pointer4[POINTER][10][0]

                                if(pointer4[POINTER][10][0] <= 0) {
                                    pointer4[POINTER][10][0] = 12

                                    pointer4[POINTER][7][1] = true
                                }

                                let pointer = (COLS_LIMIT * CURRENT_ROW_NUMBER) + ((COLS_LIMIT - 1) - CURRENT_COL_NUMBER)

                                moveRightEnemies(pointer)
                            }

                            if(pointer4[POINTER][6][0] <= 0) {
                                pointer4[POINTER][6][0] = 56
                                pointer4[POINTER][6][1] = false
                            }
                        } else if(pointer4[POINTER][11][1]) {
                            if(pointer4[POINTER][12][1]) {
                                --pointer4[POINTER][11][0]
                                --pointer4[POINTER][12][0]

                                if(pointer4[POINTER][12][0] <= 0) {
                                    pointer4[POINTER][12][0] = 2
                                    pointer4[POINTER][12][1] = false

                                    pointer4[POINTER][13][1] = true
                                }

                                let pointer = ((ROWS_LIMIT - 1 - CURRENT_ROW_NUMBER) * 9) + CURRENT_COL_NUMBER

                                moveDownEnemies(pointer)
                            } else if(pointer4[POINTER][13][1]) {
                                --pointer4[POINTER][11][0]
                                --pointer4[POINTER][13][0]

                                if(pointer4[POINTER][13][0] <= 0) {
                                    pointer4[POINTER][13][0] = 12
                                    pointer4[POINTER][13][1] = false

                                    pointer4[POINTER][14][1] = true
                                }

                                let pointer = (COLS_LIMIT * CURRENT_ROW_NUMBER) + CURRENT_COL_NUMBER

                                moveLeftEnemies(pointer)
                            } else if(pointer4[POINTER][14][1]) {
                                --pointer4[POINTER][11][0]
                                --pointer4[POINTER][14][0]

                                if(pointer4[POINTER][14][0] <= 0) {
                                    pointer4[POINTER][14][0] = 2
                                    pointer4[POINTER][14][1] = false

                                    pointer4[POINTER][15][1] = true
                                }

                                let pointer = ((ROWS_LIMIT - 1 - CURRENT_ROW_NUMBER) * 9) + CURRENT_COL_NUMBER

                                moveDownEnemies(pointer)
                            } else if(pointer4[POINTER][15][1]) {
                                --pointer4[POINTER][11][0]
                                --pointer4[POINTER][15][0]

                                if(pointer4[POINTER][15][0] <= 0) {
                                    pointer4[POINTER][15][0] = 12

                                    pointer4[POINTER][12][1] = true
                                }

                                let pointer = (COLS_LIMIT * CURRENT_ROW_NUMBER) + ((COLS_LIMIT - 1) - CURRENT_COL_NUMBER)

                                moveRightEnemies(pointer)
                            }

                            if(pointer4[POINTER][11][0] <= 0) {
                                pointer4[POINTER][11][0] = 56

                                pointer4[POINTER][6][1] = true
                            }
                        }
                    }
                })(), 500))

                PAINTER.drawImage(enemies[pointer].getCurrentImage(), x, y)

                moveEnemies2[pointer]

                x += enemies[pointer].getWidth()
            }

            x = (CANVAS_WIDTH - (parseInt(ENEMY_IMAGES.eq(0).attr('width')) * colsLimit)) / 2
            y += enemies[pointer].getHeight()
        }

        enemies.forEach(function(enemy, index) {
            framesEnemies.push($interval((function() {
                const POINTER = index

                let enemyBulletPointer = framesEnemiesBullets[POINTER].length,
                    x = 0

                return function() {
                    if(isGamePause) return

                    ++x

                    if(x >= ENEMY_IMAGES.length) {
                        x = 0
                    }

                    enemies[POINTER].setCurrentImage(ENEMY_IMAGES[x])
                    framesEnemiesBullets[POINTER].push([])

                    if(x == 1 || x == 5 || x == 3 || x == 7) {
                        if(x == 1 || x == 5) {
                            framesEnemiesBullets[POINTER][enemyBulletPointer].push($interval((function() {
                                const CURRENT_POINTER_1 = POINTER,
                                    CURRENT_POINTER_2 = enemyBulletPointer,
                                    WIDTH = parseInt(ENEMY_BULLET_IMAGE.eq(0).attr('width')),
                                    HEIGHT = parseInt(ENEMY_BULLET_IMAGE.eq(0).attr('height')),
                                    LIMIT_1 = CANVAS_WIDTH + WIDTH,
                                    LIMIT_2 = 0 - HEIGHT

                                let isFirst = true,
                                    x = enemy.getX() + enemy.getWidth() - (WIDTH / 2),
                                    y = enemy.getY() - HEIGHT

                                return function() {
                                    if(isGamePause) return

                                    const X_INTERSECTION = [
                                            [
                                                PLAYER_2.getX(),
                                                PLAYER_2.getX() + PLAYER_2.getWidth()
                                            ],
                                            [
                                                x,
                                                x + WIDTH
                                            ],
                                        ],
                                        Y_INTERSECTION = [
                                            [
                                                PLAYER_2.getY(),
                                                PLAYER_2.getY() + PLAYER_2.getHeight()
                                            ],
                                            [
                                                y,
                                                y + HEIGHT
                                            ],
                                        ]

                                    if(x >= LIMIT_1 || y <= LIMIT_2) {
                                        $interval.cancel(framesEnemiesBullets[CURRENT_POINTER_1][CURRENT_POINTER_2][0])
                                        framesEnemiesBullets[CURRENT_POINTER_1][CURRENT_POINTER_2][0] = undefined
                                    }

                                    if(isFirst) {
                                        PAINTER.drawImage(ENEMY_BULLET_IMAGE[0], x, y)

                                        isFirst = false
                                    } else {
                                        PAINTER.clearRect(x, y, WIDTH, HEIGHT)

                                        x += 10
                                        y -= 10

                                        PAINTER.globalCompositeOperation = 'destination-over'
                                        PAINTER.drawImage(ENEMY_BULLET_IMAGE[0], x, y)
                                    }

                                    if(!PLAYER_2.isCrushed() && (Y_INTERSECTION[1][0] <= Y_INTERSECTION[0][1] && Y_INTERSECTION[1][1] >= Y_INTERSECTION[0][0]) &&
                                        (X_INTERSECTION[1][1] >= X_INTERSECTION[0][0] && X_INTERSECTION[1][0] <= X_INTERSECTION[0][1])) {
                                        PLAYER_2.subtractLive()

                                        if(PLAYER_2.getLives() <= 0) {
                                            PLAYER_2.crushed()
                                            PAINTER.clearRect(PLAYER_2.getX(), PLAYER_2.getY(), PLAYER_2.getWidth(), PLAYER_2.getHeight())

                                            $interval.cancel(framesPlayer2)
                                            framesPlayer2 = undefined

                                            ++defeatedPlayersNumber

                                            makeExplosion(PLAYER_2.getX(), PLAYER_2.getY(), PLAYER_2.getWidth(), PLAYER_2.getHeight())

                                            if(defeatedPlayersNumber === 2) {
                                                stopGame()
                                                $window.alert('Game over, please click "Back" button for go back to main menu!')
                                            }
                                        }

                                        PAINTER.clearRect(x, y, WIDTH, HEIGHT)

                                        $interval.cancel(framesEnemiesBullets[CURRENT_POINTER_1][CURRENT_POINTER_2][0])
                                        framesEnemiesBullets[CURRENT_POINTER_1][CURRENT_POINTER_2][0] = undefined
                                    }
                                }
                            })(), 50))
                            framesEnemiesBullets[POINTER][enemyBulletPointer].push($interval((function() {
                                const CURRENT_POINTER_1 = POINTER,
                                    CURRENT_POINTER_2 = enemyBulletPointer,
                                    WIDTH = parseInt(ENEMY_BULLET_IMAGE.eq(0).attr('width')),
                                    HEIGHT = parseInt(ENEMY_BULLET_IMAGE.eq(0).attr('height')),
                                    LIMIT_1 = 0 - WIDTH,
                                    LIMIT_2 = CANVAS_HEIGHT + HEIGHT

                                let isFirst = true,
                                    x = enemy.getX() - (WIDTH / 2),
                                    y = enemy.getY() + enemy.getHeight()

                                return function() {
                                    if(isGamePause) return

                                    const X_INTERSECTION = [
                                            [
                                                PLAYER_1.getX(),
                                                PLAYER_1.getX() + PLAYER_1.getWidth()
                                            ],
                                            [
                                                x,
                                                x + WIDTH
                                            ]
                                        ],
                                        Y_INTERSECTION = [
                                            [
                                                PLAYER_1.getY(),
                                                PLAYER_1.getY() + PLAYER_1.getHeight()
                                            ],
                                            [
                                                y,
                                                y + HEIGHT
                                            ],
                                        ]

                                    if(x <= LIMIT_1 || y >= LIMIT_2) {
                                        $interval.cancel(framesEnemiesBullets[CURRENT_POINTER_1][CURRENT_POINTER_2][1])
                                        framesEnemiesBullets[CURRENT_POINTER_1][CURRENT_POINTER_2][1] = undefined
                                    }

                                    if(isFirst) {
                                        PAINTER.drawImage(ENEMY_BULLET_IMAGE[0], x, y)

                                        isFirst = false
                                    } else {
                                        PAINTER.clearRect(x, y, WIDTH, HEIGHT)

                                        x -= 10
                                        y += 10

                                        PAINTER.globalCompositeOperation = 'destination-over'
                                        PAINTER.drawImage(ENEMY_BULLET_IMAGE[0], x, y)
                                    }

                                    if(!PLAYER_1.isCrushed() &&  (Y_INTERSECTION[1][1] >= Y_INTERSECTION[0][0] && Y_INTERSECTION[1][0] <= Y_INTERSECTION[0][1])  &&
                                        (X_INTERSECTION[1][1] >= X_INTERSECTION[0][0] && X_INTERSECTION[1][0] <= X_INTERSECTION[0][1])) {
                                            PLAYER_1.subtractLive()

                                            if(PLAYER_1.getLives() <= 0) {
                                                PLAYER_1.crushed()
                                                PAINTER.clearRect(PLAYER_1.getX(), PLAYER_1.getY(), PLAYER_1.getWidth(), PLAYER_1.getHeight())

                                                $interval.cancel(framesPlayer1)
                                                framesPlayer1 = undefined

                                                ++defeatedPlayersNumber

                                                makeExplosion(PLAYER_1.getX(), PLAYER_1.getY(), PLAYER_1.getWidth(), PLAYER_1.getHeight())

                                                if(defeatedPlayersNumber === 2) {
                                                    stopGame()
                                                    $window.alert('Game over, please click "Back" button for go back to main menu!')
                                                }
                                            }

                                            PAINTER.clearRect(x, y, WIDTH, HEIGHT)

                                            $interval.cancel(framesEnemiesBullets[CURRENT_POINTER_1][CURRENT_POINTER_2][1])
                                            framesEnemiesBullets[CURRENT_POINTER_1][CURRENT_POINTER_2][1] = undefined
                                    }
                                }
                            })(), 50))
                        } else if(x == 3 || x == 7) {
                            framesEnemiesBullets[POINTER][enemyBulletPointer].push($interval((function() {
                                const CURRENT_POINTER_1 = POINTER,
                                    CURRENT_POINTER_2 = enemyBulletPointer,
                                    WIDTH = parseInt(ENEMY_BULLET_IMAGE.eq(0).attr('width')),
                                    HEIGHT = parseInt(ENEMY_BULLET_IMAGE.eq(0).attr('height')),
                                    LIMIT_1 = 0 - WIDTH,
                                    LIMIT_2 = 0 - HEIGHT

                                let isFirst = true,
                                    x = enemy.getX() - (WIDTH / 2),
                                    y = enemy.getY() - HEIGHT

                                return function() {
                                    if(isGamePause) return

                                    const X_INTERSECTION = [
                                            [
                                                PLAYER_2.getX(),
                                                PLAYER_2.getX() + PLAYER_2.getWidth()
                                            ],
                                            [
                                                x,
                                                x + WIDTH
                                            ],
                                        ],
                                        Y_INTERSECTION = [
                                            [
                                                PLAYER_2.getY(),
                                                PLAYER_2.getY() + PLAYER_2.getHeight()
                                            ],
                                            [
                                                y,
                                                y + HEIGHT
                                            ],
                                        ]

                                    if(x <= LIMIT_1 || y <= LIMIT_2) {
                                        $interval.cancel(framesEnemiesBullets[CURRENT_POINTER_1][CURRENT_POINTER_2][0])
                                        framesEnemiesBullets[CURRENT_POINTER_1][CURRENT_POINTER_2][0] = undefined
                                    }

                                    if(isFirst) {
                                        PAINTER.drawImage(ENEMY_BULLET_IMAGE[0], x, y)

                                        isFirst = false
                                    } else {
                                        PAINTER.clearRect(x, y, WIDTH, HEIGHT)

                                        x -= 10
                                        y -= 10

                                        PAINTER.globalCompositeOperation = 'destination-over'
                                        PAINTER.drawImage(ENEMY_BULLET_IMAGE[0], x, y)
                                    }

                                    if(!PLAYER_2.isCrushed() && (Y_INTERSECTION[1][0] <= Y_INTERSECTION[0][1] && Y_INTERSECTION[1][1] >= Y_INTERSECTION[0][0]) &&
                                        (X_INTERSECTION[1][1] >= X_INTERSECTION[0][0] && X_INTERSECTION[1][0] <= X_INTERSECTION[0][1])) {
                                        PLAYER_2.subtractLive()

                                        if(PLAYER_2.getLives() <= 0) {
                                            PLAYER_2.crushed()
                                            PAINTER.clearRect(PLAYER_2.getX(), PLAYER_2.getY(), PLAYER_2.getWidth(), PLAYER_2.getHeight())

                                            $interval.cancel(framesPlayer2)
                                            framesPlayer2 = undefined

                                            ++defeatedPlayersNumber

                                            makeExplosion(PLAYER_2.getX(), PLAYER_2.getY(), PLAYER_2.getWidth(), PLAYER_2.getHeight())

                                            if(defeatedPlayersNumber === 2) {
                                                stopGame()
                                                $window.alert('Game over, please click "Back" button for go back to main menu!')
                                            }
                                        }

                                        PAINTER.clearRect(x, y, WIDTH, HEIGHT)

                                        $interval.cancel(framesEnemiesBullets[CURRENT_POINTER_1][CURRENT_POINTER_2][0])
                                        framesEnemiesBullets[CURRENT_POINTER_1][CURRENT_POINTER_2][0] = undefined
                                    }
                                }
                            })(), 50))
                            framesEnemiesBullets[POINTER][enemyBulletPointer].push($interval((function() {
                                const CURRENT_POINTER_1 = POINTER,
                                    CURRENT_POINTER_2 = enemyBulletPointer,
                                    WIDTH = parseInt(ENEMY_BULLET_IMAGE.eq(0).attr('width')),
                                    HEIGHT = parseInt(ENEMY_BULLET_IMAGE.eq(0).attr('height')),
                                    LIMIT_1 = CANVAS_WIDTH + 10,
                                    LIMIT_2 = CANVAS_HEIGHT + 10

                                let isFirst = true,
                                    x = enemy.getX() + enemy.getWidth() - (WIDTH / 2),
                                    y = enemy.getY() + enemy.getHeight()

                                return function() {
                                    if(isGamePause) return

                                    const X_INTERSECTION = [
                                            [
                                                PLAYER_1.getX(),
                                                PLAYER_1.getX() + PLAYER_1.getWidth()
                                            ],
                                            [
                                                x,
                                                x + WIDTH
                                            ]
                                        ],
                                        Y_INTERSECTION = [
                                            [
                                                PLAYER_1.getY(),
                                                PLAYER_1.getY() + PLAYER_1.getHeight()
                                            ],
                                            [
                                                y,
                                                y + HEIGHT
                                            ],
                                        ]

                                    if(x >= LIMIT_1 || y >= LIMIT_2) {
                                        $interval.cancel(framesEnemiesBullets[CURRENT_POINTER_1][CURRENT_POINTER_2][1])
                                        framesEnemiesBullets[CURRENT_POINTER_1][CURRENT_POINTER_2][1] = undefined
                                    }

                                    if(isFirst) {
                                        PAINTER.drawImage(ENEMY_BULLET_IMAGE[0], x, y)

                                        isFirst = false
                                    } else {
                                        PAINTER.clearRect(x, y, WIDTH, HEIGHT)

                                        x += 10
                                        y += 10

                                        PAINTER.drawImage(ENEMY_BULLET_IMAGE[0], x, y)
                                    }

                                    if(!PLAYER_1.isCrushed() &&  (Y_INTERSECTION[1][1] >= Y_INTERSECTION[0][0] && Y_INTERSECTION[1][0] <= Y_INTERSECTION[0][1])  &&
                                        (X_INTERSECTION[1][1] >= X_INTERSECTION[0][0] && X_INTERSECTION[1][0] <= X_INTERSECTION[0][1])) {
                                            PLAYER_1.subtractLive()

                                            if(PLAYER_1.getLives() <= 0) {
                                                PLAYER_1.crushed()
                                                PAINTER.clearRect(PLAYER_1.getX(), PLAYER_1.getY(), PLAYER_1.getWidth(), PLAYER_1.getHeight())

                                                $interval.cancel(framesPlayer1)
                                                framesPlayer1 = undefined

                                                ++defeatedPlayersNumber

                                                makeExplosion(PLAYER_1.getX(), PLAYER_1.getY(), PLAYER_1.getWidth(), PLAYER_1.getHeight())

                                                if(defeatedPlayersNumber === 2) {
                                                    stopGame()
                                                    $window.alert('Game over, please click "Back" button for go back to main menu!')
                                                }
                                            }

                                            PAINTER.clearRect(x, y, WIDTH, HEIGHT)

                                            $interval.cancel(framesEnemiesBullets[CURRENT_POINTER_1][CURRENT_POINTER_2][1])
                                            framesEnemiesBullets[CURRENT_POINTER_1][CURRENT_POINTER_2][1] = undefined
                                    }
                                }
                            })(), 50))
                        }

                        framesEnemiesBullets[POINTER][enemyBulletPointer][0]
                        framesEnemiesBullets[POINTER][enemyBulletPointer][1]

                        ++enemyBulletPointer
                    }
                }
            })(), 3000))
        })
    }

    $scope.prepareGame = function() {
        $window.scrollTo(0, 22)

        player1Delay = DELAY_TIME
        player2Delay = DELAY_TIME

        if(angular.isDefined(moveEnemies2[0])) return

        moveEnemies1()

        PAINTER.drawImage(PLAYER_2.getCurrentImage(), PLAYER_2.getX(), PLAYER_2.getY())
        PAINTER.drawImage(PLAYER_1.getCurrentImage(), PLAYER_1.getX(), PLAYER_1.getY())

        changeFramePlayer1()
        changeFramePlayer2()

        PLAYER_1.startGame()
        PLAYER_2.startGame()

        PLAYERS_CONTROLLER.focus()

        SOUNDTRACK_1[0].play()
        startCountdown()
    }

    $scope.activatePlayersController = function() {
        if(!PLAYERS_CONTROLLER.eq(0).is(':focus')) {
            PLAYERS_CONTROLLER.focus()
        }
    }

    function changeFramePlayer1() {
        if(angular.isDefined(framesPlayer1)) return

        framesPlayer1 = $interval(function() {
            if(isGamePause) return

            ++pointer1

            if(pointer1 >= FRAMES_LIMIT_1) {
                pointer1 = 0
            }

            PLAYER_1.setCurrentImage(PLAYER_1_IMAGES[pointer1])

            PAINTER.clearRect(PLAYER_1.getX(), PLAYER_1.getY(), PLAYER_1.getWidth(), PLAYER_1.getHeight())
            PAINTER.drawImage(PLAYER_1.getCurrentImage(), PLAYER_1.getX(), PLAYER_1.getY())
        }, 1000)
    }

    function changeFramePlayer2() {
        if(angular.isDefined(framesPlayer2)) return

        framesPlayer2 = $interval(function() {
            if(isGamePause) return

            ++pointer2

            if(pointer2 >= FRAMES_LIMIT_2) {
                pointer2 = 0
            }

            PLAYER_2.setCurrentImage(PLAYER_2_IMAGES[pointer2])

            PAINTER.clearRect(PLAYER_2.getX(), PLAYER_2.getY(), PLAYER_2.getWidth(), PLAYER_2.getHeight())
            PAINTER.drawImage(PLAYER_2.getCurrentImage(), PLAYER_2.getX(), PLAYER_2.getY())
        }, 1000)
    }

    function player1Shot() {
        let audio = new Audio('./../assets/audio/lazer-shot.mp3'),
            moveBulletsPlayer1 = function() {},
            player1Bullets = [],
            pointer = 0

        if(player1Delay !== DELAY_TIME) return

        PLAYER_1.addBullets()

        player1Bullets = PLAYER_1.getBullets()
        pointer = player1Bullets.length - 1

        PAINTER.drawImage(PLAYER_1_BULLETS_IMAGE[0], player1Bullets[pointer].x, player1Bullets[pointer].y)

        moveBulletsPlayer1 = (function() {
            let currentPointer = pointer,
                height = player1Bullets[currentPointer].height,
                width = player1Bullets[currentPointer].width,
                x = player1Bullets[currentPointer].x,
                y = player1Bullets[currentPointer].y

            return function() {
                let player2 = {
                        height: PLAYER_2.getHeight(),
                        width: PLAYER_2.getWidth(),
                        x: PLAYER_2.getX(),
                        y: PLAYER_2.getY()
                    },
                    xIntersection = [
                        [
                            player2.x,
                            player2.x + player2.width
                        ],
                        [
                            x + 10,
                            x + width - 10
                        ]
                    ]

                PAINTER.clearRect(x, y, width, height)
                PLAYER_1.setBulletsYCord(currentPointer, y)

                y -= PLAYER_1_BULLETS.getHeight()

                PAINTER.drawImage(PLAYER_1_BULLETS_IMAGE[0], x, y)

                if(!PLAYER_2.isCrushed() && (y - 6) <= (player2.y + player2.height) &&
                    (xIntersection[1][1] >= xIntersection[0][0] && xIntersection[1][0] <= xIntersection[0][1])) {
                        PLAYER_2.subtractLive()

                        $scope.player2Lives = PLAYER_2.getLives()

                        if(PLAYER_2.getLives() <= 0) {
                            PLAYER_2.crushed()

                            PLAYER_1.bulletsCrushed(currentPointer)

                            PAINTER.clearRect(PLAYER_2.getX(), PLAYER_2.getY(), PLAYER_2.getWidth(), PLAYER_2.getHeight())

                            $interval.cancel(framesPlayer2)
                            framesPlayer2 = undefined

                            PLAYER_1.add2Points()

                            makeExplosion(PLAYER_2.getX(), PLAYER_2.getY(), PLAYER_2.getWidth(), PLAYER_2.getHeight())

                            stopGame()
                            $window.alert('Game over, please click "Back" button for go back to main menu!')
                        }

                        PAINTER.clearRect(x, y, width, height)

                        player1Delay = DELAY_TIME

                        $interval.cancel(framesPlayer1Bullets[currentPointer])
                        framesPlayer1Bullets[currentPointer] = undefined
                    }

                enemies.forEach(function(enemy, index) {
                    let xIntersection = [
                        [
                            enemy.getX(),
                            enemy.getX() + enemy.getWidth()
                        ],
                        [
                            enemy.getY(),
                            enemy.getY() + enemy.getHeight()
                        ],
                        [
                            x + 10,
                            x + width - 10
                        ],
                        [
                            y,
                            y + height
                        ]
                    ]

                    if(!enemy.isCrushed()) {
                        let isCrushed = false

                        if(y <= (enemy.getY() + enemy.getHeight()) && (xIntersection[2][1] >= xIntersection[0][0] && xIntersection[2][0] <= xIntersection[0][1])) {
                            isCrushed = true
                        }

                        if(isCrushed) {
                            enemy.crushed()

                            PLAYER_1.bulletsCrushed(currentPointer)

                            PAINTER.clearRect(enemy.getX(), enemy.getY(), enemy.getWidth(), enemy.getHeight())

                            $interval.cancel(framesEnemies[index])
                            framesEnemies[index] = undefined

                            PAINTER.clearRect(x, y, width, height)

                            player1Delay = DELAY_TIME

                            $interval.cancel(framesPlayer1Bullets[currentPointer])
                            framesPlayer1Bullets[currentPointer] = undefined

                            PLAYER_1.add1Point()

                            ++defeatedEnemiesNumber

                            makeExplosion(enemy.getX(), enemy.getY(), enemy.getWidth(), enemy.getHeight())

                            if(defeatedEnemiesNumber === enemies.length) {
                                stopGame()
                                $window.alert('All enemies are defeated, please click "Back" button for go back to main menu!')
                            }
                        }
                    }
                })

                if(y <= -(PLAYER_1_BULLETS.getHeight() + 10)) {
                    $interval.cancel(framesPlayer1Bullets[currentPointer])
                    framesPlayer1Bullets[currentPointer] = undefined
                }
            }
        })()

        framesPlayer1Bullets.push($interval(function() {
            if(isGamePause) return

            player1Delay -= 20

            if(player1Delay <= 0) {
                player1Delay = DELAY_TIME
            }

            moveBulletsPlayer1()
        }, 20))

        framesPlayer1Bullets[pointer]

        audio.play()
    }

    function player2Shot() {
        let audio = new Audio('./../assets/audio/lazer-shot.mp3'),
            moveBulletsPlayer2 = function() {},
            pointer = 0,
            player2Bullets = []

        if(player2Delay !== DELAY_TIME) return

        PLAYER_2.addBullets()

        player2Bullets = PLAYER_2.getBullets()
        pointer = player2Bullets.length - 1

        PAINTER.drawImage(PLAYER_2_BULLETS_IMAGE[0], player2Bullets[pointer].x, player2Bullets[pointer].y)

        moveBulletsPlayer2 = (function() {
            let currentPointer = pointer,
                height = player2Bullets[currentPointer].height,
                width = player2Bullets[currentPointer].width,
                x = player2Bullets[currentPointer].x,
                y = player2Bullets[currentPointer].y

            return function() {
                let player1 = {
                        height: PLAYER_1.getHeight(),
                        width: PLAYER_1.getWidth(),
                        x: PLAYER_1.getX(),
                        y: PLAYER_1.getY()
                    },
                    xIntersection = [
                        [
                            player1.x,
                            player1.x + player1.width
                        ],
                        [
                            x + 10,
                            x + width - 10
                        ]
                    ]

                PAINTER.clearRect(x, y, width, height)

                y += PLAYER_2_BULLETS.getHeight()

                PLAYER_2.setBulletsYCord(currentPointer, y)
                PAINTER.drawImage(PLAYER_2_BULLETS_IMAGE[0], x, y)

                if(!PLAYER_1.isCrushed() && (y + 6) >= player1.y &&
                    (xIntersection[1][1] >= xIntersection[0][0] && xIntersection[1][0] <= xIntersection[0][1])) {
                        PLAYER_1.subtractLive()

                        $scope.player1Lives = PLAYER_1.getLives()

                        if(PLAYER_1.getLives() <= 0) {
                            PLAYER_1.crushed()

                            PLAYER_2.bulletsCrushed(currentPointer)

                            PAINTER.clearRect(PLAYER_1.getX(), PLAYER_1.getY(), PLAYER_1.getWidth(), PLAYER_1.getHeight())

                            $interval.cancel(framesPlayer1)
                            framesPlayer1 = undefined

                            PLAYER_2.add2Points()

                            makeExplosion(PLAYER_1.getX(), PLAYER_1.getY(), PLAYER_1.getWidth(), PLAYER_1.getHeight())

                            stopGame()
                            $window.alert('Game over, please click "Back" button for go back to main menu!')
                        }

                        PAINTER.clearRect(x, y, width, height)

                        player2Delay = DELAY_TIME

                        $interval.cancel(framesPlayer2Bullets[currentPointer])
                        framesPlayer2Bullets[currentPointer] = undefined
                }

                enemies.forEach(function(enemy, index) {
                    let xIntersection = [
                        [
                            enemy.getX(),
                            enemy.getX() + enemy.getWidth()
                        ],
                        [
                            enemy.getY(),
                            enemy.getY() + enemy.getHeight()
                        ],
                        [
                            x + 10,
                            x + width - 10
                        ],
                        [
                            y,
                            y + height
                        ]
                    ]

                    if(!enemy.isCrushed()) {
                        let isCrushed = false

                        if(y >= enemy.getY() && (xIntersection[2][1] >= xIntersection[0][0] && xIntersection[2][0] <= xIntersection[0][1])) {
                            isCrushed = true
                        }

                        if(isCrushed) {
                            enemy.crushed()

                            PLAYER_2.bulletsCrushed(currentPointer)

                            PAINTER.clearRect(enemy.getX(), enemy.getY(), enemy.getWidth(), enemy.getHeight())

                            $interval.cancel(framesEnemies[index])
                            framesEnemies[index] = undefined

                            PAINTER.clearRect(x, y, width, height)

                            player2Delay = DELAY_TIME

                            $interval.cancel(framesPlayer2Bullets[currentPointer])
                            framesPlayer2Bullets[currentPointer] = undefined

                            PLAYER_2.add1Point()

                            ++defeatedEnemiesNumber

                            makeExplosion(enemy.getX(), enemy.getY(), enemy.getWidth(), enemy.getHeight())

                            if(defeatedEnemiesNumber === enemies.length) {
                                stopGame()
                                $window.alert('All enemies are defeated, please click "Back" button for go back to main menu!')
                            }
                        }
                    }
                })

                if(y >= (CANVAS_HEIGHT + PLAYER_2_BULLETS.getHeight())) {
                    $interval.cancel(framesPlayer2Bullets[currentPointer])
                    framesPlayer2Bullets[currentPointer] = undefined
                }
            }
        })()

        framesPlayer2Bullets.push($interval(function() {
            if(isGamePause) return

            player2Delay -= 20

            if(player2Delay <= 0) {
                player2Delay = DELAY_TIME
            }

            moveBulletsPlayer2()
        }, 20))

        framesPlayer2Bullets[pointer]

        audio.play()
    }

    function startCountdown() {
        if(angular.isDefined(countdown)) return

        countdown = $interval(function() {
            if(isGamePause) return

            --$scope.time
            ++pointer5

            if(pointer5 >= CLOCK_IMAGES.length) {
                pointer5 = 0
            }

            TIMER_CLOCK.eq(0).attr('src', CLOCK_IMAGES.eq(pointer5).attr('src'))

            if($scope.time <= 0) {
                $interval.cancel(countdown)
                countdown = undefined

                stopGame()
                $window.alert('Time\'s up, please click "Back" button for go back to main menu!')
            }
        }, 1000)
    }

    function makeExplosion(x, y, width, height) {
        const INDEX = framesExplosion.length

        let explosion = new Audio('./../assets/audio/explosion.mp3')

        framesExplosion.push($interval((function() {
            const CURRENT_INDEX = INDEX,
                IMAGES = {
                    x: x,
                    y: y,
                    pointer: 0,
                    width: width,
                    height: height
                }

            return function() {
                PAINTER.clearRect(IMAGES.x, IMAGES.y, IMAGES.width, IMAGES.height)
                PAINTER.drawImage(EXPLOSION_IMAGES[IMAGES.pointer], IMAGES.x, IMAGES.y)

                ++IMAGES.pointer

                if(IMAGES.pointer >= EXPLOSION_IMAGES.length) {
                    PAINTER.clearRect(IMAGES.x, IMAGES.y, IMAGES.width, IMAGES.height)

                    $interval.cancel(framesExplosion[CURRENT_INDEX])
                    framesExplosion[CURRENT_INDEX] = undefined
                }
            }
        })(), 100))

        framesExplosion[INDEX]

        explosion.play()
    }

    $scope.toggleGameState = function() {
        if(!isGameStop) {
            if(isGamePause) {
                startGame()

                PLAYERS_CONTROLLER.focus()
            } else {
                pauseGame()
            }
        } else {
            location.reload()
        }
    }

    $scope.askToStartGame = function() {
        $window.alert('Please click "Start" button to start the game!')
    }

    $scope.goToFullscreen = function() {
        $document[0].body.requestFullscreen()
    }

    function pauseGame() {
        if(isGameStop) return

        $scope.action = 'Start'
        isGamePause = true
        SOUNDTRACK_1[0].pause()
    }

    function startGame() {
        if(isGameStop) return

        if(firstClick) {
            $document[0].body.requestFullscreen()
            $scope.prepareGame()

            firstClick = false
        }

        $scope.action = 'Pause'
        isGamePause = false
        SOUNDTRACK_1[0].play()
    }

    function stopGame() {
        let records = undefined,
            record = {
                date: DATE.toLocaleDateString(),
                time: DATE.toLocaleTimeString(),
                player1: {
                    name: localStorage.getItem('player1Name'),
                    lives: PLAYER_1.getLives(),
                    points: PLAYER_1.getPoints()
                },
                player2: {
                    name: localStorage.getItem('player2Name'),
                    lives: PLAYER_2.getLives(),
                    points: PLAYER_2.getPoints()
                }
            }

        SOUNDTRACK_1[0].pause()
        GAME_OVER[0].play()

        pauseGame()

        $interval.cancel(countdown)
        countdown = undefined

        $scope.action = 'Retry'

        isGameStop = true

        if(localStorage.getItem('records')) {
            records = JSON.parse(localStorage.getItem('records'))
            records.push(record)
        } else {
            records = []
            records.push(record)
        }

        localStorage.setItem('records', JSON.stringify(records))
    }

    $scope.goToStartMenu = function() {
        location.assign('./../index.min.html')
    }

    $scope.movePlayers = function(event) {
        $scope.playersController = ''

        if(isGamePause) return

        let command = event.keyCode || event.which,
            x1 = PLAYER_2.getX() - 36,
            x2 = PLAYER_2.getX() + 36,
            x3 = PLAYER_1.getX() - 36,
            x4 = PLAYER_1.getX() + 36,
            limit1 = CANVAS_WIDTH - PLAYER_2.getWidth(),
            limit2 = CANVAS_WIDTH - PLAYER_1.getWidth()

        if(PLAYER_2.getLives() > 0) {
            switch(command) {
                case 37:
                    if(x1 >= 0) {
                        PAINTER.clearRect(PLAYER_2.getX(), PLAYER_2.getY(), PLAYER_2.getWidth(), PLAYER_2.getHeight())

                        PLAYER_2.setX(x1);

                        PAINTER.drawImage(PLAYER_2.getCurrentImage(), PLAYER_2.getX(), PLAYER_2.getY())
                    }
                    break
                case 39:
                    if(x2 <= limit1) {
                        PAINTER.clearRect(PLAYER_2.getX(), PLAYER_2.getY(), PLAYER_2.getWidth(), PLAYER_2.getHeight())

                        PLAYER_2.setX(x2)

                        PAINTER.drawImage(PLAYER_2.getCurrentImage(), PLAYER_2.getX(), PLAYER_2.getY())
                    }
                    break;
                case 38:
                    player2Shot()
                    break
            }
        }

        if(PLAYER_1.getLives() > 0) {
            switch(command) {
                case 65:
                    if(x3 >= 0) {
                        PAINTER.clearRect(PLAYER_1.getX(), PLAYER_1.getY(), PLAYER_1.getWidth(), PLAYER_1.getHeight())

                        PLAYER_1.setX(x3)

                        PAINTER.drawImage(PLAYER_1.getCurrentImage(), PLAYER_1.getX(), PLAYER_1.getY())
                    }
                    break
                case 68:
                    if(x4 <= limit2) {
                        PAINTER.clearRect(PLAYER_1.getX(), PLAYER_1.getY(), PLAYER_1.getWidth(), PLAYER_1.getHeight())

                        PLAYER_1.setX(x4)

                        PAINTER.drawImage(PLAYER_1.getCurrentImage(), PLAYER_1.getX(), PLAYER_1.getY())
                    }
                    break
                case 87:
                    player1Shot()
                    break
            }
        }
    }
});
