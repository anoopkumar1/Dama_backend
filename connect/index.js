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
const chat_socket = require("./chat"),
  common_socket = require("./common"),
  helper = require("./application/helpers/"),
  common_controller = require("./application/controllers/common"),
  socket_constant = require("../common/config/socket_constant"),
  constant_listener = socket_constant.LISTENER,
  constant_emit = socket_constant.EMIT,
  socketHandlerObj = {};

socketHandlerObj.onSocketConnect = function (socket) {
  socket.on(constant_listener.MAIN_LISTENER, async function (dataObj) {
    if (dataObj && dataObj.data) {
      let userAthuntication = helper.isAuthentication(socket, dataObj);

      if (
        userAthuntication &&
        userAthuntication.userId &&
        userAthuntication.uc_uuid
      ) {
        if (dataObj.data) {
          dataObj.data.userId = userAthuntication.userId;
          dataObj.data.userUuid = userAthuntication.uc_uuid;
          dataObj.data.mySocketId = socket.id;
        }

        if (dataObj.type) {
          let type = dataObj.type;

          if (type.chat) {
            chat_socket.init(socket, dataObj);
          }
        }
      } else {
        socket.emit(constant_emit.MAIN_EMIT, {
          action: "INFO",
          data: {
            message: "Authentication failed!",
          },
        });
      }
    } else {
      socket.emit(constant_emit.MAIN_EMIT, {
        action: "ERROR",
        data: {
          message: "2222222222222222222",
        },
      });
    }
  });

  common_socket.init(socket);
};

module.exports.init = function (io) {
  io.on("connection", function (socket) {
    let userAthuntication = helper.isAuthentication(socket);

    if (userAthuntication && userAthuntication.uc_uuid) {
      common_controller.newUser(socket, userAthuntication);
    }
    socketHandlerObj.onSocketConnect(socket);
  });
};
