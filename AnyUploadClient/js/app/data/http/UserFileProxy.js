function UserFileProxy() {
    this.NAME = "UserFileProxy";

    this.updateUserFile = function (userFileId, userFileName, userFileState, isUpdateUserFoldParent, userFoldParentId) {
        var data = {
            "hOpCode": 50007,
            "userFileId": userFileId,
            "userFileName": userFileName,
            "isUpdateUserFoldParent": isUpdateUserFoldParent == "1" ? true : false,
            "userFoldParentId": userFoldParentId,
            "userFileState": userFileState
        };

        var sendParam = new SendParam();
        sendParam.successHandle = this.updateUserFileSuccess;
        sendParam.failHandle = this.updateUserFileFail;
        sendParam.object = this;
        sendParam.data = data;
        sendParam.token = $T.cookieParam.getCookieParam($T.cookieName.TOKEN);
        sendParam.url = $T.url.boxUrl;
        sendParam.canContinuous = true;
        $T.httpUtil.send(sendParam);
    }
    this.updateUserFileSuccess = function (result, sendParam) {
        $T.userFoldProxy.getUserFoldChildren($T.fileSystemStatus.nowFoldId);
    }
    this.updateUserFileFail = function (result, sendParam) {

    }
    this.getUserFile = function (userFileId) {
        var data = {
            "hOpCode": 50008,
            "userFileId": userFileId
        };
        var sendParam = new SendParam();
        sendParam.data = data;
        sendParam.url = $T.url.boxUrl;
        sendParam.token = $T.cookieParam.getCookieParam($T.cookieName.TOKEN);
        sendParam.sendType = $T.httpConfig.SEND_TYPE_PACKET;
        sendParam.receiveType = $T.httpConfig.RECEIVE_TYPE_FILE;
        return $T.httpUtil.getRequestUrl(sendParam);
    }
    this.getUserFileImage = function (userFileId) {
        var data = {
            "hOpCode": 50008,
            "userFileId": userFileId
        };
        var sendParam = new SendParam();
        sendParam.data = data;
        sendParam.url = $T.url.boxUrl;
        sendParam.token = $T.cookieParam.getCookieParam($T.cookieName.TOKEN);
        sendParam.sendType = $T.httpConfig.SEND_TYPE_PACKET;
        sendParam.receiveType = $T.httpConfig.RECEIVE_TYPE_IMAGE;
        return $T.httpUtil.getRequestUrl(sendParam);
    }
}
$T.userFileProxy = new UserFileProxy();