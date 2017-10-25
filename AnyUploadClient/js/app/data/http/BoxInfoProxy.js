function BoxInfoProxy() {
    this.NAME = "BoxInfoProxy";
    this.getBoxInfo = function (userFoldTopId) {
        var data = {
            "hOpCode": 50015,
            "userFoldTopId": userFoldTopId
        };

        var sendParam = new SendParam();
        sendParam.successHandle = this.getBoxInfoSuccess;
        sendParam.failHandle = this.getBoxInfoFail;
        sendParam.object = this;
        sendParam.data = data;
        sendParam.url = $T.url.boxUrl;
        sendParam.token = $T.cookieParam.getCookieParam($T.cookieName.TOKEN);
        sendParam.canContinuous = true;
        $T.httpUtil.send(sendParam);
    }
    this.getBoxInfoSuccess = function (result, sendParam) {
        if (result.useSize == null) {
            result.useSize = 0;
        }
        $T.viewManager.notifyObservers($T.viewManager.getNotification($T.notificationExt.GET_BOX_INFO_SUCCESS, result));
    }
    this.getBoxInfoFail = function (result, sendParam) {

    }
}
$T.boxInfoProxy = new BoxInfoProxy();