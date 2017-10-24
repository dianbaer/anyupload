function UploadFileProxy() {
    this.NAME = "UploadFileProxy";
    this.checkMD5 = function (uploadFileId, fileBaseMd5, userFileName, userFoldParentId, fileBaseTotalSize, userFileId) {
        var data = {
            "hOpCode": 50000,
            "fileBaseMd5": fileBaseMd5,
            "userFileName": userFileName,
            "userFoldParentId": userFoldParentId,
            "fileBaseTotalSize": fileBaseTotalSize,
            "userFileId": userFileId
        };
        var sendParam = new SendParam();
        sendParam.successHandle = this.checkMD5Success;
        sendParam.failHandle = this.checkMD5Fail;
        sendParam.object = this;
        sendParam.data = data;
        sendParam.url = $T.url.boxUrl;
        // 用于确认回调到底是哪个文件的消息
        sendParam.uploadFileId = uploadFileId;
        sendParam.token = $T.cookieParam.getCookieParam($T.cookieName.TOKEN);
        sendParam.canContinuous = true;
        $T.httpUtil.send(sendParam);
        // var result = {
        // "hOpCode" : 50000,
        // "result" : 2,
        // "fileBasePos" : 0,
        // "uploadMaxLength" : 65536,
        // "userFileId" : Math.uuid()
        // }
        // this.checkMD5Success(result, sendParam);
    }
    this.checkMD5Success = function (result, sendParam) {
        if (result.fileBasePos == null) {
            result.fileBasePos = 0;
        }
        $T.viewManager.notifyObservers($T.viewManager.getNotification($T.notificationExt.MD5_CHECK_SUCCESS, {
            "result": result,
            "sendParam": sendParam
        }));
    }
    this.checkMD5Fail = function (result, sendParam) {
        $T.viewManager.notifyObservers($T.viewManager.getNotification($T.notificationExt.MD5_CHECK_FAIL, {
            "result": result,
            "sendParam": sendParam
        }));
    }
    this.uploadFile = function (uploadFileId, userFileId, fileBasePos, uploadLength, fileArray) {
        var data = {
            "hOpCode": 50001,
            "userFileId": userFileId,
            "fileBasePos": fileBasePos,
            "uploadLength": uploadLength
        };
        var sendParam = new SendParam();
        sendParam.successHandle = this.uploadFileSuccess;
        sendParam.failHandle = this.uploadFileFail;
        sendParam.object = this;
        sendParam.data = data;
        sendParam.url = $T.url.boxUrl;
        // 用于确认回调到底是哪个文件的消息
        sendParam.uploadFileId = uploadFileId;
        sendParam.fileArray = fileArray;
        sendParam.token = $T.cookieParam.getCookieParam($T.cookieName.TOKEN);
        sendParam.canContinuous = true;
        $T.httpUtil.send(sendParam);
        // var result = {
        // "hOpCode" : 50001,
        // "result" : 2,
        // "fileBasePos" : fileBasePos + uploadLength,
        // "uploadMaxLength" : 65536,
        // "userFileId" : userFileId,
        // "waitTime" : 640
        // };
        // this.uploadFileSuccess(result, sendParam);
    }
    this.uploadFileSuccess = function (result, sendParam) {
        if (result.fileBasePos == null) {
            result.fileBasePos = 0;
        }
        $T.viewManager.notifyObservers($T.viewManager.getNotification($T.notificationExt.UPLOAD_FILE_SUCCESS, {
            "result": result,
            "sendParam": sendParam
        }));
    }
    this.uploadFileFail = function (result, sendParam) {
        $T.viewManager.notifyObservers($T.viewManager.getNotification($T.notificationExt.UPLOAD_FILE_FAIL, {
            "result": result,
            "sendParam": sendParam
        }));
    }
}
$T.uploadFileProxy = new UploadFileProxy();