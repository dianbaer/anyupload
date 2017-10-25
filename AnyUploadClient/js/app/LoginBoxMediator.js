function LoginBoxMediator() {
    this.loginSuccess = false;
    this.nowTime = 0;
    this.init = function (view) {
        $(window).resize(function () {
            $T.loginBoxMediator.size();
        });
        this.size();
        var token = $T.getUrlParam.getUrlParam($T.httpConfig.TOKEN);
        if (token == null) {
            // token是空应该提示无法登陆
            return;
        }
        // 设置cookie
        $T.cookieParam.setCookieParam($T.cookieName.TOKEN, token);
        var type = $T.getUrlParam.getUrlParam("type");
        var boxsize = $T.getUrlParam.getUrlParam("capacity");
        $T.loginProxy.login(token,type,boxsize);
    }
    // 注销方法
    this.dispose = function () {

    }
    // 关心消息数组
    this.listNotificationInterests = [$T.notificationExt.LOGIN_SUCCESS, $T.notificationExt.LOGIN_FAIL];
    // 关心的消息处理
    this.handleNotification = function (data) {
        switch (data[0].name) {
            case $T.notificationExt.LOGIN_SUCCESS:
                $("#login_box_gif").removeClass("loading_icon_01");
                $("#login_box_gif").addClass("loading_icon_02");
                $("#login_box_image").attr("src", "images/success.png");
                $("#login_box_title")[0].innerHTML = "成功跳转到企业网盘";
                this.loginSuccess = true;
                break;
            case $T.notificationExt.LOGIN_FAIL:
                $("#login_box_gif").removeClass("loading_icon_01");
                $("#login_box_gif").addClass("loading_icon_02");
                $("#login_box_image").attr("src", "images/fail.png");
                $("#login_box_title")[0].innerHTML =
                    '验证失败，请检查您的登录信息是否正确' +
                    '<a href="' + $T.url.cloudManagerUrl + '">点击返回云管家</a>';
                break;
        }
    }
    this.advanceTime = function (passedTime) {
        if (this.loginSuccess) {
            this.nowTime += passedTime;
            if (this.nowTime > 1) {
                window.location.href = "index.html";
                this.loginSuccess = false;
            }
        }

    }
    this.size = function () {
        var $width = $(window).width();
        var $height = $(window).height();
        $(".bg_wrapper").css({
            "width": $width,
            "height": $height,
            "display": "table-cell",
            "vertical-align": "middle"
        });
    }
}
$T.loginBoxMediator = new LoginBoxMediator();