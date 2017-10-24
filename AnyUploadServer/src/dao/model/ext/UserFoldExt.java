package dao.model.ext;

import dao.model.base.UserFold;

public class UserFoldExt extends UserFold {

	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;
	private Integer childrenNum;

	public Integer getChildrenNum() {
		return childrenNum;
	}

	public void setChildrenNum(Integer childrenNum) {
		this.childrenNum = childrenNum;
	}

}
