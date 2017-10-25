package dao.model.base;

import java.util.Date;

public class FileBase {

	private String fileBaseId;

	private String fileBaseRealPath;

	private String fileBaseMd5;

	private int fileBaseState;

	private long fileBaseTotalSize;

	private long fileBasePos;

	private Date fileBaseCreateTime;

	private Date fileBaseCompleteTime;

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