package dao.dao.ext;

import java.util.List;

import dao.model.ext.UserFileExt;

public interface UserFileMapperExt {
	List<UserFileExt> selectByUserFoldParentId(String userFoldParentId);

	List<UserFileExt> selectRecycleBinByUserFoldTopId(String userFoldTopId);

	UserFileExt selectByPrimaryKey(String userFileId);

	UserFileExt selectByPrimaryKeyComplete(String userFileId);

	Long countSize(String userFoldTopId);
}