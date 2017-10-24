function AllFileHeadMediator() {
    this.nowView;
    this.downloadArray = [];
    this.lastTimeDownload = 0;
    this.init = function (view) {
        //排序
        $("#allfile_head_sortbutton").on("mouseenter", this.onSortbuttonMouseenter);
        $("#allfile_head_sortbutton").on("mouseleave", this.onSortbuttonMouseleave);
        //更换视图
        $("#allfile_head_changeview").on("click", this.onChangeViewClick);
        this.nowView = 1;
        $("#allfile_head_changeview").removeClass("vcBtn_PJY");
        //上传
        $("#allfile_head_uploadfilebutton").on("change", this.onUploadFileButtonChange);
        //点击面包屑
        $("#allfile_head_crumb").on("click", "a", this.onClickCrumb);
        //下载
        $("#allfile_download").on("click", this.onChooseDownload);
        //删除
        $("#allfile_delchoose").on("click", this.onChooseDelete);
        //新建文件夹功能
        $(".addPage_PJY").on("click", this.createFold);
        $(".resetBtn_PJY").on("click", this.updateName);
        $("#allfile_movechoose").on("click", this.onMutilMove);

        $("#allfile_head_sortbutton").on("click", ".s-btn", this.onSortButtonClick);

        $T.userFoldProxy.nowSortType = 1;
        this.updateSortClass();

    }
    this.onSortButtonClick = function () {
        if (this.id == "sort_name") {
            if ($T.userFoldProxy.nowSortType == 1) {
                return;
            }
            $T.userFoldProxy.nowSortType = 1;
            $T.allFileHeadMediator.updateSortClass();
        } else if (this.id == "sort_size") {
            if ($T.userFoldProxy.nowSortType == 2) {
                return;
            }
            $T.userFoldProxy.nowSortType = 2;
            $T.allFileHeadMediator.updateSortClass();
        } else if (this.id == "sort_time") {
            if ($T.userFoldProxy.nowSortType == 3) {
                return;
            }
            $T.userFoldProxy.nowSortType = 3;
            $T.allFileHeadMediator.updateSortClass();
        }
        $("#allfile_head_sortlist").stop().slideUp(200);
        $T.userFoldProxy.sortNowFoldChildren();
    }
    this.updateSortClass = function () {
        $("#sort_name").removeClass("on_4");
        $("#sort_size").removeClass("on_4");
        $("#sort_time").removeClass("on_4");
        if ($T.userFoldProxy.nowSortType == 1) {
            $("#sort_name").addClass("on_4");
        } else if ($T.userFoldProxy.nowSortType == 2) {
            $("#sort_size").addClass("on_4");
        } else if ($T.userFoldProxy.nowSortType == 3) {
            $("#sort_time").addClass("on_4");
        }
    }
    this.onMutilMove = function () {
        var checkArray = $T.allFileHeadMediator.getCheckedList();
        var userFoldIds = [];
        var userFileIds = [];
        for (var i = 0; i < checkArray.length; i++) {
            var check = checkArray[i];
            var checkIdArray = check.id.split("_");
            if (checkIdArray[1] != "checkFold" && checkIdArray[1] != "checkFile") {
                continue;
            }
            if (checkIdArray[1] == "checkFold") {
                userFoldIds.push(checkIdArray[0]);
            } else {
                userFileIds.push(checkIdArray[0]);
            }
        }
        $T.viewManager.notifyObservers($T.viewManager.getNotification($T.notificationExt.OPEN_MOVE_TO, {
            "userFileIds": userFileIds,
            "userFoldIds": userFoldIds
        }));
    }

    this.updateName = function (event) {
        var checkList = $T.allFileHeadMediator.getCheckedList();
        if (checkList.length != 1) {
            return;
        }
        var checkIdArray = checkList[0].id.split("_");
        $T.viewManager.notifyObservers($T.viewManager.getNotification($T.notificationExt.UPDATE_NAME, checkIdArray[0]));
        event.stopPropagation();
    }
    this.createFold = function (event) {
        $T.viewManager.notifyObservers($T.viewManager.getNotification($T.notificationExt.CREATE_USER_FOLD));
        event.stopPropagation();
    }
    this.onChooseDownload = function () {
        var checkArray = $T.allFileHeadMediator.getCheckedList();
        for (var i = 0; i < checkArray.length; i++) {
            var check = checkArray[i];
            var checkIdArray = check.id.split("_");
            if (checkIdArray[1] != "checkFold" && checkIdArray[1] != "checkFile") {
                continue;
            }
            if (checkIdArray[1] == "checkFold") {
            } else {
                $T.allFileHeadMediator.downloadArray.push(checkIdArray[0]);
            }
        }
    }
    this.onChooseDelete = function () {
        var checkArray = $T.allFileHeadMediator.getCheckedList();
        var userFoldIds = [];
        var userFileIds = [];
        for (var i = 0; i < checkArray.length; i++) {
            var check = checkArray[i];
            var checkIdArray = check.id.split("_");
            if (checkIdArray[1] != "checkFold" && checkIdArray[1] != "checkFile") {
                continue;
            }
            if (checkIdArray[1] == "checkFold") {
                userFoldIds.push(checkIdArray[0]);
            } else {
                userFileIds.push(checkIdArray[0]);
            }
        }
        $T.viewManager.notifyObservers($T.viewManager.getNotification($T.notificationExt.DELETE_CHOOSE_FILE, {
            "userFoldIds": userFoldIds,
            "userFileIds": userFileIds
        }));
    }
    this.getCheckedList = function () {
        var checkList = $(".listSty1_PJY").find(".Check");
        var checkArray = [];
        for (var i = 0; i < checkList.length; i++) {
            var check = checkList[i];
            if (check.checked) {
                checkArray.push(check);
            }
        }
        return checkArray;
    }
    // 注销方法
    this.dispose = function () {

    }
    // 关心消息数组
    this.listNotificationInterests = [$T.notificationExt.GET_FOLD_CHILDREN_SUCCESS, $T.notificationExt.SHOW_MUTIL_BAR, $T.notificationExt.HIDE_MUTIL_BAR];
    // 关心的消息处理
    this.handleNotification = function (data) {
        switch (data[0].name) {
            case $T.notificationExt.GET_FOLD_CHILDREN_SUCCESS:
                this.getFoldChildrenSuccess(data[0].body);
                break;
            case $T.notificationExt.SHOW_MUTIL_BAR:
                if (data[0].body.num == 1) {
                    $(".resetBtn_PJY").removeClass("disabled");
                } else {
                    $(".resetBtn_PJY").addClass("disabled");
                }
                if (data[0].body.hasFold) {
                    $("#allfile_download").addClass("disabled2_PJY");
                    $(".warning_PJY").show();
                } else {
                    $("#allfile_download").removeClass("disabled2_PJY");
                    $(".warning_PJY").hide();
                }
                $("#allfile_rename").removeClass("hide");
                $("#allfile_download").removeClass("hide");
                $("#allfile_delchoose").removeClass("hide");
                $("#allfile_movechoose").removeClass("hide");
                break;
            case $T.notificationExt.HIDE_MUTIL_BAR:
                $("#allfile_rename").addClass("hide");
                $("#allfile_download").addClass("hide");
                $("#allfile_delchoose").addClass("hide");
                $("#allfile_movechoose").addClass("hide");
                break;
        }
    }
    this.getFoldChildrenSuccess = function (data) {
        $("#allfile_head_crumb").text("");
        if (data.recursionUserFoldList.length > 1) {
            var returnView = $('<a class="nav_PJY" href="javascript:;" id="' + data.recursionUserFoldList[0].userFoldParentId + '">返回上一级</a>');
            $("#allfile_head_crumb").append(returnView);
        }
        for (var i = data.recursionUserFoldList.length - 1; i >= 0; i--) {
            var userFold = data.recursionUserFoldList[i];
            var view;
            if (i == 0) {
                view = this.createCrumb(userFold, true);
            } else {
                view = this.createCrumb(userFold, false);
            }
            $("#allfile_head_crumb").append(view);
        }
        var num = 0;
        if (data.userFoldList != null) {
            num += data.userFoldList.length;
        }
        if (data.userFileList != null) {
            num += data.userFileList.length;
        }
        $("#allfilehead_filenum").text(num);
    }
    this.onClickCrumb = function () {
        if (!$(this).hasClass("nav_PJY")) {
            return;
        }
        var userFoldId = this.id;
        $T.userFoldProxy.getUserFoldChildren(userFoldId);
    }
    this.createCrumb = function (userFold, isEnd) {
        if (userFold.userFoldTopId == null) {
            if (isEnd) {
                return $('<a href="javascript:;" id="' + userFold.userFoldId + '">全部文件</a>');
            } else {
                return $('<a class="nav_PJY" href="javascript:;" id="' + userFold.userFoldId + '">全部文件</a>');
            }
        } else {
            if (isEnd) {
                return $('<a href="javascript:;" id="' + userFold.userFoldId + '">' + userFold.userFoldName + '</a>');
            } else {
                return $('<a class="nav_PJY" href="javascript:;" id="' + userFold.userFoldId + '">' + userFold.userFoldName + '</a>');
            }
        }
    }
    this.onSortbuttonMouseenter = function () {
        $("#allfile_head_sortlist").stop().slideDown(200);
    }
    this.onSortbuttonMouseleave = function () {
        $("#allfile_head_sortlist").stop().slideUp(200);
    }
    this.onChangeViewClick = function () {
        if ($T.allFileHeadMediator.nowView == 1) {
            $T.allFileHeadMediator.nowView = 2;
            $("#allfile_head_changeview").addClass("vcBtn_PJY");
            $T.moduleManager.loadModule("html/allfile_view2.html", document.getElementById("allfile_view"), "allfile_view", $T.allFileView2Mediator);
        } else {
            $T.allFileHeadMediator.nowView = 1;
            $("#allfile_head_changeview").removeClass("vcBtn_PJY");
            $T.moduleManager.loadModule("html/allfile_view1.html", document.getElementById("allfile_view"), "allfile_view", $T.allFileView1Mediator);

        }
    }
    this.onUploadFileButtonChange = function (e) {
        if (!("FileReader" in window) || !("File" in window)) {
            alert("您的浏览器不支持html5，请使用google，firefox，ie10等浏览器");
            return;
        }
        var files = e.target.files;
        $T.viewManager.notifyObservers($T.viewManager.getNotification($T.notificationExt.UPLOAD_FILE, files));
        $("#allfile_head_uploadfilebutton").val("");
    }
    this.advanceTime = function (passedTime) {
        this.lastTimeDownload += passedTime;
        if (this.downloadArray.length > 0 && this.lastTimeDownload > 1) {
            var userFileId = this.downloadArray.shift();
            window.location.href = $T.userFileProxy.getUserFile(userFileId);
            this.lastTimeDownload = 0;
        }
    }
}
$T.allFileHeadMediator = new AllFileHeadMediator();