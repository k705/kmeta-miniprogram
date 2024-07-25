import request from '../utils/request';

/**
 * 首页星球数据
 */
export const getStarListApi = (excludeStarIds,currentStarId,pageSize) => {
  return request(`/star/home?excludeStarIds=${excludeStarIds}&currentStarId=${currentStarId}&pageSize=${pageSize}`);
}

/**
 * 首页单个星球数据
 */
export const getStarDetailsApi = (starId) => {
  return request(`/star/starDetails?starId=${starId}`);
}




/**
 * 挖矿分数
 */
export const getExcavateOreApi = (data) => {
  return request(`/star/excavateOre`, data, 'POST');
}

/**
 * 分数  钱
 */
export const getAccountIfoApi = () => {
  return request(`/account/info`);
}


/**
 * 资源访问
 */
export const getAccessResourceApi = (data) => {
  return request(`/customer/accessResource`, data, 'POST');
}

/**
 * 首页倒计时
 */
export const getvirtualCalendarApi = () => {
  return request(`/config/virtualCalendar`);
}

/**
 * 大于300次
 */
export const errorGenerateOreApi = (data) => {
  return request(`/error/generateOre`, data, 'POST');
}

/**
 * 兑换弹窗
 */
export const appletRecommendApi = () => {
  return request(`/config/appletRecommend`);
}

/**
 * 绑定手机号
 */
export const wechatAppletPhoneApi = (data) => {
  return request(`/wechatAppletPhone`, data, 'POST');
}

/**
 * 隐私政策
 */
export const wechatAppletagreePrivacyApi = (data) => {
  return request(`/wechatAppletagreePrivacy`, data, 'POST');
}

/**
 * 首页动态
 */
export const cosmosTrendsApi = (lastId,pageSize) => {
  return request(`/world/cosmosTrends?lastId=${lastId}&pageSize=${pageSize}`);
}
/**
 * 道具信息
 */
export const propInfoApi = () => {
  return request(`/star/propInfo`);
}

/**
 * 使用道具
 */
export const usePropApi = (data) => {
  return request(`/star/useProp`, data, 'POST');
}

/**
 * 道具包
 */
export const propPackageApi = () => {
  return request(`/star/propPackage`);
}
/**
 * 使用道具
 */
export const usePropV2Api = (data) => {
  return request(`/star/useProp/v2`, data, 'POST');
}

/**
 * 签到信息
 */
export const signInInfoV2Api = () => {
  return request(`/signIn/signInInfo/v2`);  
}

/**
 * 签到
 */
export const signInV2Api = (data) => {
  return request(`/signIn/signIn/v2`, data, 'POST');
}