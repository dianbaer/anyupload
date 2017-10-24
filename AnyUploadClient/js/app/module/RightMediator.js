function RightMediator() {

    this.init = function (view) {

        this.taskList();
        this.iconCenter();
        $(".minimize_list").mCustomScrollbar({
            theme: "minimal",
            advanced: {autoExpandHorizontalScroll: true},
            scrollbarPosition: "outside"
        });
        $("#right_userrealname").text($T.cookieParam.getCookieParam($T.cookieName.USER_REALNAME));
        if ($T.cookieParam.getCookieParam($T.cookieName.USER_IMAGE_URL) != "") {
            $("#right_userimg")[0].src = $T.cookieParam.getCookieParam($T.cookieName.USER_IMAGE_URL);
        } else {
            $("#right_userimg")[0].src = "images/logo.png";
        }


        $("#right_open_uploadbox").on("click", this.onOpenUploadBox);
    }
    // 注销方法
    this.dispose = function () {

    }
    // 关心消息数组
    this.listNotificationInterests = [$T.notificationExt.WINDOW_RESIZE];
    // 关心的消息处理
    this.handleNotification = function (data) {
        switch (data[0].name) {
            case $T.notificationExt.WINDOW_RESIZE:
                this.taskList();
                this.iconCenter();
                break;
        }
    }
    //右侧任务列表高度方法
    this.taskList = function () {
        var wHeight = $(window).height();
        var reduce = $(".rightHead_PJY").innerHeight() + parseFloat($(".rightHead_PJY").css("marginBottom"));
        $(".taskList").height(wHeight - reduce);
        $(".minimize_list").height($(".taskList").height() - 96);
    }
    //右侧图表居中方法
    this.iconCenter = function () {
        var height = $(".taskList>dl").height();
        $(".taskList>dl").css({"marginTop": -height / 2})
    }
    this.onOpenUploadBox = function () {
        $T.viewManager.notifyObservers($T.viewManager.getNotification($T.notificationExt.OPEN_UPLOADBOX));
    }
}
$T.rightMediator = new RightMediator();