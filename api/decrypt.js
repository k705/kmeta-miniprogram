import request from '../utils/request';

/**
 * 我的区块
 */
export const getMyBlockApi = (blockPrizeId) => {
  return request(`/blockPrize/myBlock?blockPrizeId=${blockPrizeId}`);
}

/**
 * 解密区块
 */
export const blockPrizeDecryptApi = (data) => {
  return request(`/blockPrize/decrypt`, data, 'POST');
}