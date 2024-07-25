import request from '../utils/request';

/**
 * 财富信息
 */


export const getTreasuryListApi = () => {
  return request(`/personal/treasury`);
}
export const getTaskListApi = () => {
  return request(`/task/taskList`);
}

/**
 * 分享好友
 */
export const appletShareFriendApi = (data) => {
  return request(`/customer/share`, data, 'POST');
}

/**
 * K宝！！！！！！！！！！
 */


// 区块大奖
export const blockPrizeRecordApi = (lastId,pageSize) => {
  return request(`/blockPrize/exchangeRecord?lastId=${lastId}&pageSize=${pageSize}`);
}

// 数字藏品
export const digitalCollectiblesRecordApi = (lastId,pageSize) => {
  return request(`/digitalCollectibles/exchangeRecord?lastId=${lastId}&pageSize=${pageSize}`);
}

// 促销兑换
export const promotionRecordApi = (lastId,pageSize) => {
  return request(`/promotionGoods/exchangeRecord?lastId=${lastId}&pageSize=${pageSize}`);
}

// 虚拟商品
export const virtuallyRecordApi = (lastId,pageSize) => {
  return request(`/virtuallyGoods/exchangeRecord?lastId=${lastId}&pageSize=${pageSize}`);
}
// 换头像
export const usedAvatarApi = (data) => {
  return request(`/personal/usedAvatar`, data, 'POST');
}

// 区块核销教程
export const getUsedDetailsApi = (blockId) => {
  return request(`/blockPrize/getUsedDetails?blockId=${blockId}`);
}