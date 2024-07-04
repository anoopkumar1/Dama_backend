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
 * get last message
 */
mongoObj.getLastMessage = async (dataObj, tableName) => {
  try {
    if (!dataObj || !tableName) {
      throw new Error("Missing data object or table name");
    }

    const client = await MongoClient.connect(url, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    const database = client.db(dbName);
    const collection = database.collection(tableName);

    const result = await collection
      .find(dataObj)
      .sort({ createdAt: -1 })
      .limit(1)
      .toArray();

    client.close();

    return result.length > 0 ? result[0] : null;
  } catch (error) {
    console.error("Error in getLastMessage:", error);
    throw error;
  }
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
    MongoClient.connect(
      url,
      { useNewUrlParser: true, useUnifiedTopology: true },
      function (err, client) {
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
      }
    );
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

/**
 * This function is used to get CHAT data from Mongo tables.
 * @param       :
 * @returns     :
 * @developer   :
 * @ModifiedBy  :
 */
mongoObj.getUsersConversationDetails = async function (dataObj, tableName) {
  let deferred = q.defer();

  if (dataObj && tableName) {
    MongoClient.connect(url, options, function (err, db) {
      if (err) {
        deferred.resolve(false);
      } else {
        let database = db.db(dbName),
          mysort = { _id: 1 },
          sortBy = "",
          sortOrder = "",
          lastId = "",
          queryObj = "",
          recordsPerPage = 100,
          page = 0,
          query = {};

        if (dataObj.per_page) {
          recordsPerPage = dataObj.per_page;
        }

        if (dataObj.page) {
          page = dataObj.page;
        }

        if (dataObj.sortBy) {
          sortBy = dataObj.sortBy;
        }

        if (dataObj.sortOrder) {
          sortOrder = dataObj.sortOrder;
        }

        if (dataObj.last) {
          lastId = dataObj.last;
        }

        if (lastId) {
          query._id = { $lte: lastId };
        }

        if (sortBy == "_id") {
          if (sortOrder == "ASC") {
            mysort = { _id: 1 };
          }
        }

        let offset = page * recordsPerPage;

        database
          .collection(tableName)
          .find(dataObj)
          .sort(mysort)
          .toArray(function (err, result) {
            database
              .collection(tableName)
              .find(dataObj)
              .sort(mysort)
              .skip(offset)
              .limit(Number(recordsPerPage))
              .toArray(function (err, res) {
                if (err) {
                  deferred.resolve([]);
                }

                if (res) {
                  if (dataObj.last && dataObj.last != "") {
                    database
                      .collection(tableName)
                      .find(dataObj)
                      .sort(mysort)
                      .toArray(function (err, result1) {
                        let obj = {
                          data: res,
                          more_records: result1.length,
                          total_records: result.length,
                          last: result[0]["_id"],
                        };
                        deferred.resolve(obj);
                      });
                  } else {
                    let id = "";

                    if (res != "") {
                      id = res[0]["_id"];
                    }

                    let obj = {
                      data: res,
                      more_records: 0,
                      total_records: result.length,
                      last: id,
                    };
                    deferred.resolve(obj);
                  }

                  db.close();
                }
              });
          });
      }
    });
  }
  return deferred.promise;
};

module.exports = mongoObj;
