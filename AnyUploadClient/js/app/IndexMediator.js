function IndexMediator() {

    this.init = function (view) {
        if ($T.cookieParam.getCookieParam($T.cookieName.USER_FOLD_TOP_ID) == null || $T.cookieParam.getCookieParam($T.cookieName.TOKEN) == null) {
            window.location.href = "login.html";
        }
        //默认是顶级文件夹
        $T.fileSystemStatus.goTopFold();
        // 模块
        $T.moduleManager.loadModule("html/left.html", document.getElementById("index_left"), null, $T.leftMediator);
        $T.moduleManager.loadModule("html/container_allfile.html", document.getElementById("index_container"), "body", $T.containerAllFileMediator);
        $T.moduleManager.loadModule("html/right.html", document.getElementById("index_right"), null, $T.rightMediator);
        $T.moduleManager.loadModule("html/upload_box.html", document.getElementById("index_uploadbox"), null, $T.fileMediator);
        $(window).resize(this.onResize);
        this.onResize();
        $("body").on("click", this.onBodyClick);

    }
    this.onBodyClick = function () {
        $T.viewManager.notifyObservers($T.viewManager.getNotification($T.notificationExt.ON_BODY_CLICK));
    }
    // 注销方法
    this.dispose = function () {


    }
    // 关心消息数组
    this.listNotificationInterests = [$T.notificationExt.CHANGE_BODY, $T.notificationExt.OPEN_IMAGE_PREVIEW, $T.notificationExt.OPEN_MOVE_TO, $T.notificationExt.BOX_ERROR, $T.notification.SYSTEM_ERROR];
    // 关心的消息处理
    this.handleNotification = function (data) {
        switch (data[0].name) {
            case $T.notificationExt.CHANGE_BODY:
                if (data[0].body == "allFile") {
                    $T.moduleManager.loadModule("html/container_allfile.html", document.getElementById("index_container"), "body", $T.containerAllFileMediator);
                } else if (data[0].body == "recyclebin") {
                    $T.moduleManager.loadModule("html/container_recyclebin.html", document.getElementById("index_container"), "body", $T.containerRecyclebinMediator);
                }
                break;
            case $T.notificationExt.OPEN_IMAGE_PREVIEW:
                $T.moduleManager.loadModule("html/image_preview.html", document.getElementById("index_image_preview"), "image_preview", $T.imagePreviewMediator, data[0].body);
                break;
            case $T.notificationExt.OPEN_MOVE_TO:
                $T.moduleManager.loadModule("html/move_to.html", document.getElementById("layer1"), "move_to", $T.moveToMediator, data[0].body);
                break;
            case $T.notificationExt.BOX_ERROR:
                layer.msg($T.boxErrorMsg.errorMap[data[0].body], {
                    time: 3000,
                    icon: 2
                });
                break;
            case $T.notification.SYSTEM_ERROR:
                layer.msg(data[0].body, {
                    time: 3000,
                    icon: 2
                });
                break;
        }

    }
    this.onResize = function () {
        var wHeight = $(window).height();
        $("#index_left").height(wHeight);
        $("#index_container").height(wHeight);
        $("#index_right").height(wHeight);
        $("#index_body").height(wHeight);
        $T.viewManager.notifyObservers($T.viewManager.getNotification($T.notificationExt.WINDOW_RESIZE));
    }
}
$T.indexMediator = new IndexMediator();