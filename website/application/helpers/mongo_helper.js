/**
 * Copyright (C) Zero IT Solutions - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential. Dissemination of this information or reproduction
 * of this material is strictly forbidden unless prior written permission is obtained
 * from Zero IT Solutions.
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
// 111

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
mongoObj.deleteAllData = async function (dataObj, tableName) {
  let deferred = q.defer();
  if (dataObj && tableName) {
    const client = new MongoClient(url);
    await client.connect();
    const db = client.db(dbName);
    const collection = db.collection(tableName);
    let result = await collection.deleteOne(dataObj);

    if (result) {
      deferred.resolve(true);
    } else {
      deferred.resolve(false);
    }
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
mongoObj.updateManyData = async function (dataObj, tableName, updateObj) {
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
        .updateMany(dataObj, newvalues, function (err, res) {
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

mongoObj.countData = function (searchObj, collectionName) {
  let deferred = q.defer();

  if (searchObj && collectionName) {
    MongoClient.connect(url, options, function (err, db) {
      if (err) {
        deferred.resolve(false);
      }

      let database = db.db(dbName);

      database
        .collection(collectionName)
        .countDocuments(searchObj, function (err, count) {
          db.close();
          if (err) {
            deferred.resolve(false);
          } else {
            deferred.resolve(count);
          }
        });
    });
  } else {
    deferred.resolve(false);
  }

  return deferred.promise;
};

mongoObj.getpaginatedData = function (searchObj, collectionName, options = {}) {
  let deferred = q.defer();

  if (searchObj && collectionName) {
    MongoClient.connect(url, { useNewUrlParser: true, useUnifiedTopology: true }, function (err, client) {
      if (err) {
        deferred.resolve(false);
        return;
      }

      let database = client.db(dbName);
      const { skip = 0, limit = 10 } = options;

      database
        .collection(collectionName)
        .find(searchObj)
        .skip(skip)
        .limit(limit)
        .toArray(function (err, data) {
          client.close();
          if (err) {
            deferred.resolve(false);
          } else {
            deferred.resolve(data);
          }
        });
    });
  } else {
    deferred.resolve(false);
  }

  return deferred.promise;
};

/**
 *
 * This function is using to get the last row of table
 * @param     :
 * @returns   :
 * @developer : Anoop kumar
 *
 */
mongoObj.getLastId = async function (dataObj, tableName) {
  let deferred = q.defer();
  if (tableName) {
    MongoClient.connect(url, options, function (err, db) {
      if (err) {
        deferred.resolve(false);
      } else {
        let database = db.db(dbName);

        database
          .collection(tableName)
          .find(dataObj)
          .sort({ $natural: -1 })
          .skip(0)
          .limit(1)
          .toArray(
            function (err, res) {
              deferred.resolve(res);
            },
            function (err) {
              deferred.resolve([]);
            }
          );

        if (err) {
          deferred.resolve(false);
        }
      }
    });
  } else {
    deferred.resolve(false);
  }

  return deferred.promise;
};

/**
 *
 * This function is using to short the news
 * @param     :
 * @returns   :
 * @developer : Anoop kumar
 *
 */

mongoObj.getDataSorted = async (query, tableName, sortCriteria) => {
  let deferred = q.defer();

  if (query && tableName && sortCriteria) {
    MongoClient.connect(url, options, function (err, db) {
      if (err) {
        deferred.resolve([]);
      } else {
        let database = db.db(dbName);

        database
          .collection(tableName)
          .find(query)
          .sort(sortCriteria)
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

module.exports = mongoObj;
