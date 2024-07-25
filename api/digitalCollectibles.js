import request from '../utils/request';

/**
 * 数字藏品
 */
export const getDigitalCollectiblesListApi = (lastId,pageSize,nftSeriesId) => {
  return request(`/digitalCollectibles/list?lastId=${lastId}&pageSize=${pageSize}&nftSeriesId=${nftSeriesId}`);
}

/**
 * 数字藏品兑换
 */
export const getDigitalCollectiblesExchangeApi = (data) => {
  return request(`/digitalCollectibles/exchange`, data, 'POST');
}

/**
 * 数字藏品系列
 */
export const getDigitalSeriesListApi = () => {
  return request(`/digitalCollectibles/seriesList`);
}

/**
 * NFT - banner
 */
export const getNftBannerApi = () => {
  return request(`/nftBanner`);
}