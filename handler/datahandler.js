const connection = require('../database/sql');

class handler {
    game (data) {
        return new Promise(async (resolve, reject) => {
            try {
                var gameData = data.gameData;
                if (gameData.length != 0) {
                    gameData.forEach(async element => {
                        // console.log(element.userId);
                        var sql = "SELECT * FROM user WHERE `userId`= '" + element.userId + "'";
                        connection.query(sql, function (error, rows, fields) {
                            if (error) {
                                console.log(error);
                            } else {
                                if (rows == '') {
                                    resolve (false);
                                } else {
                                    var sql1 = "UPDATE user SET ?  WHERE `userId`= '" + element.userId + "'";
                                    let finalpointData = {
                                        userId: element.userId,
                                        point: rows[0].point - element.point
                                    }
                                    connection.query(sql1, finalpointData, function (error, rows, fields) {
                                        if (error) {
                                            console.log('>>>>>', error);
                                        } else {
                                            // if (element.type == 1) {
                                            //     var sql3 = "SELECT * FROM single WHERE `singleId`= '" + element.psId + "'";
                                            //     connection.query(sql3, function (error, rows, fields) {
                                            //         if (error) {
                                            //             console.log(error);
                                            //         } else {
                                            //             var sql1 = "UPDATE single SET ?  WHERE `singleId`= '" + element.psId + "'";
                                            //             let finalpointData = {
                                            //                 singleId: element.psId,
                                            //                 count: rows[0].count + 1
                                            //             }
                                            //             connection.query(sql1, finalpointData, function (error, rows, fields) {
                                            //                 if (error) {
                                            //                     console.log('>>>>>', error);
                                            //                 } else {
                                            //                     resolve (true);
                                            //                 }
                                            //             })
                                            //         }
                                            //     })
                                            // } else if (element.type == 2) {
                                            //     var sql4 = "SELECT * FROM pattiteen WHERE `pattiId`= '" + element.psId + "'";
                                            //     connection.query(sql4, function (error, rows, fields) {
                                            //         if (error) {
                                            //             console.log(error);
                                            //         } else {
                                            //             var sql1 = "UPDATE pattiteen SET ?  WHERE `pattiId`= '" + element.psId + "'";
                                            //             let finalpointData = {
                                            //                 pattiId: element.psId,
                                            //                 count: rows[0].count + 1
                                            //             }
                                            //             connection.query(sql1, finalpointData, function (error, rows, fields) {
                                            //                 if (error) {
                                            //                     console.log('>>>>>', error);
                                            //                 } else {
                                            //                     resolve (true);
                                            //                 }
                                            //             })
                                            //         }
                                            //     })
                                            // }
                                            let gameDataFromuser = {
                                                userId: element.userId,
                                                // time: element.time,
                                                type: element.type,
                                                point: element.point,
                                                combination: element.combination,
                                                pattiId: element.pattiId,
                                                gameId: element.gameId
                                            };
                                            var sql6 = "INSERT INTO gameData SET ? ";
                                            connection.query(sql6, gameDataFromuser, function (error, rows, fields) {
                                                //Get state data//
                                                if (error) {
                                                    console.log('>>>>>', error);
                                                } else {
                                                    let historyData = {
                                                        userId: element.userId,
                                                        // time: element.time,
                                                        point: element.point
                                                    };
                                                    var sql5 = "INSERT INTO historypay SET ? ";
                                                    connection.query(sql5, historyData, function (error, rows, fields) {
                                                        //Get state data//
                                                        if (error) {
                                                            console.log('>>>>>', error);
                                                        } else {
                                                            resolve (true);
                                                        }
                                                    });
                                                    // resolve (true);
                                                }
                                            });
                                        }
                                    })
                                }
                            }
                        })
                    });
                }
            } catch (error) {
                reject(error)
            }
        })
    }

    game2 (result) {
        return new Promise(async (resolve, reject) => {
            try {
                result.forEach(element => {

                    if (element.end == new Date().toUTCString()) {
                      
                        var sql2 = "UPDATE parentGamelist SET flag = 0 WHERE id ='"+ element.id + "'";
                        connection.query(sql2, function (err, result) {
                            if (err) {
                                console.log(err);
                            }
                            else {
                                resolve(true);
                            }
                        })
                    } else {
                        resolve(false);
                    }
                });
            }
            catch (error) {
                reject(error)
            }
        })
}

}


module.exports = new handler();