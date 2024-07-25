import request from '../utils/request';

/**
 * 数字藏品
 */
export const getVirtuallyGoodsListApi = (lastId,pageSize)  => {
  return request(`/virtuallyGoods/list?lastId=${lastId}&pageSize=${pageSize}`);
}

/**
 * 数字藏品兑换
 */
export const virtuallyGoodsExchangeApi = (data) => {
  return request(`/virtuallyGoods/exchange`, data, 'POST');
}