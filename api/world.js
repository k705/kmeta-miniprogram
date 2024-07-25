import request from '../utils/request';

/**
 * 轮播图banner
 */
export const getBannerListApi = () => {
  return request(`/world/bannerList`);
}

/**
 * 广告位
 */
export const getAdInfoApi = () => {
  return request(`/world/adInfo`);
}

/**
 * 动态
 */
export const cosmosTrendsApi = (lastId,pageSize) => {
  return request(`/world/cosmosTrends?lastId=${lastId}&pageSize=${pageSize}`);
}

/**
 * 资讯
 */
export const informationListApi = (lastId,pageSize) => {
  return request(`/world/getInformationList?lastId=${lastId}&pageSize=${pageSize}`);
}

/**
 * 资讯
 */
export const informationBrowseApi = (informationId) => {
  return request(`/world/information/browse?informationId=${informationId}`);
}

