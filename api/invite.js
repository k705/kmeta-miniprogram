import request from '../utils/request';

/**
 * 首页星球数据
 */
// export const getInviteRecordsApi = (lastId,pageSize) => {
//   return request(`/customer/inviteRecords?lastId=${lastId}&pageSize=${pageSize}`);
// }

export const getInviteRecordsApi = (lastId,pageSize) => {
  return request(`/customer/inviteRecords?lastId=${lastId}&pageSize=${pageSize}`);
}

export const getWxacodeApi = (path,envVersion,scene) => {
  return request(`/config/getWxacode?path=${path}&envVersion=${envVersion}&scene=${scene}`);
}
export const getInviteNumberdeApi = () => {
  return request(`/customer/inviteNumber`);
}

export const inviteApi = () => {
  return request(`/invite/inviteInfo`);
}