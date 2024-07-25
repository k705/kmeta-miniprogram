import request from '../utils/request';

/**
 * 我的区块物流
 */
export const getLogisticsApi = (blockId) => {
  return request(`/blockPrize/logistics?blockId=${blockId}`);
}
