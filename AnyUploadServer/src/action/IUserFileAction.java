package action;

import dao.model.ext.UserFileExt;

public interface IUserFileAction {
	/**
	 * 根据文件id获取文件
	 * 
	 * @param userFileId
	 * @return
	 */
	public UserFileExt getUserFile(String userFileId);

	/**
	 * 获取已经完成的文件，如果未完成返回空
	 * 
	 * @param userFileId
	 * @return
	 */
	public UserFileExt getUserFileComplete(String userFileId);
}
