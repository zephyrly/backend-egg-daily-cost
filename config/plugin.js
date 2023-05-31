/*
 * @Date: 2023-05-16 17:34:29
 * @LastEditors: okzfans
 * @LastEditTime: 2023-05-16 18:51:00
 * @Description: nothing
 * Copyright (c) 2023 by okzfans, All Rights Reserved. 
 */
'use strict';

/** @type Egg.EggPlugin */
module.exports = {
  // had enabled by egg
  // static: {
  //   enable: true,
  // }
  ejs: {
    enable: true,
    package: 'egg-view-ejs'
  },
  mysql: {
    enable: true,
    package: 'egg-mysql'
  },
  jwt: {
    enable: true,
    package: 'egg-jwt'
  },
  cors: {
    enable: true,
    package: 'egg-cors',
  },
};
