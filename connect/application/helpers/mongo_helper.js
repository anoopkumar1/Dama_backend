/**
 * Copyright (C) Zero IT Solutions - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential. Dissemination of this information or reproduction 
 * of this material is strictly forbidden unless prior written permission is obtained
 * from Zero IT Solutions.
 
 * 
 * Written By  : Anoop Kumar <anoop.zeroit@gmail.com>, june 2024
 * Description :
 * Modified By :
 */

const MongoClient = require("mongodb").MongoClient,
  mongoConfig = require("../../../common/config/mongo_config"),
  q = require("q");

let mongoObj = {},
  dbName = mongoConfig.dbName,
  url = mongoConfig.url;

let options = {
  keepAlive: true,
};



/**
 * This function
 * @param        :
 * @returns      :
 * @developer    :
 * @modification :
 */

mongoObj.insert = async function (dataObj, tableName) {
  let deferred = q.defer();

  if (dataObj && tableName) {
    MongoClient.connect(url, options, function (err, db) {
      if (err) {
        deferred.resolve(false);
      } else {
        let database = db.db(dbName);

        database.collection(tableName).insertOne(dataObj, function (err, res) {

          if (err) {
            deferred.resolve(false);
          }

          if (res) {
            db.close();
            deferred.resolve(true);
          }
        });
      }
    });
  }

  return deferred.promise;
};


/**
* This function is used to get data from Mongo tables.
* @param       :
* @returns     :
* @developer   :
* @ModifiedBy  :
*/
mongoObj.getData = async (dataObj, tableName) => {
  let deferred = q.defer();

  if (dataObj && tableName) {
    MongoClient.connect(url, options, function (err, db) {
      if (err) {
        deferred.resolve([]);
      } else {
        let database = db.db(dbName);

        database
          .collection(tableName)
          .find(dataObj)
          .toArray(function (err, res) {
            if (err) {
              deferred.resolve([]);
            }

            if (res) {
              db.close();
              deferred.resolve(res);
            } else {
              deferred.resolve([]);
            }
          });
      }
    });
  } else {
    deferred.resolve([]);
  }

  return deferred.promise;
};

/**
 * This function is using to
 * @param       :
 * @returns     :
 * @developer   :
 * @ModifiedBy  :
 */
mongoObj.deleteData = async function (dataObj, tableName) {
  let deferred = q.defer();

  if (dataObj && tableName) {
    MongoClient.connect(url, options, function (err, db) {
      if (err) {
        deferred.resolve(false);
      }

      let database = db.db(dbName);

      database.collection(tableName).deleteOne(dataObj, function (err, res) {
        if (err) {
          deferred.resolve(false);
        }
        if (res) {
          db.close();
          deferred.resolve(res);
        }
      });
    });
  }
  return deferred.promise;
};


/**
 * This function is using to
 * @param       :
 * @returns     :
 * @developer   :
 * @ModifiedBy  :
 */
mongoObj.updateData = async function (dataObj, tableName, updateObj) {
  let deferred = q.defer();

  if (dataObj && tableName && updateObj) {
    let newvalues = { $set: updateObj };

    MongoClient.connect(url, options, function (err, db) {
      if (err) {
        deferred.resolve(false);
      }

      let database = db.db(dbName);

      database
        .collection(tableName)
        .updateOne(dataObj, newvalues, function (err, res) {
          if (err) {
            deferred.resolve(false);
          }

          if (res) {
            db.close();
            deferred.resolve(true);
          }
        });
    });
  }

  return deferred.promise;
};
/**
 * This function is using to
 * @param       :
 * @returns     :
 * @developer   :
 * @ModifiedBy  :
 */
mongoObj.deleteAllData = async function (dataObj, tableName) {
  let deferred = q.defer();

  if (dataObj && tableName) {
    MongoClient.connect(url, options, function (err, db) {
      if (err) {
        deferred.resolve(false);
      }

      let database = db.db(dbName);

      database.collection(tableName).deleteMany(dataObj, function (err, res) {
        if (err) {
          deferred.resolve(false);
        }
        if (res) {
          db.close();
          deferred.resolve(res);
        }
      });
    });
  }
  return deferred.promise;
};



module.exports = mongoObj;

