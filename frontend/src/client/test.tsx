import React, { Component } from "react";

export default class Test extends Component {
  componentDidMount() {
    // 发送 GET 请求到服务器的 /test 路由
    fetch('http://localhost:3000/api/test', {
      method: 'GET',
      credentials: 'include', // 允许发送和接收 cookie
    })
    .then(response => response.json())
    .then(data => {
      console.log('服务器响应数据:', data);
    })
    .catch(error => {
      console.error('请求失败:', error);
    });
  }

  render() {
    return <div>test</div>;
  }
}
