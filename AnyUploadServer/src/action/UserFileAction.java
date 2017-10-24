package action;

import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.IOException;
import java.util.Date;
import java.util.List;

import org.apache.ibatis.session.SqlSession;
import org.grain.httpserver.HttpConfig;
import org.grain.mariadb.MybatisManager;

import config.CommonConfigBox;
import config.FileBaseConfig;
import config.UserFileConfig;
import dao.dao.base.FileBaseMapper;
import dao.dao.base.UserFileMapper;
import dao.dao.ext.UserFileMapperExt;
import dao.model.base.FileBase;
import dao.model.base.UserFile;
import dao.model.base.UserFileCriteria;
import dao.model.base.UserFold;
import dao.model.ext.UserFileExt;
import protobuf.http.UserFoldProto.FileData;
import protobuf.http.UserFoldProto.UserFileData;
import tool.StringUtil;
import tool.TimeUtils;
import util.IdUtil;

public class UserFileAction {
	public static String FILE_BASE_PATH;

	public static List<UserFileExt> getUserFoldChildren(String userFoldParentId) {
		if (StringUtil.stringIsNull(userFoldParentId)) {
			return null;
		}
		SqlSession sqlSession = null;
		try {
			sqlSession = MybatisManager.getSqlSession();
			UserFileMapperExt userFileMapperExt = sqlSession.getMapper(UserFileMapperExt.class);
			List<UserFileExt> userFileList = userFileMapperExt.selectByUserFoldParentId(userFoldParentId);
			return userFileList;
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

	public static List<UserFileExt> getRecycleBinUserFile(String userFoldTopId) {
		if (StringUtil.stringIsNull(userFoldTopId)) {
			return null;
		}
		SqlSession sqlSession = null;
		try {
			sqlSession = MybatisManager.getSqlSession();
			UserFileMapperExt userFileMapperExt = sqlSession.getMapper(UserFileMapperExt.class);
			List<UserFileExt> userFileList = userFileMapperExt.selectRecycleBinByUserFoldTopId(userFoldTopId);
			return userFileList;
		} catch (Exception e) {
			if (sqlSession != null) {
				sqlSession.rollback();
			}
			MybatisManager.log.error("查询回收站文件失败", e);
			return null;
		} finally {
			if (sqlSession != null) {
				sqlSession.close();
			}
		}
	}

	public static UserFileData.Builder getUserFileBuilder(UserFileExt userFile) {
		UserFileData.Builder dataBuilder = UserFileData.newBuilder();
		dataBuilder.setUserFileId(userFile.getUserFileId());
		dataBuilder.setUserFileName(userFile.getUserFileName());
		dataBuilder.setUserFoldParentId(userFile.getUserFoldParentId());
		dataBuilder.setUserFileCreateTime(TimeUtils.dateToString(userFile.getUserFileCreateTime()));
		dataBuilder.setUserFileUpdateTime(TimeUtils.dateToString(userFile.getUserFileUpdateTime()));
		dataBuilder.setUserFileState(userFile.getUserFileState());
		dataBuilder.setUserFoldTopId(userFile.getUserFoldTopId());
		dataBuilder.setCreateUserId(userFile.getCreateUserId());
		dataBuilder.setUserFileUpdateTimeStamp(userFile.getUserFileUpdateTime().getTime());
		FileData.Builder fileDataBuilder = FileData.newBuilder();
		fileDataBuilder.setFileBaseId(userFile.getFileBase().getFileBaseId());
		fileDataBuilder.setFileBaseRealPath(userFile.getFileBase().getFileBaseRealPath());
		fileDataBuilder.setFileBaseMd5(userFile.getFileBase().getFileBaseMd5());
		fileDataBuilder.setFileBaseState(userFile.getFileBase().getFileBaseState());
		fileDataBuilder.setFileBaseTotalSize(userFile.getFileBase().getFileBaseTotalSize());
		fileDataBuilder.setFileBasePos(userFile.getFileBase().getFileBasePos());
		dataBuilder.setFileBase(fileDataBuilder);
		return dataBuilder;
	}

	public static UserFileExt getUserFile(String userFileId) {
		if (StringUtil.stringIsNull(userFileId)) {
			return null;
		}
		SqlSession sqlSession = null;
		try {
			sqlSession = MybatisManager.getSqlSession();
			UserFileMapperExt userFileMapperExt = sqlSession.getMapper(UserFileMapperExt.class);
			UserFileExt userFile = userFileMapperExt.selectByPrimaryKey(userFileId);
			return userFile;
		} catch (Exception e) {
			if (sqlSession != null) {
				sqlSession.rollback();
			}
			MybatisManager.log.error("查询文件失败", e);
			return null;
		} finally {
			if (sqlSession != null) {
				sqlSession.close();
			}
		}
	}

	public static UserFileExt getUserFileComplete(String userFileId) {
		if (StringUtil.stringIsNull(userFileId)) {
			return null;
		}
		SqlSession sqlSession = null;
		try {
			sqlSession = MybatisManager.getSqlSession();
			UserFileMapperExt userFileMapperExt = sqlSession.getMapper(UserFileMapperExt.class);
			UserFileExt userFile = userFileMapperExt.selectByPrimaryKeyComplete(userFileId);
			return userFile;
		} catch (Exception e) {
			if (sqlSession != null) {
				sqlSession.rollback();
			}
			MybatisManager.log.error("查询文件失败", e);
			return null;
		} finally {
			if (sqlSession != null) {
				sqlSession.close();
			}
		}
	}

	public static UserFileExt createUserFile(String userFileName, String userFoldParentId, String createUserId, String fileBaseMd5, long fileBaseTotalSize, FileBase fileBase) {
		if (StringUtil.stringIsNull(userFileName) || StringUtil.stringIsNull(userFoldParentId) || StringUtil.stringIsNull(createUserId) || StringUtil.stringIsNull(fileBaseMd5)) {
			return null;
		}
		UserFold parentUserFold = UserFoldAction.getUserFoldById(userFoldParentId);
		if (parentUserFold == null) {
			return null;
		}
		UserFileExt userFile = new UserFileExt();
		Date date = new Date();
		userFile.setUserFileId(IdUtil.getUuid());
		userFile.setUserFileName(userFileName);
		userFile.setUserFoldParentId(parentUserFold.getUserFoldId());
		userFile.setUserFileCreateTime(date);
		userFile.setUserFileUpdateTime(date);
		userFile.setUserFileState((byte) UserFileConfig.STATE_CAN_USE);
		if (StringUtil.stringIsNull(parentUserFold.getUserFoldTopId())) {
			userFile.setUserFoldTopId(parentUserFold.getUserFoldId());
		} else {
			userFile.setUserFoldTopId(parentUserFold.getUserFoldTopId());
		}
		userFile.setCreateUserId(createUserId);
		if (fileBase == null) {

			FileBase newFileBase = new FileBase();
			newFileBase.setFileBaseId(IdUtil.getUuid());
			String fileBaseRealPath = createFile(getFileName(userFileName, newFileBase.getFileBaseId()));
			if (fileBaseRealPath == null) {
				return null;
			}
			newFileBase.setFileBaseRealPath(fileBaseRealPath);
			newFileBase.setFileBaseMd5(fileBaseMd5);
			newFileBase.setFileBaseState((byte) FileBaseConfig.STATE_UPLOADING);
			newFileBase.setFileBaseTotalSize(fileBaseTotalSize);
			newFileBase.setFileBasePos(0L);
			newFileBase.setFileBaseCreateTime(date);
			newFileBase.setFileBaseNextUploadTime(date);
			userFile.setFileBaseId(newFileBase.getFileBaseId());
			userFile.setFileBase(newFileBase);
		} else {
			userFile.setFileBaseId(fileBase.getFileBaseId());
		}
		SqlSession sqlSession = null;
		try {
			sqlSession = MybatisManager.getSqlSession();
			UserFileMapper userFileMapper = sqlSession.getMapper(UserFileMapper.class);
			FileBaseMapper fileBaseMapper = sqlSession.getMapper(FileBaseMapper.class);
			int result;
			// 需要创建基础文件
			if (userFile.getFileBase() != null) {
				result = fileBaseMapper.insert(userFile.getFileBase());
				if (result != 1) {
					throw new Exception("插入filebase异常");
				}
			}
			result = userFileMapper.insert(userFile);
			if (result != 1) {
				throw new Exception("插入userfile异常");
			}
			sqlSession.commit();
		} catch (Exception e) {
			if (sqlSession != null) {
				sqlSession.rollback();
			}
			MybatisManager.log.error("创建文件失败", e);
			if (userFile.getFileBase() != null) {
				deleteFile(userFile.getFileBase().getFileBaseRealPath());
			}
			return null;
		} finally {
			if (sqlSession != null) {
				sqlSession.close();
			}
		}
		return userFile;
	}

	public static boolean changeFileBase(String userFileId, String fileBaseId) {
		if (StringUtil.stringIsNull(userFileId) || StringUtil.stringIsNull(fileBaseId)) {
			return false;
		}
		UserFileExt userFile = new UserFileExt();
		Date date = new Date();
		userFile.setUserFileId(userFileId);
		userFile.setUserFileUpdateTime(date);
		userFile.setFileBaseId(fileBaseId);

		SqlSession sqlSession = null;
		try {
			sqlSession = MybatisManager.getSqlSession();
			UserFileMapper userFileMapper = sqlSession.getMapper(UserFileMapper.class);
			int result = userFileMapper.updateByPrimaryKeySelective(userFile);
			if (result != 1) {
				MybatisManager.log.warn("修改文件失败");
				return false;
			}
			sqlSession.commit();
		} catch (Exception e) {
			if (sqlSession != null) {
				sqlSession.rollback();
			}
			MybatisManager.log.error("修改文件异常", e);
			return false;
		} finally {
			if (sqlSession != null) {
				sqlSession.close();
			}
		}
		return true;
	}

	public static boolean updateFile(File file, File chunkFile) {
		FileOutputStream fileOutputStream = null;
		FileInputStream fileInputStream = null;
		try {
			fileOutputStream = new FileOutputStream(file, true);
			fileInputStream = new FileInputStream(chunkFile);

			byte[] buffer = new byte[CommonConfigBox.ONCE_WRITE_FILE_SIZE];
			int bytesRead = -1;
			while ((bytesRead = fileInputStream.read(buffer)) != -1) {
				fileOutputStream.write(buffer, 0, bytesRead);
			}
			fileOutputStream.flush();
			return true;
		} catch (Exception e) {
			MybatisManager.log.error("修改文件失败", e);
			return false;
		} finally {
			if (fileInputStream != null) {
				try {
					fileInputStream.close();
				} catch (IOException e) {
					MybatisManager.log.error("关闭块文件输入流失败", e);
				}
			}
			if (fileOutputStream != null) {
				try {
					fileOutputStream.close();
				} catch (IOException e) {
					MybatisManager.log.error("关闭输出流失败", e);
				}
			}
		}
	}

	public static boolean updateUserFile(UserFileExt userFile, int uploadLength) {
		FileBase fileBase = new FileBase();
		fileBase.setFileBaseId(userFile.getFileBase().getFileBaseId());
		Date date = new Date();
		fileBase.setFileBasePos(userFile.getFileBase().getFileBasePos() + uploadLength);
		// 已完成
		if (fileBase.getFileBasePos().longValue() == userFile.getFileBase().getFileBaseTotalSize().longValue()) {
			fileBase.setFileBaseNextUploadTime(null);
			fileBase.setFileBaseCompleteTime(date);
			fileBase.setFileBaseState((byte) FileBaseConfig.STATE_COMPLETE);
		} else {
			long fileBaseNextUploadTimeLong = date.getTime() + CommonConfigBox.WAIT_TIME;
			Date fileBaseNextUploadTime = new Date(fileBaseNextUploadTimeLong);
			fileBase.setFileBaseNextUploadTime(fileBaseNextUploadTime);
		}

		SqlSession sqlSession = null;
		try {
			sqlSession = MybatisManager.getSqlSession();
			FileBaseMapper fileBaseMapper = sqlSession.getMapper(FileBaseMapper.class);
			int result = fileBaseMapper.updateByPrimaryKeySelective(fileBase);
			if (result != 1) {
				MybatisManager.log.warn("修改基础文件失败");
				return false;
			}
			sqlSession.commit();
		} catch (Exception e) {
			if (sqlSession != null) {
				sqlSession.rollback();
			}
			MybatisManager.log.error("修改基础文件异常", e);
			return false;
		} finally {
			if (sqlSession != null) {
				sqlSession.close();
			}
		}
		return true;
	}

	public static void createFileBaseDir() {
		FILE_BASE_PATH = HttpConfig.PROJECT_PATH + "/" + CommonConfigBox.FILE_BASE_PATH;
		File file = new File(FILE_BASE_PATH);
		if (!file.exists()) {
			file.mkdirs();
		}
	}

	public static String getFileName(String userFileName, String fileBaseId) {
		int postfixIndex = userFileName.lastIndexOf(".");
		String postfix = userFileName.substring(postfixIndex);
		return fileBaseId + postfix;
	}

	public static String getFoldName() {
		Date date = new Date();
		String foldName = TimeUtils.dateToStringDay(date);
		return foldName;
	}

	public static String createFile(String fileName) {
		String foldName = getFoldName();
		boolean result = createFold(foldName);
		if (!result) {
			return null;
		}
		File file = new File(FILE_BASE_PATH + "/" + foldName + "/" + fileName);
		try {
			result = file.createNewFile();
			if (result) {
				return foldName + "/" + fileName;
			} else {
				return null;
			}
		} catch (IOException e) {
			MybatisManager.log.error("创建文件异常", e);
			return null;
		}
	}

	public static File getFile(String fileBaseRealPath) {
		File file = new File(FILE_BASE_PATH + "/" + fileBaseRealPath);
		if (file.exists()) {
			return file;
		} else {
			return null;
		}
	}

	public static boolean deleteFile(String fileBaseRealPath) {
		File file = new File(FILE_BASE_PATH + "/" + fileBaseRealPath);
		try {
			return file.delete();
		} catch (Exception e) {
			MybatisManager.log.error("删除文件异常", e);
			return false;
		}

	}

	public static boolean createFold(String name) {
		File file = new File(FILE_BASE_PATH + "/" + name);
		try {
			if (!file.exists()) {
				file.mkdirs();
			}
			return true;
		} catch (Exception e) {
			MybatisManager.log.error("创建文件夹异常", e);
			return false;
		}

	}

	public static UserFileExt updateUserFile(String userFileId, String userFileName, int userFileState, boolean isUpdateUserFoldParent, String userFoldParentId) {
		if (StringUtil.stringIsNull(userFileId)) {
			return null;
		}
		UserFileExt userFile = getUserFileComplete(userFileId);
		if (userFile == null) {
			return null;
		}
		// 顶级不可能为空
		if (userFile.getUserFoldTopId() == null) {
			return null;
		}
		UserFileExt userFileNew = new UserFileExt();
		userFileNew.setUserFileId(userFileId);
		Date date = new Date();
		userFileNew.setUserFileUpdateTime(date);
		if (!StringUtil.stringIsNull(userFileName)) {
			userFileNew.setUserFileName(userFileName);
		}
		if (userFileState == UserFileConfig.STATE_CAN_USE || userFileState == UserFileConfig.STATE_IN_RECYCLEBIN || userFileState == UserFileConfig.STATE_DELETE) {
			userFileNew.setUserFileState((byte) userFileState);
		}
		if (isUpdateUserFoldParent) {
			// 如果是空，就说明是放到顶级文件夹
			if (StringUtil.stringIsNull(userFoldParentId)) {
				userFoldParentId = userFile.getUserFoldTopId();
			}
			UserFold parentUserFold = UserFoldAction.getUserFoldById(userFoldParentId);
			if (parentUserFold == null) {
				return null;
			}
			userFileNew.setUserFoldParentId(parentUserFold.getUserFoldId());
		}
		SqlSession sqlSession = null;
		try {
			sqlSession = MybatisManager.getSqlSession();
			UserFileMapper userFileMapper = sqlSession.getMapper(UserFileMapper.class);
			int result = userFileMapper.updateByPrimaryKeySelective(userFileNew);
			if (result != 1) {
				MybatisManager.log.warn("修改文件失败");
				return null;
			}
			sqlSession.commit();
		} catch (Exception e) {
			if (sqlSession != null) {
				sqlSession.rollback();
			}
			MybatisManager.log.error("修改文件异常", e);
			return null;
		} finally {
			if (sqlSession != null) {
				sqlSession.close();
			}
		}
		return getUserFileComplete(userFileNew.getUserFileId());
	}

	public static boolean clearRecycleBin(String userFoldTopId) {
		SqlSession sqlSession = null;
		UserFile userFile = new UserFile();
		Date date = new Date();
		userFile.setUserFileState((byte) UserFileConfig.STATE_DELETE);
		userFile.setUserFileUpdateTime(date);
		try {
			sqlSession = MybatisManager.getSqlSession();
			UserFileMapper userFileMapper = sqlSession.getMapper(UserFileMapper.class);
			UserFileCriteria userFileCriteria = new UserFileCriteria();
			UserFileCriteria.Criteria criteriaFile = userFileCriteria.createCriteria();
			criteriaFile.andUserFoldTopIdEqualTo(userFoldTopId).andUserFileStateEqualTo((byte) UserFileConfig.STATE_IN_RECYCLEBIN);
			int result = userFileMapper.updateByExampleSelective(userFile, userFileCriteria);
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

	public static boolean updateUserFileListState(List<String> userFileIds, int userFileState) {
		if (userFileState != UserFileConfig.STATE_CAN_USE && userFileState != UserFileConfig.STATE_IN_RECYCLEBIN && userFileState != UserFileConfig.STATE_DELETE) {
			return false;
		}
		SqlSession sqlSession = null;
		UserFile userFile = new UserFile();
		Date date = new Date();
		userFile.setUserFileState((byte) userFileState);
		userFile.setUserFileUpdateTime(date);
		try {
			sqlSession = MybatisManager.getSqlSession();
			UserFileMapper userFileMapper = sqlSession.getMapper(UserFileMapper.class);
			UserFileCriteria userFileCriteria = new UserFileCriteria();
			UserFileCriteria.Criteria criteriaFile = userFileCriteria.createCriteria();
			criteriaFile.andUserFileIdIn(userFileIds);
			int result = userFileMapper.updateByExampleSelective(userFile, userFileCriteria);
			sqlSession.commit();
		} catch (Exception e) {
			if (sqlSession != null) {
				sqlSession.rollback();
			}
			MybatisManager.log.error("修改文件状态失败", e);
			return false;
		} finally {
			if (sqlSession != null) {
				sqlSession.close();
			}
		}
		return true;
	}

	public static boolean updateUserFileListParentId(List<String> userFileIds, String userFoldParentId) {
		if (StringUtil.stringIsNull(userFoldParentId)) {
			return false;
		}
		UserFold parentUserFold = UserFoldAction.getUserFoldById(userFoldParentId);
		if (parentUserFold == null) {
			return false;
		}
		SqlSession sqlSession = null;
		UserFile userFile = new UserFile();
		Date date = new Date();
		userFile.setUserFoldParentId(userFoldParentId);
		userFile.setUserFileUpdateTime(date);
		try {
			sqlSession = MybatisManager.getSqlSession();
			UserFileMapper userFileMapper = sqlSession.getMapper(UserFileMapper.class);
			UserFileCriteria userFileCriteria = new UserFileCriteria();
			UserFileCriteria.Criteria criteriaFile = userFileCriteria.createCriteria();
			criteriaFile.andUserFileIdIn(userFileIds);
			int result = userFileMapper.updateByExampleSelective(userFile, userFileCriteria);
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

	public static Long getUserFileTotalSize(String userFoldTopId) {
		if (StringUtil.stringIsNull(userFoldTopId)) {
			return null;
		}
		SqlSession sqlSession = null;
		try {
			sqlSession = MybatisManager.getSqlSession();
			UserFileMapperExt userFileMapperExt = sqlSession.getMapper(UserFileMapperExt.class);
			return userFileMapperExt.countSize(userFoldTopId);
		} catch (Exception e) {
			if (sqlSession != null) {
				sqlSession.rollback();
			}
			MybatisManager.log.error("查询所有文件大小失败", e);
			return null;
		} finally {
			if (sqlSession != null) {
				sqlSession.close();
			}
		}

	}

}
