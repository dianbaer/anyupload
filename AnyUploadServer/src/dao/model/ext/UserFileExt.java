package dao.model.ext;

import java.util.Date;

import dao.model.base.FileBase;

public class UserFileExt {

	private String userFileId;

	private String userFileName;

	private String userFoldParentId;

	private Date userFileCreateTime;

	private Date userFileUpdateTime;

	private int userFileState;

	private String userFoldTopId;

	private String createUserId;

	private String fileBaseId;

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
