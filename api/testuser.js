import request from '../utils/request';

/**
 * 登录
 */
export const loginApi = (data) => {
  return request(`/kmeta-customer/wechatLogin`, data, 'POST');
}

export const saveAddressApi = (data) => {
  return request(`/userAddress/save`, data, 'POST');
}


/**
 * 获取用户数据
 */
export const getUserInfoApi = () => {
  return request(`/weixin/getuserInfo`);
}
