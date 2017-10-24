package dao.dao.ext;

import java.util.List;

import dao.model.ext.UserFoldExt;

public interface UserFoldMapperExt {
	List<UserFoldExt> selectByUserFoldParentId(String userFoldParentId);
}