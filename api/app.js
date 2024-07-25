import request from '../utils/request';


/**
 * 首页单个星球数据
 */
export const getBlockPrizeApi = () => {
  return request(`/blockPrize/get`);
}


