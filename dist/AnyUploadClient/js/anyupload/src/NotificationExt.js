(function (window) {
    if (!window.anyupload) window.anyupload = {};
    var NotificationExt = function () {
        this.MD5_CHECK_SUCCESS = "md5CheckSuccess";
        this.MD5_CHECK_FAIL = "md5CheckFail";
        this.UPLOAD_FILE_SUCCESS = "uploadFileSuccess";
        this.UPLOAD_FILE_FAIL = "uploadFileFail";
    };
    window.anyupload.notificationExt = new NotificationExt();
})(window);