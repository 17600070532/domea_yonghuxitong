/*
使用mockjs提供模拟数据接口
 */


import Mock from 'mockjs'
import data from './data.json'

// // 提供 goods数据接口
Mock.mock('/goods', {code: 0, data: data})



// // 提供 ratings数据接口
// Mock.mock('/ratings', {code: 0, data: data.ratings})
