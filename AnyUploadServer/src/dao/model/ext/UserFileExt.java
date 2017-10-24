package dao.model.ext;

import dao.model.base.FileBase;
import dao.model.base.UserFile;

public class UserFileExt extends UserFile {

	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;
	private FileBase fileBase;

	public FileBase getFileBase() {
		return fileBase;
	}

	public void setFileBase(FileBase fileBase) {
		this.fileBase = fileBase;
	}

}
