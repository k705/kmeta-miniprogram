import request from '../utils/request';

/**
 * 数字藏品
 */
export const getPromotionGoodsListAPi = (lastId,pageSize) => {
  return request(`/promotionGoods/list?lastId=${lastId}&pageSize=${pageSize}`);
}

/**
 * 数字藏品兑换
 */
export const getPromotionGoodsExchangeApi = (data) => {
  return request(`/promotionGoods/exchange`, data, 'POST');
}