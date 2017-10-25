function UploadEventType() {
    /** 加入等待md5队列 */
    this.ADD_WAIT_MD5_ARRAY = "addWaitMd5Array";

    this.ADD_MD5_CHECK_ARRAY_AND_LOAD = "addMd5CheckArrayAndLoad";
    this.ADD_MD5_CHECK_ARRAY = "addMd5CheckArray";
    this.ADD_WAIT_CHECK_ARRAY = "addWaitCheckArray";
    this.ADD_CHECK_ARRAY = "addCheckArray";
    this.ADD_WAIT_UPLOAD_ARRAY = "addWaitUploadArray";
    this.ADD_UPLOAD_ARRAY = "addUploadArray";
    this.UPLOAD_COMPLETE = "uploadComplete";
    this.OPEN_UPLOAD_BOX = "openUploadBox";
    this.CHANGE_USER_FOLD = "changeUserFold";
    this.OPEN_CANCEL_CHOOSE_BOX = "openCancelChooseBox";
    this.REMOVE_VIEW1 = "REMOVE_VIEW1";
}
$T.uploadEventType = new UploadEventType();