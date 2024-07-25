import request from '../utils/request';



/**
 * 抢兑区块
 */
export const blockPrizeExchangeApi = (data) => {
  return request(`/blockPrize/exchange`, data, 'POST');
}
/**
 * 区块大奖详情
 */
export const getBlockPrizeDetailsApi = (blockPrizeId) => {
  return request(`/blockPrize/details?blockPrizeId=${blockPrizeId}`);
}
/**
 * 保存地址
 */
export const saveAddressApi = (data) => {
  return request(`/customer/saveAddress`, data, 'POST');
}
/**
 * 获取地址
 */
export const getDefaultAddressApi = () => {
  return request(`/customer/getDefaultAddress`);
}