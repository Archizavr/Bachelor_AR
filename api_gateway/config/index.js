export default {
    gatewayPort: process.env.GATEWAY_PORT || 4000,
  
    userServiceUrl: `http://${process.env.SRVC_USER_NAME || 'localhost'}:${process.env.SRVC_USER_PORT || 4001}`,
    orderServiceUrl: `http://${process.env.SRVC_ORDER_NAME || 'localhost'}:${process.env.SRVC_ORDER_PORT || 4002}`,
    productServiceUrl: `http://${process.env.SRVC_PRODUCT_NAME || 'localhost'}:${process.env.SRVC_PRODUCT_PORT || 4003}`,
  };
