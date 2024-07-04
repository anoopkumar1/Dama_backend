/**
 * Copyright (C) Cloudcapstone - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential. Dissemination of this information or reproduction 
 * of this material is strictly forbidden unless prior written permission is obtained
 * from Cloudcapstone.
 *     ________
 *    /  _____/
 *   |  |        _        ___              ___      ____     __      _____    _____   _______     _     _   _   _____
 *   |  |       | |     /  _  \  | |  | | |  _ \   / ___|   /   \   |  _  |   \  __| |__   __|  / _ \  | \ | | | |---|
 *   |  |____   | |__  |  |_|  | | |__| | | |_| | | |___   / /_\ \  | |_| |  __\ \      | |    | |_| | |  \| | | |==
 *    \_______\ |____|  \ ___ /   \____/  |__  /   \ ___| / /---\ \ | |     |_____\     | |     \___/  |_|\__| |____| 
 * 
 * Written By  : Vipin Sharma <vatshal01@gmail.com>, July 2019
 * Description :
 * Modified By :
 */
module.exports.allowHeaders = function (req, res, next) {
    // CORS headers
    res.header("Access-Control-Allow-Origin", "*"); // restrict it to the required domain
    res.header('Access-Control-Allow-Methods', 'GET, PUT, POST, DELETE, OPTIONS');
    // Set custom headers for CORS
    res.header('Access-Control-Allow-Headers', 'Content-type,Accept,X-Access-Token,X-Key,Authorization');

    if (req.method == 'OPTIONS') {
        res.status(200).end();
    } else {
        next();
    }
};




