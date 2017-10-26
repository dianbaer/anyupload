package org.anyupload;

import java.util.Date;

public class FileBase {
	/**
	 * uuid
	 */
	private String fileBaseId;
	/**
	 * 真实路径
	 */
	private String fileBaseRealPath;
	/**
	 * md5
	 */
	private String fileBaseMd5;
	/**
	 * 当前状态1完成，2正在上传
	 */
	private int fileBaseState;
	/**
	 * 总大小
	 */
	private long fileBaseTotalSize;
	/**
	 * 当前上传位置
	 */
	private long fileBasePos;
	/**
	 * 创建时间
	 */
	private Date fileBaseCreateTime;
	/**
	 * 完成时间
	 */
	private Date fileBaseCompleteTime;
	/**
	 * 下一次上传时间
	 */
	private Date fileBaseNextUploadTime;

	public String getFileBaseId() {
		return fileBaseId;
	}

	public void setFileBaseId(String fileBaseId) {
		this.fileBaseId = fileBaseId;
	}

	public String getFileBaseRealPath() {
		return fileBaseRealPath;
	}

	public void setFileBaseRealPath(String fileBaseRealPath) {
		this.fileBaseRealPath = fileBaseRealPath;
	}

	public String getFileBaseMd5() {
		return fileBaseMd5;
	}

	public void setFileBaseMd5(String fileBaseMd5) {
		this.fileBaseMd5 = fileBaseMd5;
	}

	public int getFileBaseState() {
		return fileBaseState;
	}

	public void setFileBaseState(int fileBaseState) {
		this.fileBaseState = fileBaseState;
	}

	public long getFileBaseTotalSize() {
		return fileBaseTotalSize;
	}

	public void setFileBaseTotalSize(long fileBaseTotalSize) {
		this.fileBaseTotalSize = fileBaseTotalSize;
	}

	public long getFileBasePos() {
		return fileBasePos;
	}

	public void setFileBasePos(long fileBasePos) {
		this.fileBasePos = fileBasePos;
	}

	public Date getFileBaseCreateTime() {
		return fileBaseCreateTime;
	}

	public void setFileBaseCreateTime(Date fileBaseCreateTime) {
		this.fileBaseCreateTime = fileBaseCreateTime;
	}

	public Date getFileBaseCompleteTime() {
		return fileBaseCompleteTime;
	}

	public void setFileBaseCompleteTime(Date fileBaseCompleteTime) {
		this.fileBaseCompleteTime = fileBaseCompleteTime;
	}

	public Date getFileBaseNextUploadTime() {
		return fileBaseNextUploadTime;
	}

	public void setFileBaseNextUploadTime(Date fileBaseNextUploadTime) {
		this.fileBaseNextUploadTime = fileBaseNextUploadTime;
	}

}