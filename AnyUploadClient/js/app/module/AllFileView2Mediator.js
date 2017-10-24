function AllFileView2Mediator() {

    this.init = function (view) {
        this.listHeight(".window_PJY");

        $(".window_PJY").mCustomScrollbar({
            theme: "minimal",
            advanced: {autoExpandHorizontalScroll: true},
            scrollbarPosition: "outside"
        });

        $('input:checkbox').iCheck({
            checkboxClass: 'icheckbox_square-blue',
            radioClass: 'iradio_square-blue'
        });

        $(".list_PJY.listSty1_PJY").on("mouseenter", "li", function () {
            $(this).find(".li2_PJY>div").removeClass("hide");
        }).on("mouseleave", "li", function () {
            $(this).find(".li2_PJY>div").addClass("hide");
        });

        $(".list_PJY.listSty1_PJY").on("click", ".li1_PJY>b,.li1_PJY>div", this.onClickIcon);
        $("#allfile_view2_userfilelist").on("click", ".updateName", this.onUpdateName);

        $(".listHead_PJY").on("ifChecked", ".allCheck", this.allCheckClick);
        $(".listHead_PJY").on("ifUnchecked", ".allCheck", this.allCheckUnClick);


        $(".list_PJY.listSty1_PJY").on("ifUnchecked", "input", $T.allFileView2Mediator.inputCheck);
        $(".list_PJY.listSty1_PJY").on("ifChecked", "input", $T.allFileView2Mediator.inputUnCheck);

        $("#allfile_view2_userfilelist").on("click", ".createFold", this.onSendCreateFold);
        $(".window_PJY .mCSB_container").css("paddingBottom", "80px");
        $T.userFoldProxy.getUserFoldChildren($T.fileSystemStatus.nowFoldId);
        $T.viewManager.notifyObservers($T.viewManager.getNotification($T.notificationExt.ALLFILE_CHANGE_VIEW, 2));
    }
    this.onUpdateName = function (event) {
        if ($(this).hasClass("yes_PJY")) {
            var uuidArray = this.id.split("_");
            var changeBox = $("#" + uuidArray[0] + "_changeBox");
            var name = $("#" + uuidArray[0] + "_input").val();
            //为空不做操作
            if (name == "") {
                var text = changeBox.prev()[0].innerHTML;
                $("#" + uuidArray[0] + "_input").val(text);
                changeBox.prev().show();
                changeBox.hide();
                changeBox.removeClass("updateFoldBody");
                return;
            }
            changeBox.prev()[0].innerHTML = name;
            changeBox.prev().show();
            changeBox.hide();
            changeBox.removeClass("updateFoldBody");
            if ($T.userFoldProxy.nowFoldChildren.userFoldMap[uuidArray[0]] != null) {
                $T.userFoldProxy.updateUserFold(uuidArray[0], name, null, false, null);
            } else if ($T.userFoldProxy.nowFoldChildren.userFileMap[uuidArray[0]] != null) {
                $T.userFileProxy.updateUserFile(uuidArray[0], name, null, false, null);
            }
        } else if ($(this).hasClass("no_PJY")) {
            var uuidArray = this.id.split("_");
            var changeBox = $("#" + uuidArray[0] + "_changeBox");
            var text = changeBox.prev()[0].innerHTML;
            $("#" + uuidArray[0] + "_input").val(text);
            changeBox.prev().show();
            changeBox.hide();
            changeBox.removeClass("updateFoldBody");
        }
        event.stopPropagation();
    }
    this.onClickIcon = function () {
        if ($(this).hasClass("userFold")) {
            var userFoldId = this.id.split("_");
            var userFold = $T.userFoldProxy.nowFoldChildren.userFoldMap[userFoldId[0]];
            if (userFold != null) {
                $T.userFoldProxy.getUserFoldChildren(userFold.userFoldId);
            }
        } else if ($(this).hasClass("userFile")) {
            var userFileId = this.id.split("_");
            var userFile = $T.userFoldProxy.nowFoldChildren.userFileMap[userFileId[0]];
            if ($T.postfixUtil.isImage(userFile.userFileName)) {
                $T.viewManager.notifyObservers($T.viewManager.getNotification($T.notificationExt.OPEN_IMAGE_PREVIEW, userFile.userFileId));
            }
        }
    }
    this.allCheckClick = function (e) {
        var parent = $(this).parents(".fileList_PJY ");
        parent.find("input:checkbox").iCheck('check');
    }
    this.allCheckUnClick = function (e) {
        var parent = $(this).parents(".fileList_PJY");
        parent.find("input:checkbox").iCheck('uncheck');
    }
    this.inputCheck = function () {
        $(this).parents("ul").removeClass("on_PJY");
        $T.allFileView2Mediator.resetCheckFileNum();
    }
    this.inputUnCheck = function () {
        $(this).parents("ul").addClass("on_PJY");
        $T.allFileView2Mediator.resetCheckFileNum();
    }
    this.resetCheckFileNum = function () {
        var checkList = $("#allfile_view2_userfilelist").find(".Check");
        var checkNum = 0;
        var hasFold = false;
        for (var i = 0; i < checkList.length; i++) {
            var check = checkList[i];
            var checkIdArray = check.id.split("_");
            if (check.checked) {
                if (checkIdArray[1] == "checkFold") {
                    hasFold = true;
                }
                checkNum++;
            }
        }
        if (checkNum > 0) {
            $("#allfile_view2_title1_pyj").addClass("hide");
            $("#allfile_view2_title2_pyj").removeClass("hide").find("span").html(checkNum);
            $T.viewManager.notifyObservers($T.viewManager.getNotification($T.notificationExt.SHOW_MUTIL_BAR, {
                "num": checkNum,
                "hasFold": hasFold
            }));
        } else {
            $("#allfile_view2_title1_pyj").removeClass("hide");
            $("#allfile_view2_title2_pyj").addClass("hide");
            $T.viewManager.notifyObservers($T.viewManager.getNotification($T.notificationExt.HIDE_MUTIL_BAR));
        }

    }
    // 注销方法
    this.dispose = function () {

    }
    // 关心消息数组
    this.listNotificationInterests = [$T.notificationExt.WINDOW_RESIZE, $T.notificationExt.GET_FOLD_CHILDREN_SUCCESS, $T.notificationExt.REFRESH_NOW_USERFOLD, $T.notificationExt.CREATE_USER_FOLD, $T.notificationExt.ON_BODY_CLICK, $T.notificationExt.UPDATE_NAME];
    // 关心的消息处理
    this.handleNotification = function (data) {
        switch (data[0].name) {
            case $T.notificationExt.WINDOW_RESIZE:
                this.listHeight(".window_PJY");
                break;
            case $T.notificationExt.GET_FOLD_CHILDREN_SUCCESS:
                this.getFoldChildrenSuccess(data[0].body);
                break;
            case $T.notificationExt.REFRESH_NOW_USERFOLD:
                $T.userFoldProxy.getUserFoldChildren($T.fileSystemStatus.nowFoldId);
                break;
            case $T.notificationExt.CREATE_USER_FOLD:
                this.createNewFold();
                break;
            case $T.notificationExt.ON_BODY_CLICK:
                this.onBodyClick();
                break;
            case $T.notificationExt.UPDATE_NAME:
                this.openUpdateNameBody(data[0].body);
                break;
        }
    }
    this.openUpdateNameBody = function (id) {
        var changeBox = $("#" + id + "_changeBox");
        changeBox.prev().css({display: "none"});
        changeBox.css("display", "block");
        changeBox.addClass("updateFoldBody");
    }
    this.onBodyClick = function () {
        $(".fileList_PJY").find(".createFoldBody").each(function () {
            var uuidArray = this.id.split("_");
            var obj = $("#" + uuidArray[0]);
            obj.remove();
            var userFoldName = obj.find("input").val();
            if (userFoldName == "") {
                return;
            }
            $T.userFoldProxy.createUserFold(userFoldName, $T.fileSystemStatus.nowFoldId);
        });
        $(".fileList_PJY").find(".updateFoldBody").each(function () {
            var uuidArray = this.id.split("_");
            var changeBox = $("#" + uuidArray[0] + "_changeBox");
            var name = $("#" + uuidArray[0] + "_input").val();
            //为空不做操作
            if (name == "") {
                var text = changeBox.prev()[0].innerHTML;
                $("#" + uuidArray[0] + "_input").val(text);
                changeBox.prev().show();
                changeBox.hide();
                changeBox.removeClass("updateFoldBody");
                return;
            }
            changeBox.prev()[0].innerHTML = name;
            changeBox.prev().show();
            changeBox.hide();
            changeBox.removeClass("updateFoldBody");
            if ($T.userFoldProxy.nowFoldChildren.userFoldMap[uuidArray[0]] != null) {
                $T.userFoldProxy.updateUserFold(uuidArray[0], name, null, false, null);
            } else if ($T.userFoldProxy.nowFoldChildren.userFileMap[uuidArray[0]] != null) {
                $T.userFileProxy.updateUserFile(uuidArray[0], name, null, false, null);
            }
        });
    }
    this.onSendCreateFold = function (event) {
        if ($(this).hasClass("yes_PJY")) {
            var uuidArray = this.id.split("_");
            var obj = $("#" + uuidArray[0]);
            obj.remove();
            var userFoldName = obj.find("input").val();
            if (userFoldName == "") {
                return;
            }
            $T.userFoldProxy.createUserFold(userFoldName, $T.fileSystemStatus.nowFoldId);
        } else if ($(this).hasClass("no_PJY")) {
            var uuidArray = this.id.split("_");
            $("#" + uuidArray[0]).remove();
        }
        event.stopPropagation();
    }
    this.createNewFold = function () {
        var createFoldBody = $("#allfile_view2_userfilelist").find(".createFoldBody");
        if (createFoldBody.length > 0) {
            return;
        }
        var view = this.createNewFoldView();
        $("#allfile_view2_userfilelist").prepend(view);
        $('input:checkbox').iCheck('destroy');
        $('input:checkbox').iCheck({
            checkboxClass: 'icheckbox_square-blue',
            radioClass: 'iradio_square-blue'
        });
    }
    this.createNewFoldView = function () {
        var id = Math.uuid();
        var view = document.createElement("li");
        var body =
            '<ul>' +
            '<li class="li1_PJY">' +
            '<div class="checkbox">' +
            // '<input type="checkbox" class="Check"/>' +
            '</div>' +
            '<b class="fileBag_PJY"></b>' +
            '<div class="fileName_PJY" style="display:none"></div>' +
            '<div class="changeBox_PJY createFoldBody" style="display:block" id="' + id + '_changeBox">' +
            '<input type="text" value="新建文件夹" id="' + id + '_input" class="createFold"/>' +
            '<i class="yes_PJY createFold" id="' + id + '_yes"></i>' +
            '<i class="no_PJY createFold" id="' + id + '_no"></i>' +
            '</div>' +
            '</li>' +
            '</ul>';
        view.innerHTML = body;
        view.id = id;
        return $(view);
    }
    this.listHeight = function (e) {
        var height = $(".container").height();
        var reduce1 = $(".fileHead_PJY").innerHeight();
        var reduce2 = $(".listHead_PJY").innerHeight();
        $(e).innerHeight(height - reduce1 - reduce2);
    }
    this.getFoldChildrenSuccess = function (data) {
        $("#allfile_view2_userfilelist").text("");
        if (data.userFoldList != null) {
            for (var i = 0; i < data.userFoldList.length; i++) {
                var userFold = data.userFoldList[i];
                var view = this.createUserFold(userFold);
                $("#allfile_view2_userfilelist").append(view);
            }
        }
        if (data.userFileList != null) {
            for (var i = 0; i < data.userFileList.length; i++) {
                var userFile = data.userFileList[i];
                var view = this.createUserFile(userFile);
                $("#allfile_view2_userfilelist").append(view);
            }
        }
        $('input:checkbox').iCheck('destroy');
        $('input:checkbox').iCheck({
            checkboxClass: 'icheckbox_square-blue',
            radioClass: 'iradio_square-blue'
        });

        $("#allfile_view2_userfilelist").removeClass("hide");

        this.resetCheckFileNum();

        $(".allCheck").iCheck('uncheck');
    }
    this.createUserFold = function (userFold) {
        var view = document.createElement("li");
        var body =
            '<ul>' +
            '<li class="li1_PJY">' +
            '<div class="checkbox">' +
            '<input type="checkbox" class="Check" id="' + userFold.userFoldId + '_checkFold"/>' +
            '</div>' +
            '<b id="' + userFold.userFoldId + '_b" class="fileBag_PJY userFold"></b>' +
            '<div id="' + userFold.userFoldId + '_span" class="fileName_PJY userFold">' + userFold.userFoldName + '</div>' +
            '<div class="changeBox_PJY" id="' + userFold.userFoldId + '_changeBox">' +
            '<input type="text" value="' + userFold.userFoldName + '" class="updateName" id="' + userFold.userFoldId + '_input"/>' +
            '<i class="yes_PJY updateName" id="' + userFold.userFoldId + '_yes"></i>' +
            '<i class="no_PJY updateName" id="' + userFold.userFoldId + '_no"></i>' +
            '</div>' +
            '</li>' +
            '</ul>';
        view.innerHTML = body;
        view.id = userFold.userFoldId;
        return $(view);
    }
    this.createUserFile = function (userFile) {
        var view = document.createElement("li");
        var body =
            '<ul>' +
            '<li class="li1_PJY">' +
            '<div class="checkbox">' +
            '<input type="checkbox" class="Check" id="' + userFile.userFileId + '_checkFile"/>' +
            '</div>' +

            this.getElementByFileName(userFile) +
            '<div id="' + userFile.userFileId + '_span" class="fileName_PJY userFile">' + userFile.userFileName + '</div>' +
            '<div class="changeBox_PJY" id="' + userFile.userFileId + '_changeBox">' +
            '<input type="text" value="' + userFile.userFileName + '" class="updateName" id="' + userFile.userFileId + '_input"/>' +
            '<i class="yes_PJY updateName" id="' + userFile.userFileId + '_yes"></i>' +
            '<i class="no_PJY updateName" id="' + userFile.userFileId + '_no"></i>' +
            '</div>' +
            '</li>' +
            '</ul>';
        view.innerHTML = body;
        view.id = userFile.userFileId;
        return $(view);
    }
    this.getElementByFileName = function (userFile) {
        if ($T.postfixUtil.isImage(userFile.userFileName)) {
            return '<b id="' + userFile.userFileId + '_b" class="userFile"><img style="width:50px;height:50px" src="' + $T.userFileProxy.getUserFileImage(userFile.userFileId) + '"></b>';
        } else {
            return '<b id="' + userFile.userFileId + '_b" class="' + $T.postfixUtil.getClassByFileName2(userFile.userFileName) + ' userFile"></b>';
        }
    }

}
$T.allFileView2Mediator = new AllFileView2Mediator();