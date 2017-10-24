package action;

import dao.model.base.FileBase;

public interface IFileBaseAction {
	/**
	 * 根据md5获取已经存在并且上传完成的
	 * 
	 * @param fileBaseMd5
	 * @return
	 */
	public FileBase getFileBaseByMd5(String fileBaseMd5);
}
