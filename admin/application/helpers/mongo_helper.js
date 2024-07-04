/**
 * Copyright (C) Zero IT Solutions - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential. Dissemination of this information or reproduction 
 * of this material is strictly forbidden unless prior written permission is obtained
 * from Zero IT Solutions.
 
 * 
 * Written By  : anoop kumar <anoop.zeroit@gmail.com>, may 2024
 * Description :
 * Modified By :
 */

const MongoClient = require("mongodb").MongoClient,
  mongoConfig = require("../../../common/config/mongo_config"),
  q = require("q");

let mongoObj = {},
  dbName = mongoConfig.dbName,
  url = mongoConfig.url;
const options = {
  keepAlive: true,
  useUnifiedTopology: true,
  useNewUrlParser: true,
};

/**
 * This func
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
mongoObj.updateDataOne = async function (filter, update, tableName) {
  let deferred = q.defer();

  if (filter && update && tableName) {
    MongoClient.connect(url, options, function (err, db) {
      if (err) {
        console.error("Error connecting to MongoDB:", err);
        deferred.resolve(false);
        return;
      }

      let database = db.db(dbName);

      database.collection(tableName).updateOne(filter, { $set: update }, function (err, res) {
        db.close();
        if (err) {
          console.error("Error updating document:", err);
          deferred.resolve(false);
          return;
        }

        console.log("Document updated successfully:", res);
        deferred.resolve(true);
      });
    });
  } else {
    console.error("Invalid parameters for updateData function");
    deferred.resolve(false);
  }

  return deferred.promise;
};

/**
 * This function is using to
 * @developer   :Anoop kumar

 */
mongoObj.getmemberListData = async function (dataObj, tableName, body) {
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
          recordsPerPage = 10,
          page = 0,
          query = {};
        if (body.perPage) {
          recordsPerPage = body.perPage;
        }

        if (body.page) {
          page = body.page;
        }

        if (body.sortBy) {
          sortBy = body.sortBy;
        }

        if (body.sortOrder) {
          sortOrder = body.sortOrder;
        }

        if (body.last) {
          lastId = body.last;
        }

        if (lastId) {
          query._id = { $lte: lastId };
        }

        if (sortBy == "au_firstname") {
          if (sortOrder == "ASC") {
            mysort = { au_firstname: 1 };
          } else {
            mysort = { au_firstname: -1 };
          }
        }
        if (sortBy == "au_created") {
          if (sortOrder == "ASC") {
            mysort = { au_created: 1 };
          } else {
            mysort = { au_created: -1 };
          }
        }

        if (body.perPage) {
          dataObj = {
            au_firstname: {
              $regex: new RegExp(".*" + body.keywords + ".*", "i"),
            },
            au_deleted: "0",
          };
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
                  if (body.last && body.last != "") {
                    database
                      .collection(tableName)
                      .find(dataObj)
                      .sort(mysort)
                      .toArray(function (err, result1) {
                        let obj = {
                          data: res,
                          more_records: result1.length,
                          total_records: result.length,
                          offset: offset,
                          per_page: recordsPerPage,
                          sortOrder: body.sortOrder,
                          page: page,
                          last: result[0]["au_uuid"],
                        };
                        deferred.resolve(obj);
                      });
                  } else {
                    let id = "";

                    if (res != "") {
                      id = res[0]["au_uuid"];
                    }

                    let obj = {
                      data: res,
                      more_records: 0,
                      per_page: recordsPerPage,
                      offset: offset,
                      total_records: result.length,
                      page: page,
                      sortOrder: body.sortOrder,
                      last: id,
                    };
                    deferred.resolve(obj, "last");
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

/**
 * This function is using to blog list
 * @param       :
 * @returns     :
 * @developer   : Sangeeta
 * @ModifiedBy  :
 */
mongoObj.getblogListData = async function (dataObj, tableName, body) {
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
          recordsPerPage = 10,
          page = 0,
          query = {};
        if (body.perPage) {
          recordsPerPage = body.perPage;
        }

        if (body.page) {
          page = body.page;
        }

        if (body.sortBy) {
          sortBy = body.sortBy;
        }

        if (body.sortOrder) {
          sortOrder = body.sortOrder;
        }

        if (body.last) {
          lastId = body.last;
        }

        if (lastId) {
          query._id = { $lte: lastId };
        }

        if (sortBy == "b_title") {
          if (sortOrder == "ASC") {
            mysort = { b_title: 1 };
          } else {
            mysort = { b_title: -1 };
          }
        }
        if (sortBy == "b_created") {
          if (sortOrder == "ASC") {
            mysort = { b_created: 1 };
          } else {
            mysort = { b_created: -1 };
          }
        }

        if (body.perPage) {
          dataObj = {
            b_title: {
              $regex: new RegExp(".*" + body.keywords + ".*", "i"),
            },
            b_deleted: "0",
          };
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
                  if (body.last && body.last != "") {
                    database
                      .collection(tableName)
                      .find(dataObj)
                      .sort(mysort)
                      .toArray(function (err, result1) {
                        let obj = {
                          data: res,
                          more_records: result1.length,
                          total_records: result.length,
                          offset: offset,
                          per_page: recordsPerPage,
                          sortOrder: body.sortOrder,
                          page: page,
                          last: result[0]["b_uuid"],
                        };
                        deferred.resolve(obj);
                      });
                  } else {
                    let id = "";

                    if (res != "") {
                      id = res[0]["b_uuid"];
                    }

                    let obj = {
                      data: res,
                      more_records: 0,
                      per_page: recordsPerPage,
                      offset: offset,
                      total_records: result.length,
                      page: page,
                      sortOrder: body.sortOrder,
                      last: id,
                    };
                    deferred.resolve(obj, "last");
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


/**
 * This function is using to blog list
 * @param       :
 * @returns     :
 * @developer   : Sangeeta
 * @ModifiedBy  :
 */
mongoObj.getresourceListData = async function (dataObj, tableName, body) {
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
          recordsPerPage = 10,
          page = 0,
          query = {};
        if (body.perPage) {
          recordsPerPage = body.perPage;
        }

        if (body.page) {
          page = body.page;
        }

        if (body.sortBy) {
          sortBy = body.sortBy;
        }

        if (body.sortOrder) {
          sortOrder = body.sortOrder;
        }

        if (body.last) {
          lastId = body.last;
        }

        if (lastId) {
          query._id = { $lte: lastId };
        }

        if (sortBy == "r_title") {
          if (sortOrder == "ASC") {
            mysort = { r_title: 1 };
          } else {
            mysort = { r_title: -1 };
          }
        }
        if (sortBy == "r_created") {
          if (sortOrder == "ASC") {
            mysort = { r_created: 1 };
          } else {
            mysort = { r_created: -1 };
          }
        }

        if (body.perPage) {
          dataObj = {
            r_title: {
              $regex: new RegExp(".*" + body.keywords + ".*", "i"),
            },
            r_deleted: "0",
          };
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
                  if (body.last && body.last != "") {
                    database
                      .collection(tableName)
                      .find(dataObj)
                      .sort(mysort)
                      .toArray(function (err, result1) {
                        let obj = {
                          data: res,
                          more_records: result1.length,
                          total_records: result.length,
                          offset: offset,
                          per_page: recordsPerPage,
                          sortOrder: body.sortOrder,
                          page: page,
                          last: result[0]["r_uuid"],
                        };
                        deferred.resolve(obj);
                      });
                  } else {
                    let id = "";

                    if (res != "") {
                      id = res[0]["r_uuid"];
                    }

                    let obj = {
                      data: res,
                      more_records: 0,
                      per_page: recordsPerPage,
                      offset: offset,
                      total_records: result.length,
                      page: page,
                      sortOrder: body.sortOrder,
                      last: id,
                    };
                    deferred.resolve(obj, "last");
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

/**
 * This function is using to
 * @developer   :Anoop kumar

 */
mongoObj.getuserListData = async function (dataObj, tableName, body) {
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
          recordsPerPage = 10,
          page = 0,
          query = {};
        if (body.perPage) {
          recordsPerPage = body.perPage;
        }

        if (body.page) {
          page = body.page;
        }

        if (body.sortBy) {
          sortBy = body.sortBy;
        }

        if (body.sortOrder) {
          sortOrder = body.sortOrder;
        }

        if (body.last) {
          lastId = body.last;
        }

        if (lastId) {
          query._id = { $lte: lastId };
        }

        if (sortBy == "uc_first_name") {
          if (sortOrder == "ASC") {
            mysort = { uc_first_name: 1 };
          } else {
            mysort = { uc_first_name: -1 };
          }
        }
        if (sortBy == "uc_created") {
          if (sortOrder == "ASC") {
            mysort = { uc_created: 1 };
          } else {
            mysort = { uc_created: -1 };
          }
        }

        if (sortBy == "uc_balance") {
          if (sortOrder == "ASC") {
            mysort = { uc_balance: 1 };
          } else {
            mysort = { uc_balance: -1 };
          }
        }

        if (body.perPage) {
          dataObj = {
            uc_first_name: {
              $regex: new RegExp(".*" + body.keywords + ".*", "i"),
            },
            uc_deleted: "0",
          };
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
                  if (body.last && body.last != "") {
                    database
                      .collection(tableName)
                      .find(dataObj)
                      .sort(mysort)
                      .toArray(function (err, result1) {
                        let obj = {
                          data: res,
                          more_records: result1.length,
                          total_records: result.length,
                          offset: offset,
                          per_page: recordsPerPage,
                          sortOrder: body.sortOrder,
                          page: page,
                          last: result[0]["uc_uuid"],
                        };
                        deferred.resolve(obj);
                      });
                  } else {
                    let id = "";

                    if (res != "") {
                      id = res[0]["uc_uuid"];
                    }

                    let obj = {
                      data: res,
                      more_records: 0,
                      per_page: recordsPerPage,
                      offset: offset,
                      total_records: result.length,
                      page: page,
                      sortOrder: body.sortOrder,
                      last: id,
                    };
                    deferred.resolve(obj, "last");
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
/**
 * This function is using to
 * @param       :
 * @returns     :
 * @developer   : Anoop kumar
 */
mongoObj.geteventListData = async function (dataObj, tableName, body) {
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
          recordsPerPage = 10,
          page = 0,
          query = {};
        if (body.perPage) {
          recordsPerPage = body.perPage;
        }

        if (body.page) {
          page = body.page;
        }

        if (body.sortBy) {
          sortBy = body.sortBy;
        }

        if (body.sortOrder) {
          sortOrder = body.sortOrder;
        }

        if (body.last) {
          lastId = body.last;
        }

        if (lastId) {
          query._id = { $lte: lastId };
        }

        if (sortBy == "e_title") {
          if (sortOrder == "ASC") {
            mysort = { e_title: 1 };
          } else {
            mysort = { e_title: -1 };
          }
        }
        if (sortBy == "e_created") {
          if (sortOrder == "ASC") {
            mysort = { e_created: 1 };
          } else {
            mysort = { e_created: -1 };
          }
        }

        if (body.perPage) {
          dataObj = {
            e_title: {
              $regex: new RegExp(".*" + body.keywords + ".*", "i"),
            },
            e_deleted: "0",
          };
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
                  if (body.last && body.last != "") {
                    database
                      .collection(tableName)
                      .find(dataObj)
                      .sort(mysort)
                      .toArray(function (err, result1) {
                        let obj = {
                          data: res,
                          more_records: result1.length,
                          total_records: result.length,
                          offset: offset,
                          per_page: recordsPerPage,
                          sortOrder: body.sortOrder,
                          page: page,
                          last: result[0]["e_uuid"],
                        };
                        deferred.resolve(obj);
                      });
                  } else {
                    let id = "";

                    if (res != "") {
                      id = res[0]["e_uuid"];
                    }

                    let obj = {
                      data: res,
                      more_records: 0,
                      per_page: recordsPerPage,
                      offset: offset,
                      total_records: result.length,
                      page: page,
                      sortOrder: body.sortOrder,
                      last: id,
                    };
                    deferred.resolve(obj, "last");
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

/**
 * for get all news
 * @param   :
 * @developer   : Anoop Kumar
 */
mongoObj.getnewsListData = async function (dataObj, tableName, body) {
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
          recordsPerPage = 10,
          page = 0,
          query = {};
        if (body.perPage) {
          recordsPerPage = body.perPage;
        }

        if (body.page) {
          page = body.page;
        }

        if (body.sortBy) {
          sortBy = body.sortBy;
        }

        if (body.sortOrder) {
          sortOrder = body.sortOrder;
        }

        if (body.last) {
          lastId = body.last;
        }

        if (lastId) {
          query._id = { $lte: lastId };
        }

        if (sortBy == "n_title") {
          if (sortOrder == "ASC") {
            mysort = { n_title: 1 };
          } else {
            mysort = { n_title: -1 };
          }
        }
        if (sortBy == "n_created") {
          if (sortOrder == "ASC") {
            mysort = { n_created: 1 };
          } else {
            mysort = { n_created: -1 };
          }
        }

        if (sortBy == "uc_balance") {
          if (sortOrder == "ASC") {
            mysort = { uc_balance: 1 };
          } else {
            mysort = { uc_balance: -1 };
          }
        }

        if (body.perPage) {
          dataObj = {
            n_title: {
              $regex: new RegExp(".*" + body.keywords + ".*", "i"),
            },
            n_deleted: "0",
          };
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
                  if (body.last && body.last != "") {
                    database
                      .collection(tableName)
                      .find(dataObj)
                      .sort(mysort)
                      .toArray(function (err, result1) {
                        let obj = {
                          data: res,
                          more_records: result1.length,
                          total_records: result.length,
                          offset: offset,
                          per_page: recordsPerPage,
                          sortOrder: body.sortOrder,
                          page: page,
                          last: result[0]["n_uuid"],
                        };
                        deferred.resolve(obj);
                      });
                  } else {
                    let id = "";

                    if (res != "") {
                      id = res[0]["n_uuid"];
                    }

                    let obj = {
                      data: res,
                      more_records: 0,
                      per_page: recordsPerPage,
                      offset: offset,
                      total_records: result.length,
                      page: page,
                      sortOrder: body.sortOrder,
                      last: id,
                    };
                    deferred.resolve(obj, "last");
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
 * This function is used to get data from Mongo tables.
 * @param       :
 * @returns     :
 * @developer   :
 * @ModifiedBy  :
 */
mongoObj.getListData = async function (dataObj, tableName, body) {
  let deferred = q.defer();

  if (dataObj && tableName) {
    MongoClient.connect(url, options, function (err, db) {
      if (err) {
        deferred.resolve(false);
      } else {
        let database = db.db(dbName);
        let mysort = body.sortByObj,
          recordsPerPage = 10,
          page = 0;

        if (body.perPage) {
          recordsPerPage = body.perPage;
        }

        if (body.page) {
          page = body.page;
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
                  let obj = {
                    data: res,
                    total_records: result.length,
                  };
                  deferred.resolve(obj);

                  db.close();
                }
              });
          });
      }
    });
  } else {
    deferred.resolve(false);
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
mongoObj.getDataDetail = async function (dataObj, tableName) {
  let deferred = q.defer();

  if (dataObj && tableName) {
    MongoClient.connect(url, options, function (err, db) {
      if (err) {
        deferred.resolve(false);
      } else {
        let database = db.db(dbName),
          mysort = { _id: -1 },
          sortBy = "",
          sortOrder = "",
          lastId = "",
          queryObj = "",
          recordsPerPage = 120,
          page = 2,
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
                          last: result[0]["uo_uuid"],
                        };
                        deferred.resolve(obj);
                      });
                  } else {
                    let id = "";

                    if (res != "") {
                      id = res[0]["uo_uuid"];
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

mongoObj.getRow = async (dataObj, tableName) => {
  let deferred = q.defer();
  if (dataObj && tableName) {
    MongoClient.connect(url, options, function (err, db) {
      let database = db.db(dbName);

      if (err) {
        deferred.resolve([]);
      } else {
        database.collection(tableName).findOne(dataObj, function (err, res) {
          if (res) {
            deferred.resolve(res);
          } else {
            deferred.resolve(false);
          }
        });
      }
    });
  } else {
    deferred.resolve([]);
  }

  return deferred.promise;
};

// Transction list 28/12/2022
mongoObj.getcontactListData = async function (dataObj, tableName, body) {
  let deferred = q.defer();
  if (dataObj && tableName) {
    MongoClient.connect(url, options, function (err, db) {
      if (err) {
        deferred.resolve(false);
      } else {
        let database = db.db(dbName),
          mysort = { '_id': 1 },
          sortBy = "",
          sortOrder = "",
          lastId = "",
          queryObj = "",
          recordsPerPage = 10,
          page = 0,
          query = {};
        if (body.perPage) {
          recordsPerPage = body.perPage;
        }

        if (body.page) {
          page = body.page;
        }

        if (body.sortBy) {
          sortBy = body.sortBy;
        }

        if (body.sortOrder) {
          sortOrder = body.sortOrder;
        }

        if (body.last) {
          lastId = body.last;
        }

        if (lastId) {
          query._id = { $lte: lastId };
        }


        if (sortBy == "dc_created") {
          if (sortOrder == "ASC") {
            mysort = { dc_created: 1 };
          } else {
            mysort = { dc_created: -1 };
          }
        }

        if (sortBy == "dc_type") {
          if (sortOrder == "ASC") {
            mysort = {dc_type: 1 };
          } else {
            mysort = { dc_type: -1 };
          }
        }
        if (body.keywords) {
          dataObj = {
            dc_type: {
              $regex: new RegExp(".*" + body.keywords + ".*", 'i')
            }
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
                  if (body.last && body.last != "") {
                    database
                      .collection(tableName)
                      .find(dataObj)
                      .sort(mysort)
                      .toArray(function (err, result1) {
                        let obj = {
                          data: res,
                          more_records: result1.length,
                          total_records: result.length,
                          offset: offset,
                          per_page: recordsPerPage,
                          sortOrder: body.sortOrder,
                          page: page,
                          last: result[0]["dc_uuid"],
                        };

                        deferred.resolve(obj);
                      });
                  } else {
                    let id = "";

                    if (res != "") {
                      id = res[0]["dc_uuid"];
                    }

                    let obj = {
                      data: res,
                      more_records: 0,
                      per_page: recordsPerPage,
                      offset: offset,
                      total_records: result.length,
                      page: page,
                      sortOrder: body.sortOrder,
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
