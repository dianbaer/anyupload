package org.anyupload;

import java.util.Date;

public class UserFile {
	/**
	 * uuid
	 */
	private String userFileId;
	/**
	 * 文件名
	 */
	private String userFileName;
	/**
	 * 父类文件夹（没用）
	 */
	private String userFoldParentId;
	/**
	 * 创建时间
	 */
	private Date userFileCreateTime;
	/**
	 * 更新时间
	 */
	private Date userFileUpdateTime;
	/**
	 * 文件状态（没用）
	 */
	private int userFileState;
	/**
	 * 顶级文件夹id（没用）
	 */
	private String userFoldTopId;
	/**
	 * 创建者（没用）
	 */
	private String createUserId;
	/**
	 * 基础文件id（没用）
	 */
	private String fileBaseId;
	/**
	 * 基础文件对象
	 */
	private FileBase fileBase;

	public String getUserFileId() {
		return userFileId;
	}

	public void setUserFileId(String userFileId) {
		this.userFileId = userFileId;
	}

	public String getUserFileName() {
		return userFileName;
	}

	public void setUserFileName(String userFileName) {
		this.userFileName = userFileName;
	}

	public String getUserFoldParentId() {
		return userFoldParentId;
	}

	public void setUserFoldParentId(String userFoldParentId) {
		this.userFoldParentId = userFoldParentId;
	}

	public Date getUserFileCreateTime() {
		return userFileCreateTime;
	}

	public void setUserFileCreateTime(Date userFileCreateTime) {
		this.userFileCreateTime = userFileCreateTime;
	}

	public Date getUserFileUpdateTime() {
		return userFileUpdateTime;
	}

	public void setUserFileUpdateTime(Date userFileUpdateTime) {
		this.userFileUpdateTime = userFileUpdateTime;
	}

	public int getUserFileState() {
		return userFileState;
	}

	public void setUserFileState(int userFileState) {
		this.userFileState = userFileState;
	}

	public String getUserFoldTopId() {
		return userFoldTopId;
	}

	public void setUserFoldTopId(String userFoldTopId) {
		this.userFoldTopId = userFoldTopId;
	}

	public String getCreateUserId() {
		return createUserId;
	}

	public void setCreateUserId(String createUserId) {
		this.createUserId = createUserId;
	}

	public String getFileBaseId() {
		return fileBaseId;
	}

	public void setFileBaseId(String fileBaseId) {
		this.fileBaseId = fileBaseId;
	}

	public FileBase getFileBase() {
		return fileBase;
	}

	public void setFileBase(FileBase fileBase) {
		this.fileBase = fileBase;
	}

}
