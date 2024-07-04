/**
 * Copyright (C) Zero IT Solutions - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential. Dissemination of this information or reproduction 
 * of this material is strictly forbidden unless prior written permission is obtained
 * from Zero IT Solutions.
 
 * 
 * Written By  : Diksha Jaswal <dikshaj.zeroit@gmail.com>, May 2022
 * Description :
 * Modified By :
 */

const q = require('q'),
    { v4 } = require('uuid'),
    helper = require('../helpers/index'),
    mongoHelper = require('../helpers/mongo_helper');

const homeModel = {};

/**
 * This function is using to buy key
 * @param     :
 * @returns   :
 * @developer : 
*/
homeModel.insertData = async function (obj) {

    let deferred = q.defer();

    if (obj) {

        let utcDate = await helper.getUtcTime();
        let id = v4(Date.now());
        let insertObj = {
            cu_uuid: id,
            cu_first_name: obj.firstName,
            cu_last_name: obj.lastName,
            cu_email: obj.email,
            cu_message: obj.message,
            cu_created_at: utcDate,
            cu_updated_at: utcDate
        };

        let result = await mongoHelper.insert(insertObj, 'contact_us');

        if (result) {

            deferred.resolve(true);

        } else {
            deferred.resolve(false);
        }

    } else {
        deferred.resolve(false);
    }

    return deferred.promise;

}

module.exports = homeModel;