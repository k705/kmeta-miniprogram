import request from '../utils/request';

/**
 * 登录
 */

export const loginApi = (data) => {
  return request(`/wechatAppletLogin/v2`, data, 'POST');
}

export const customerInfoApi = (data) => {
  return request(`/appletUpdateCustomerInfo`, data, 'POST');
}
