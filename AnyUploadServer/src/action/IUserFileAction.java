package action;

import java.io.File;

import dao.model.base.FileBase;
import dao.model.ext.UserFileExt;

public interface IUserFileAction {
	/**
	 * 根据md5获取已经存在并且上传完成的
	 * 
	 * @param fileBaseMd5
	 * @return
	 */
	public FileBase getFileBaseByMd5(String fileBaseMd5);

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

	/**
	 * 创建文件
	 * 
	 * @param userFileName
	 *            文件名
	 * @param userFoldParentId
	 *            文件夹id一般传空
	 * @param createUserId
	 *            谁创建的
	 * @param fileBaseMd5
	 *            文件md5码
	 * @param fileBaseTotalSize
	 *            文件总大小
	 * @param fileBase
	 *            基础文件对象
	 * @return
	 */
	public UserFileExt createUserFile(String userFileName, String userFoldParentId, String createUserId, String fileBaseMd5, long fileBaseTotalSize, FileBase fileBase);

	/**
	 * 改变文件指向
	 * 
	 * @param userFile
	 * @param fileBase
	 * @return
	 */
	public boolean changeFileBase(UserFileExt userFile, FileBase fileBase);

	/**
	 * 创建一个存储地址
	 */
	public void createFileBaseDir();

	/**
	 * 获取真实文件
	 * 
	 * @param fileBaseRealPath
	 * @return
	 */
	public File getFile(String fileBaseRealPath);

	/**
	 * 写入文件块
	 * 
	 * @param file
	 * @param chunkFile
	 * @return
	 */
	public boolean updateFile(File file, File chunkFile);

	/**
	 * 更新filebase
	 * 
	 * @param userFile
	 * @param uploadLength
	 * @return
	 */
	public boolean updateUserFile(UserFileExt userFile, int uploadLength);
}
