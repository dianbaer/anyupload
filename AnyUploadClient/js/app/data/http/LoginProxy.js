function LoginProxy() {
    this.NAME = "LoginProxy";
    this.login = function (token, type,boxsize) {
        var data = {
            "hOpCode": 50002,
            "token": token,
            "type": type,
            "boxsize":boxsize
        };

        var sendParam = new SendParam();
        sendParam.successHandle = this.loginSuccess;
        sendParam.failHandle = this.loginFail;
        sendParam.object = this;
        sendParam.data = data;
        sendParam.url = $T.url.boxUrl;
        $T.httpUtil.send(sendParam);
    }
    this.loginSuccess = function (result, sendParam) {
        $T.cookieParam.setCookieParam($T.cookieName.USER_FOLD_TOP_ID, result.userFoldTopId);
        $T.cookieParam.setCookieParam($T.cookieName.USER_ID, result.userId);
        $T.cookieParam.setCookieParam($T.cookieName.USER_REALNAME, result.userRealName);
        if (result.userImgUrl == null) {
            $T.cookieParam.setCookieParam($T.cookieName.USER_IMAGE_URL, "");
        } else {
            $T.cookieParam.setCookieParam($T.cookieName.USER_IMAGE_URL, result.userImgUrl);
        }
        $T.viewManager.notifyObservers($T.viewManager.getNotification($T.notificationExt.LOGIN_SUCCESS));
    }
    this.loginFail = function (result, sendParam) {
        $T.viewManager.notifyObservers($T.viewManager.getNotification($T.notificationExt.LOGIN_FAIL));
    }
}
$T.loginProxy = new LoginProxy();