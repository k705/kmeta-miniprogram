import request from '../utils/request';

/**
 * 首页星球数据
 */
// export const rankListApi = () => {
//   return request('/customer/scoreRankingList');
// }

export const getRankListApi = () => {
  return request(`/customer/scoreRankingList`);
}