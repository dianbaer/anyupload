function MutliOperateProxy() {
    this.NAME = "MutliOperateProxy";
    this.clearRecyclebin = function (userFoldTopId) {
        var data = {
            "hOpCode": 50013,
            "userFoldTopId": userFoldTopId
        };

        var sendParam = new SendParam();
        sendParam.successHandle = this.clearRecyclebinSuccess;
        sendParam.failHandle = this.clearRecyclebinFail;
        sendParam.object = this;
        sendParam.data = data;
        sendParam.token = $T.cookieParam.getCookieParam($T.cookieName.TOKEN);
        sendParam.url = $T.url.boxUrl;
        sendParam.canContinuous = true;
        $T.httpUtil.send(sendParam);
    }
    this.clearRecyclebinSuccess = function (result, sendParam) {
        $T.userFoldProxy.getRecycleBin($T.cookieParam.getCookieParam($T.cookieName.USER_FOLD_TOP_ID));
        $T.boxInfoProxy.getBoxInfo($T.cookieParam.getCookieParam($T.cookieName.USER_FOLD_TOP_ID));
    }
    this.clearRecyclebinFail = function (result, sendParam) {

    }
    this.toRecyclebin = function (userFoldIds, userFileIds) {
        var data = {
            "hOpCode": 50009,
            "userFoldIds": userFoldIds,
            "userFileIds": userFileIds
        };

        var sendParam = new SendParam();
        sendParam.successHandle = this.toRecyclebinSuccess;
        sendParam.failHandle = this.toRecyclebinFail;
        sendParam.object = this;
        sendParam.data = data;
        sendParam.token = $T.cookieParam.getCookieParam($T.cookieName.TOKEN);
        sendParam.url = $T.url.boxUrl;
        sendParam.canContinuous = true;
        $T.httpUtil.send(sendParam);
    }
    this.toRecyclebinSuccess = function (result, sendParam) {
        $T.userFoldProxy.getUserFoldChildren($T.fileSystemStatus.nowFoldId);
    }
    this.toRecyclebinFail = function (result, sendParam) {

    }
    this.offRecyclebin = function (userFoldIds, userFileIds) {
        var data = {
            "hOpCode": 50010,
            "userFoldIds": userFoldIds,
            "userFileIds": userFileIds
        };

        var sendParam = new SendParam();
        sendParam.successHandle = this.offRecyclebinSuccess;
        sendParam.failHandle = this.offRecyclebinFail;
        sendParam.object = this;
        sendParam.data = data;
        sendParam.token = $T.cookieParam.getCookieParam($T.cookieName.TOKEN);
        sendParam.url = $T.url.boxUrl;
        sendParam.canContinuous = true;
        $T.httpUtil.send(sendParam);
    }
    this.offRecyclebinSuccess = function (result, sendParam) {
        $T.userFoldProxy.getRecycleBin($T.cookieParam.getCookieParam($T.cookieName.USER_FOLD_TOP_ID));
    }
    this.offRecyclebinFail = function (result, sendParam) {

    }
    this.remove = function (userFoldIds, userFileIds) {
        var data = {
            "hOpCode": 50012,
            "userFoldIds": userFoldIds,
            "userFileIds": userFileIds
        };

        var sendParam = new SendParam();
        sendParam.successHandle = this.removeSuccess;
        sendParam.failHandle = this.removeFail;
        sendParam.object = this;
        sendParam.data = data;
        sendParam.token = $T.cookieParam.getCookieParam($T.cookieName.TOKEN);
        sendParam.url = $T.url.boxUrl;
        sendParam.canContinuous = true;
        $T.httpUtil.send(sendParam);
    }
    this.removeSuccess = function (result, sendParam) {
        $T.userFoldProxy.getRecycleBin($T.cookieParam.getCookieParam($T.cookieName.USER_FOLD_TOP_ID));
        $T.boxInfoProxy.getBoxInfo($T.cookieParam.getCookieParam($T.cookieName.USER_FOLD_TOP_ID));
    }
    this.removeFail = function (result, sendParam) {

    }
    this.moveTo = function (userFoldIds, userFileIds, userFoldParentId) {
        var data = {
            "hOpCode": 50011,
            "userFoldIds": userFoldIds,
            "userFileIds": userFileIds,
            "userFoldParentId": userFoldParentId
        };

        var sendParam = new SendParam();
        sendParam.successHandle = this.moveToSuccess;
        sendParam.failHandle = this.moveToFail;
        sendParam.object = this;
        sendParam.data = data;
        sendParam.token = $T.cookieParam.getCookieParam($T.cookieName.TOKEN);
        sendParam.url = $T.url.boxUrl;
        sendParam.canContinuous = true;
        $T.httpUtil.send(sendParam);
    }
    this.moveToSuccess = function (result, sendParam) {
        $T.userFoldProxy.getUserFoldChildren($T.fileSystemStatus.nowFoldId);
    }
    this.moveToFail = function (result, sendParam) {

    }
}
$T.mutliOperateProxy = new MutliOperateProxy();