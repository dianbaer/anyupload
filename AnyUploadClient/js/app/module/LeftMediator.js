function LeftMediator() {

    this.init = function (view) {
        $("#left_allfile").on("click", this.onOpenAllFile);
        $("#left_recyclebin").on("click", this.onOpenRecyclebin);
        $T.boxInfoProxy.getBoxInfo($T.cookieParam.getCookieParam($T.cookieName.USER_FOLD_TOP_ID));

    }
    // 注销方法
    this.dispose = function () {
        $("#left_allfile").remove("click", this.onOpenAllFile);
        $("#left_recyclebin").remove("click", this.onOpenRecyclebin);
    }
    // 关心消息数组
    this.listNotificationInterests = [$T.notificationExt.GET_BOX_INFO_SUCCESS];
    // 关心的消息处理
    this.handleNotification = function (data) {
        switch (data[0].name) {
            case $T.notificationExt.GET_BOX_INFO_SUCCESS:
                this.percent(data[0].body.useSize, data[0].body.totalSize);
                break;
        }
    }

    this.onOpenAllFile = function () {
        $T.fileSystemStatus.goTopFold();
        $T.viewManager.notifyObservers($T.viewManager.getNotification($T.notificationExt.CHANGE_BODY, "allFile"));
        $("#left_allfile").addClass("on");
        $("#left_recyclebin").removeClass("on");

    }
    this.onOpenRecyclebin = function () {
        $T.viewManager.notifyObservers($T.viewManager.getNotification($T.notificationExt.CHANGE_BODY, "recyclebin"));
        $("#left_allfile").removeClass("on");
        $("#left_recyclebin").addClass("on");
    }
    this.percent = function (useSize, totalSize) {
        var useSizeStr = $T.byteUtil.getByte(useSize * $T.byteUtil.KB_SIZE, null, 0, null);
        var totalSizeStr = $T.byteUtil.getByte(totalSize * $T.byteUtil.KB_SIZE, null, null, 0);
        $("#left_use_size").html(useSizeStr);
        $("#left_total_size").html(totalSizeStr);
        var per = useSize / totalSize;
        if (per > 1) {
            per = 1;
        }
        $(".process>div").css({width: per * 100 + "%"})
    }


}
$T.leftMediator = new LeftMediator();