function ContainerAllFileMediator() {

    this.init = function (view) {
        $("#allfile_view").addClass("normal_PJY");
        $T.moduleManager.loadModule("html/allfile_head.html", document.getElementById("allfile_head"), "allfile_head", $T.allFileHeadMediator);
        $T.moduleManager.loadModule("html/allfile_view1.html", document.getElementById("allfile_view"), "allfile_view", $T.allFileView1Mediator);

        //删除功能
        $(".fileCon_PJY").on("click", ".delete_PJY", this.onDeleteOne);
        $(".fileCon_PJY").on("click", ".downLoad_PJY", this.onDownLoadOne);

    }
    this.onDeleteOne = function () {
        var deleteId = this.id;
        var deleteIdArray = deleteId.split("_");
        if (deleteIdArray[1] != "deleteFold" && deleteIdArray[1] != "deleteFile") {
            return;
        }
        var userFoldIds = [];
        var userFileIds = [];
        if (deleteIdArray[1] == "deleteFold") {
            userFoldIds.push(deleteIdArray[0]);
        } else {
            userFileIds.push(deleteIdArray[0]);
        }
        $T.containerAllFileMediator.openDeleteWin(userFoldIds, userFileIds);
    }
    this.openDeleteWin = function (userFoldIds, userFileIds) {
        layer.confirm('<br>确认要把所选文件放入回收站吗？<br>删除的文件可在10天内通过回收站还原', {
            title: "确认删除",
            type: 1,
            area: ['460px', 'auto'],
            move: false,
            btn1: function (index, layero) {
                layer.close(index);
                $T.mutliOperateProxy.toRecyclebin(userFoldIds, userFileIds);
            },
            btn2: function (index, layero) {
                layer.close(index);
            }
        })
    }
    this.onDownLoadOne = function () {
        var downLoadId = this.id;
        var downLoadIdArray = downLoadId.split("_");
        window.open($T.userFileProxy.getUserFile(downLoadIdArray[0]));
    }
    // 注销方法
    this.dispose = function () {

    }
    // 关心消息数组
    this.listNotificationInterests = [$T.notificationExt.ALLFILE_CHANGE_VIEW, $T.notificationExt.DELETE_CHOOSE_FILE];
    // 关心的消息处理
    this.handleNotification = function (data) {
        switch (data[0].name) {
            case $T.notificationExt.ALLFILE_CHANGE_VIEW:
                if (data[0].body == 1) {
                    $("#allfile_view").addClass("normal_PJY");
                    $("#allfile_view").removeClass("short_PJY");
                } else if (data[0].body == 2) {
                    $("#allfile_view").removeClass("normal_PJY");
                    $("#allfile_view").addClass("short_PJY");

                }
                break;
            case $T.notificationExt.DELETE_CHOOSE_FILE:
                this.openDeleteWin(data[0].body.userFoldIds, data[0].body.userFileIds);
                break;
        }
    }

}
$T.containerAllFileMediator = new ContainerAllFileMediator();