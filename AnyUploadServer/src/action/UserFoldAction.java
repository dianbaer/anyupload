package action;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import org.apache.ibatis.session.SqlSession;
import org.grain.mariadb.MybatisManager;

import config.UserFoldConfig;
import dao.dao.base.UserFoldMapper;
import dao.dao.ext.UserFoldMapperExt;
import dao.model.base.UserFold;
import dao.model.base.UserFoldCriteria;
import dao.model.ext.UserFoldExt;
import protobuf.http.UserFoldProto.UserFoldData;
import tool.StringUtil;
import tool.TimeUtils;
import util.IdUtil;

public class UserFoldAction {
	public static UserFold createUserFoldTopType(int userFoldOwnerType, String userFoldOwnerId) {
		if (userFoldOwnerType != UserFoldConfig.OWNER_TYPE_USER && userFoldOwnerType != UserFoldConfig.OWNER_TYPE_GROUP && userFoldOwnerType != UserFoldConfig.OWNER_TYPE_APP) {
			return null;
		}
		if (StringUtil.stringIsNull(userFoldOwnerId)) {
			return null;
		}
		Date date = new Date();
		UserFold userFold = new UserFold();
		userFold.setUserFoldId(IdUtil.getUuid());
		userFold.setUserFoldCreateTime(date);
		userFold.setUserFoldUpdateTime(date);
		userFold.setUserFoldState((byte) UserFoldConfig.STATE_CAN_USE);
		userFold.setUserFoldOwnerType((byte) userFoldOwnerType);
		userFold.setUserFoldOwnerId(userFoldOwnerId);
		return createUserFold(userFold);
	}

	public static UserFold createUserFoldTopChannel(int userFoldChannelType, String userFoldChannelUserId) {
		if (userFoldChannelType != UserFoldConfig.CHANNEL_TYPE_MAIL) {
			return null;
		}
		if (StringUtil.stringIsNull(userFoldChannelUserId)) {
			return null;
		}
		Date date = new Date();
		UserFold userFold = new UserFold();
		userFold.setUserFoldId(IdUtil.getUuid());
		userFold.setUserFoldCreateTime(date);
		userFold.setUserFoldUpdateTime(date);
		userFold.setUserFoldState((byte) UserFoldConfig.STATE_CAN_USE);
		userFold.setUserFoldChannelType((byte) userFoldChannelType);
		userFold.setUserFoldChannelUserId(userFoldChannelUserId);
		return createUserFold(userFold);
	}

	public static UserFold getUserFoldTopType(int userFoldOwnerType, String userFoldOwnerId) {
		if (userFoldOwnerType != UserFoldConfig.OWNER_TYPE_USER && userFoldOwnerType != UserFoldConfig.OWNER_TYPE_GROUP && userFoldOwnerType != UserFoldConfig.OWNER_TYPE_APP) {
			return null;
		}
		if (StringUtil.stringIsNull(userFoldOwnerId)) {
			return null;
		}
		SqlSession sqlSession = null;
		try {
			sqlSession = MybatisManager.getSqlSession();
			UserFoldMapper userFoldMapper = sqlSession.getMapper(UserFoldMapper.class);
			UserFoldCriteria userFoldCriteria = new UserFoldCriteria();
			UserFoldCriteria.Criteria criteriaFold = userFoldCriteria.createCriteria();
			criteriaFold.andUserFoldOwnerTypeEqualTo((byte) userFoldOwnerType).andUserFoldOwnerIdEqualTo(userFoldOwnerId);
			List<UserFold> userFoldList = userFoldMapper.selectByExample(userFoldCriteria);
			if (userFoldList == null || userFoldList.size() == 0) {
				return null;
			}
			return userFoldList.get(0);
		} catch (Exception e) {
			if (sqlSession != null) {
				sqlSession.rollback();
			}
			MybatisManager.log.error("查询根文件夹失败", e);
			return null;
		} finally {
			if (sqlSession != null) {
				sqlSession.close();
			}
		}
	}

	public static UserFold getUserFoldTopChannel(int userFoldChannelType, String userFoldChannelUserId) {
		if (userFoldChannelType != UserFoldConfig.CHANNEL_TYPE_MAIL) {
			return null;
		}
		if (StringUtil.stringIsNull(userFoldChannelUserId)) {
			return null;
		}
		SqlSession sqlSession = null;
		try {
			sqlSession = MybatisManager.getSqlSession();
			UserFoldMapper userFoldMapper = sqlSession.getMapper(UserFoldMapper.class);
			UserFoldCriteria userFoldCriteria = new UserFoldCriteria();
			UserFoldCriteria.Criteria criteriaFold = userFoldCriteria.createCriteria();
			criteriaFold.andUserFoldChannelTypeEqualTo((byte) userFoldChannelType).andUserFoldChannelUserIdEqualTo(userFoldChannelUserId);
			List<UserFold> userFoldList = userFoldMapper.selectByExample(userFoldCriteria);
			if (userFoldList == null || userFoldList.size() == 0) {
				return null;
			}
			return userFoldList.get(0);
		} catch (Exception e) {
			if (sqlSession != null) {
				sqlSession.rollback();
			}
			MybatisManager.log.error("查询根文件夹失败", e);
			return null;
		} finally {
			if (sqlSession != null) {
				sqlSession.close();
			}
		}
	}

	public static UserFold createUserFoldChild(String userFoldName, String userFoldParentId, String createUserId) {
		if (StringUtil.stringIsNull(userFoldName) || StringUtil.stringIsNull(userFoldParentId) || StringUtil.stringIsNull(createUserId)) {
			return null;
		}
		UserFold parentUserFold = getUserFoldById(userFoldParentId);
		if (parentUserFold == null) {
			return null;
		}
		Date date = new Date();
		UserFold userFold = new UserFold();
		userFold.setUserFoldId(IdUtil.getUuid());
		userFold.setUserFoldName(userFoldName);
		userFold.setUserFoldParentId(parentUserFold.getUserFoldId());
		userFold.setUserFoldCreateTime(date);
		userFold.setUserFoldUpdateTime(date);
		userFold.setUserFoldState((byte) UserFoldConfig.STATE_CAN_USE);
		if (StringUtil.stringIsNull(parentUserFold.getUserFoldTopId())) {
			userFold.setUserFoldTopId(parentUserFold.getUserFoldId());
		} else {
			userFold.setUserFoldTopId(parentUserFold.getUserFoldTopId());
		}
		userFold.setCreateUserId(createUserId);
		return createUserFold(userFold);
	}

	public static UserFold createUserFold(UserFold userfold) {
		SqlSession sqlSession = null;
		try {
			sqlSession = MybatisManager.getSqlSession();
			UserFoldMapper userFoldMapper = sqlSession.getMapper(UserFoldMapper.class);
			int result = userFoldMapper.insert(userfold);
			if (result != 1) {
				MybatisManager.log.warn("创建文件夹失败");
				return null;
			}
			sqlSession.commit();
		} catch (Exception e) {
			if (sqlSession != null) {
				sqlSession.rollback();
			}
			MybatisManager.log.error("创建文件夹失败", e);
			return null;
		} finally {
			if (sqlSession != null) {
				sqlSession.close();
			}
		}
		return userfold;
	}

	public static UserFold getUserFoldById(String userFoldId) {
		if (StringUtil.stringIsNull(userFoldId)) {
			return null;
		}
		SqlSession sqlSession = null;
		UserFold userFold;
		try {
			sqlSession = MybatisManager.getSqlSession();
			UserFoldMapper userFoldMapper = sqlSession.getMapper(UserFoldMapper.class);
			userFold = userFoldMapper.selectByPrimaryKey(userFoldId);
			if (userFold == null) {
				MybatisManager.log.warn("通过userFoldId:" + userFoldId + "获取文件夹为空");
			}
		} catch (Exception e) {
			if (sqlSession != null) {
				sqlSession.rollback();
			}
			MybatisManager.log.error("获取文件夹异常", e);
			return null;
		} finally {
			if (sqlSession != null) {
				sqlSession.close();
			}
		}
		return userFold;
	}

	public static UserFoldData.Builder getUserFoldBuilder(UserFold userFold) {
		UserFoldData.Builder dataBuilder = UserFoldData.newBuilder();
		dataBuilder.setUserFoldId(userFold.getUserFoldId());
		if (userFold.getUserFoldName() != null) {
			dataBuilder.setUserFoldName(userFold.getUserFoldName());
		}
		if (userFold.getUserFoldParentId() != null) {
			dataBuilder.setUserFoldParentId(userFold.getUserFoldParentId());
		}
		dataBuilder.setUserFoldCreateTime(TimeUtils.dateToString(userFold.getUserFoldCreateTime()));
		dataBuilder.setUserFoldUpdateTime(TimeUtils.dateToString(userFold.getUserFoldUpdateTime()));
		dataBuilder.setUserFoldState(userFold.getUserFoldState());
		if (userFold.getUserFoldTopId() != null) {
			dataBuilder.setUserFoldTopId(userFold.getUserFoldTopId());
		}
		if (userFold.getCreateUserId() != null) {
			dataBuilder.setCreateUserId(userFold.getCreateUserId());
		}
		if (userFold.getUserFoldOwnerType() != null) {
			dataBuilder.setUserFoldOwnerType(userFold.getUserFoldOwnerType());
		}
		if (userFold.getUserFoldOwnerId() != null) {
			dataBuilder.setUserFoldOwnerId(userFold.getUserFoldOwnerId());
		}
		if (userFold.getUserFoldChannelType() != null) {
			dataBuilder.setUserFoldChannelType(userFold.getUserFoldChannelType());
		}
		if (userFold.getUserFoldChannelUserId() != null) {
			dataBuilder.setUserFoldChannelUserId(userFold.getUserFoldChannelUserId());
		}
		if (userFold instanceof UserFoldExt) {
			if (((UserFoldExt) userFold).getChildrenNum().intValue() > 0) {
				dataBuilder.setHaveChildUserFold(true);
			} else {
				dataBuilder.setHaveChildUserFold(false);
			}
		}
		dataBuilder.setUserFoldUpdateTimeStamp(userFold.getUserFoldUpdateTime().getTime());
		return dataBuilder;
	}

	public static UserFold updateUserFold(String userFoldId, String userFoldName, int userFoldState, boolean isUpdateUserFoldParent, String userFoldParentId) {
		if (StringUtil.stringIsNull(userFoldId)) {
			return null;
		}
		UserFold userFold = getUserFoldById(userFoldId);
		if (userFold == null) {
			return null;
		}
		// 顶级不能修改
		if (userFold.getUserFoldTopId() == null) {
			return null;
		}
		UserFold userFoldNew = new UserFold();
		userFoldNew.setUserFoldId(userFoldId);
		Date date = new Date();
		userFoldNew.setUserFoldUpdateTime(date);
		if (!StringUtil.stringIsNull(userFoldName)) {
			userFoldNew.setUserFoldName(userFoldName);
		}
		if (userFoldState == UserFoldConfig.STATE_CAN_USE || userFoldState == UserFoldConfig.STATE_IN_RECYCLEBIN || userFoldState == UserFoldConfig.STATE_DELETE) {
			userFoldNew.setUserFoldState((byte) userFoldState);
		}
		if (isUpdateUserFoldParent) {
			// 如果是空，就说明是放到顶级文件夹
			if (StringUtil.stringIsNull(userFoldParentId)) {
				userFoldParentId = userFold.getUserFoldTopId();
			}
			List<UserFold> recursionUserFoldList = getRecursionUserFoldList(userFoldParentId);
			if (recursionUserFoldList == null) {
				return null;
			}
			// 移动的这些文件夹，合法检查
			for (int i = 0; i < recursionUserFoldList.size(); i++) {
				UserFold checkUserFold = recursionUserFoldList.get(i);
				if (userFoldId.equals(checkUserFold.getUserFoldId())) {
					return null;
				}
			}
			UserFold parentUserFold = getUserFoldById(userFoldParentId);
			if (parentUserFold == null) {
				return null;
			}
			userFoldNew.setUserFoldParentId(parentUserFold.getUserFoldId());
		}
		SqlSession sqlSession = null;
		try {
			sqlSession = MybatisManager.getSqlSession();
			UserFoldMapper userFoldMapper = sqlSession.getMapper(UserFoldMapper.class);
			int result = userFoldMapper.updateByPrimaryKeySelective(userFoldNew);
			if (result != 1) {
				MybatisManager.log.warn("修改文件夹失败");
				return null;
			}
			sqlSession.commit();
		} catch (Exception e) {
			if (sqlSession != null) {
				sqlSession.rollback();
			}
			MybatisManager.log.error("修改文件夹异常", e);
			return null;
		} finally {
			if (sqlSession != null) {
				sqlSession.close();
			}
		}
		return getUserFoldById(userFoldNew.getUserFoldId());
	}

	public static List<UserFold> getUserFoldChildren(String userFoldParentId) {
		if (StringUtil.stringIsNull(userFoldParentId)) {
			return null;
		}
		SqlSession sqlSession = null;
		try {
			sqlSession = MybatisManager.getSqlSession();
			UserFoldMapper userFoldMapper = sqlSession.getMapper(UserFoldMapper.class);
			UserFoldCriteria userFoldCriteria = new UserFoldCriteria();
			UserFoldCriteria.Criteria criteriaFold = userFoldCriteria.createCriteria();
			criteriaFold.andUserFoldParentIdEqualTo(userFoldParentId).andUserFoldStateEqualTo((byte) UserFoldConfig.STATE_CAN_USE);
			userFoldCriteria.setOrderByClause("user_fold_name asc");
			List<UserFold> userFoldList = userFoldMapper.selectByExample(userFoldCriteria);
			return userFoldList;
		} catch (Exception e) {
			if (sqlSession != null) {
				sqlSession.rollback();
			}
			MybatisManager.log.error("查询文件夹子集失败", e);
			return null;
		} finally {
			if (sqlSession != null) {
				sqlSession.close();
			}
		}
	}

	public static List<UserFoldExt> getUserFoldChildrenWithChildNum(String userFoldParentId) {
		if (StringUtil.stringIsNull(userFoldParentId)) {
			return null;
		}
		SqlSession sqlSession = null;
		try {
			sqlSession = MybatisManager.getSqlSession();
			UserFoldMapperExt userFoldMapperExt = sqlSession.getMapper(UserFoldMapperExt.class);
			List<UserFoldExt> userFoldList = userFoldMapperExt.selectByUserFoldParentId(userFoldParentId);
			return userFoldList;
		} catch (Exception e) {
			if (sqlSession != null) {
				sqlSession.rollback();
			}
			MybatisManager.log.error("查询文件夹子集失败", e);
			return null;
		} finally {
			if (sqlSession != null) {
				sqlSession.close();
			}
		}
	}

	public static List<UserFold> getRecursionUserFoldList(String userFoldParentId) {
		if (StringUtil.stringIsNull(userFoldParentId)) {
			return null;
		}
		SqlSession sqlSession = null;
		try {
			sqlSession = MybatisManager.getSqlSession();
			UserFoldMapper userFoldMapper = sqlSession.getMapper(UserFoldMapper.class);
			List<UserFold> list = new ArrayList<UserFold>();
			UserFold userFold = userFoldMapper.selectByPrimaryKey(userFoldParentId);
			list.add(userFold);
			while (userFold.getUserFoldTopId() != null) {
				userFold = userFoldMapper.selectByPrimaryKey(userFold.getUserFoldParentId());
				list.add(userFold);
			}
			return list;
		} catch (Exception e) {
			if (sqlSession != null) {
				sqlSession.rollback();
			}
			MybatisManager.log.error("查询文件夹子集失败", e);
			return null;
		} finally {
			if (sqlSession != null) {
				sqlSession.close();
			}
		}
	}

	public static List<UserFold> getRecyclebinUserFold(String userFoldTopId) {
		if (StringUtil.stringIsNull(userFoldTopId)) {
			return null;
		}
		SqlSession sqlSession = null;
		try {
			sqlSession = MybatisManager.getSqlSession();
			UserFoldMapper userFoldMapper = sqlSession.getMapper(UserFoldMapper.class);
			UserFoldCriteria userFoldCriteria = new UserFoldCriteria();
			UserFoldCriteria.Criteria criteriaFold = userFoldCriteria.createCriteria();
			criteriaFold.andUserFoldTopIdEqualTo(userFoldTopId).andUserFoldStateEqualTo((byte) UserFoldConfig.STATE_IN_RECYCLEBIN);
			userFoldCriteria.setOrderByClause("user_fold_name asc");
			List<UserFold> userFoldList = userFoldMapper.selectByExample(userFoldCriteria);
			return userFoldList;
		} catch (Exception e) {
			if (sqlSession != null) {
				sqlSession.rollback();
			}
			MybatisManager.log.error("查询回收站失败", e);
			return null;
		} finally {
			if (sqlSession != null) {
				sqlSession.close();
			}
		}
	}

	public static boolean clearRecycleBin(String userFoldTopId) {
		SqlSession sqlSession = null;
		UserFold userFold = new UserFold();
		Date date = new Date();
		userFold.setUserFoldState((byte) UserFoldConfig.STATE_DELETE);
		userFold.setUserFoldUpdateTime(date);
		try {
			sqlSession = MybatisManager.getSqlSession();
			UserFoldMapper userFoldMapper = sqlSession.getMapper(UserFoldMapper.class);
			UserFoldCriteria userFoldCriteria = new UserFoldCriteria();
			UserFoldCriteria.Criteria criteriaFold = userFoldCriteria.createCriteria();
			criteriaFold.andUserFoldTopIdEqualTo(userFoldTopId).andUserFoldStateEqualTo((byte) UserFoldConfig.STATE_IN_RECYCLEBIN);
			int result = userFoldMapper.updateByExampleSelective(userFold, userFoldCriteria);
			sqlSession.commit();
		} catch (Exception e) {
			if (sqlSession != null) {
				sqlSession.rollback();
			}
			MybatisManager.log.error("清空回收站失败", e);
			return false;
		} finally {
			if (sqlSession != null) {
				sqlSession.close();
			}
		}
		return true;
	}

	public static boolean updateUserFoldListState(List<String> userFoldIds, int userFoldState) {
		if (userFoldState != UserFoldConfig.STATE_CAN_USE && userFoldState != UserFoldConfig.STATE_IN_RECYCLEBIN && userFoldState != UserFoldConfig.STATE_DELETE) {
			return false;
		}
		SqlSession sqlSession = null;
		UserFold userFold = new UserFold();
		Date date = new Date();
		userFold.setUserFoldState((byte) userFoldState);
		userFold.setUserFoldUpdateTime(date);
		try {
			sqlSession = MybatisManager.getSqlSession();
			UserFoldMapper userFoldMapper = sqlSession.getMapper(UserFoldMapper.class);
			UserFoldCriteria userFoldCriteria = new UserFoldCriteria();
			UserFoldCriteria.Criteria criteriaFold = userFoldCriteria.createCriteria();
			criteriaFold.andUserFoldIdIn(userFoldIds);
			int result = userFoldMapper.updateByExampleSelective(userFold, userFoldCriteria);
			sqlSession.commit();
		} catch (Exception e) {
			if (sqlSession != null) {
				sqlSession.rollback();
			}
			MybatisManager.log.error("修改文件夹状态失败", e);
			return false;
		} finally {
			if (sqlSession != null) {
				sqlSession.close();
			}
		}
		return true;
	}

	public static boolean updateUserFoldListParentId(List<String> userFoldIds, String userFoldParentId) {
		if (StringUtil.stringIsNull(userFoldParentId)) {
			return false;
		}
		List<UserFold> recursionUserFoldList = getRecursionUserFoldList(userFoldParentId);
		if (recursionUserFoldList == null) {
			return false;
		}
		// 移动的这些文件夹，合法检查
		for (int i = 0; i < recursionUserFoldList.size(); i++) {
			UserFold checkUserFold = recursionUserFoldList.get(i);
			if (userFoldIds.contains(checkUserFold.getUserFoldId())) {
				return false;
			}
		}
		UserFold parentUserFold = UserFoldAction.getUserFoldById(userFoldParentId);
		if (parentUserFold == null) {
			return false;
		}
		SqlSession sqlSession = null;
		UserFold userFold = new UserFold();
		Date date = new Date();
		userFold.setUserFoldParentId(userFoldParentId);
		userFold.setUserFoldUpdateTime(date);
		try {
			sqlSession = MybatisManager.getSqlSession();
			UserFoldMapper userFoldMapper = sqlSession.getMapper(UserFoldMapper.class);
			UserFoldCriteria userFoldCriteria = new UserFoldCriteria();
			UserFoldCriteria.Criteria criteriaFold = userFoldCriteria.createCriteria();
			criteriaFold.andUserFoldIdIn(userFoldIds);
			int result = userFoldMapper.updateByExampleSelective(userFold, userFoldCriteria);
			sqlSession.commit();
		} catch (Exception e) {
			if (sqlSession != null) {
				sqlSession.rollback();
			}
			MybatisManager.log.error("修改父类文件夹异常", e);
			return false;
		} finally {
			if (sqlSession != null) {
				sqlSession.close();
			}
		}
		return true;
	}
}
