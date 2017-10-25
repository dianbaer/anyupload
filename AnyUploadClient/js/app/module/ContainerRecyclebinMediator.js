function ContainerRecyclebinMediator() {

    this.init = function (view) {
        this.listHeight(".window2_PJY");

        $(".window2_PJY").mCustomScrollbar({
            theme: "minimal",
            advanced: {autoExpandHorizontalScroll: true},
            scrollbarPosition: "outside"
        });

        $('input:checkbox').iCheck({
            checkboxClass: 'icheckbox_square-blue',
            radioClass: 'iradio_square-blue'
        });

        $(".garCon_PJY .list_PJY.listSty1_PJY").on("mouseenter", "li", function () {
            $(this).find(".li2_PJY>div").removeClass("hide");
        }).on("mouseleave", "li", function () {
            $(this).find(".li2_PJY>div").addClass("hide");
        });

        $(".garCon_PJY .listHead_PJY").on("ifChecked", ".allCheck", this.allCheckClick);
        $(".garCon_PJY .listHead_PJY").on("ifUnchecked", ".allCheck", this.allCheckUnClick);

        $(".garCon_PJY .list_PJY.listSty1_PJY").each(function () {
            $(this).on("ifUnchecked", "input", $T.containerRecyclebinMediator.inputCheck);
            $(this).on("ifChecked", "input", $T.containerRecyclebinMediator.inputUnCheck);
        });

        $(".garCon_PJY").on("click", ".delete_PJY", this.onDelete);
        $(".garCon_PJY").on("click", "#recycle_allDel", this.openClearRecycleBinWin);
        $(".garCon_PJY").on("click", ".reBack_PJY", this.onReBack);
        $(".garCon_PJY").on("click", "#recycle_allRe", this.onAllReBack);
        $(".garCon_PJY").on("click", "#recycle_ChooseDel", this.onChooseDel);

        $T.userFoldProxy.getRecycleBin($T.cookieParam.getCookieParam($T.cookieName.USER_FOLD_TOP_ID));

    }
    this.allCheckClick = function (e) {
        $(".garCon_PJY .list_PJY.listSty1_PJY").find("input").iCheck('check');
    }
    this.allCheckUnClick = function (e) {
        $(".garCon_PJY .list_PJY.listSty1_PJY").find("input").iCheck('uncheck');
    }
    this.inputCheck = function () {
        $(this).parents("ul").removeClass("on_PJY");
        $T.containerRecyclebinMediator.resetCheckFileNum();
    }
    this.inputUnCheck = function () {
        $(this).parents("ul").addClass("on_PJY");
        $T.containerRecyclebinMediator.resetCheckFileNum();
    }
    this.resetCheckFileNum = function () {
        var checkList = $("#recyclebin_userfilelist").find(".Check");
        var checkNum = 0;
        for (var i = 0; i < checkList.length; i++) {
            var check = checkList[i];
            if (check.checked) {
                checkNum++;
            }
        }
        if (checkNum > 0) {
            $("#recycle_title1_pyj").addClass("hide");
            $("#recycle_title2_pyj").removeClass("hide").find("span").html(checkNum);
            $("#recycle_allRe").removeClass("hide");
            $("#recycle_ChooseDel").removeClass("hide");
        } else {
            $("#recycle_title1_pyj").removeClass("hide");
            $("#recycle_title2_pyj").addClass("hide");
            $("#recycle_allRe").addClass("hide");
            $("#recycle_ChooseDel").addClass("hide");
        }

    }
    this.getCheckedList = function () {
        var checkList = $("#recyclebin_userfilelist").find(".Check");
        var checkArray = [];
        for (var i = 0; i < checkList.length; i++) {
            var check = checkList[i];
            if (check.checked) {
                checkArray.push(check);
            }
        }
        return checkArray;
    }
    this.onDelete = function () {
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
        $T.containerRecyclebinMediator.openDeleteWin(userFoldIds, userFileIds);
    }
    this.openDeleteWin = function (userFoldIds, userFileIds) {
        layer.confirm('<br>文件删除后将无法恢复，您确认要彻底<br>删除所选文件吗？', {
            title: "彻底删除",
            type: 1,
            area: ['460px', 'auto'],
            move: false,
            btn1: function (index, layero) {
                layer.close(index);
                $T.mutliOperateProxy.remove(userFoldIds, userFileIds);
            },
            btn2: function (index, layero) {
                layer.close(index);
            }
        })
    }
    this.openClearRecycleBinWin = function () {
        layer.confirm('<br>确认清空回收站？', {
            title: "清空回收站",
            type: 1,
            area: ['460px', 'auto'],
            move: false,
            btn1: function (index, layero) {
                layer.close(index);
                $T.mutliOperateProxy.clearRecyclebin($T.cookieParam.getCookieParam($T.cookieName.USER_FOLD_TOP_ID));
            },
            btn2: function (index, layero) {
                layer.close(index);
            }
        })
    }
    this.onReBack = function () {
        var reBackId = this.id;
        var reBackIdArray = reBackId.split("_");
        if (reBackIdArray[1] != "reBackFold" && reBackIdArray[1] != "reBackFile") {
            return;
        }
        var userFoldIds = [];
        var userFileIds = [];
        if (reBackIdArray[1] == "reBackFold") {
            userFoldIds.push(reBackIdArray[0]);
        } else {
            userFileIds.push(reBackIdArray[0]);
        }
        $T.containerRecyclebinMediator.openReBackWin(userFoldIds, userFileIds);
    }
    this.openReBackWin = function (userFoldIds, userFileIds) {
        layer.confirm('<br>确认还原选中的文件？', {
            title: "确认还原",
            type: 1,
            area: ['460px', 'auto'],
            move: false,
            btn1: function (index, layero) {
                layer.close(index);
                $T.mutliOperateProxy.offRecyclebin(userFoldIds, userFileIds);
            },
            btn2: function (index, layero) {
                layer.close(index);
            }
        })
    }
    this.onAllReBack = function () {
        var checkArray = $T.containerRecyclebinMediator.getCheckedList();
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
        $T.containerRecyclebinMediator.openReBackWin(userFoldIds, userFileIds);

    }
    this.onChooseDel = function () {
        var checkArray = $T.containerRecyclebinMediator.getCheckedList();
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
        $T.containerRecyclebinMediator.openDeleteWin(userFoldIds, userFileIds);
    }
    // 注销方法
    this.dispose = function () {

    }
    // 关心消息数组
    this.listNotificationInterests = [$T.notificationExt.WINDOW_RESIZE, $T.notificationExt.GET_RECYCLEBIN_SUCCESS];
    // 关心的消息处理
    this.handleNotification = function (data) {
        switch (data[0].name) {
            case $T.notificationExt.WINDOW_RESIZE:
                this.listHeight(".window2_PJY");
                break;
            case $T.notificationExt.GET_RECYCLEBIN_SUCCESS:
                this.getRecyclebinSuccess(data[0].body);
                break;
        }
    }
    this.listHeight = function (e) {
        var height = $(".container").height();
        var reduce1 = $(".fileHead_PJY").innerHeight();
        var reduce2 = $(".listHead_PJY").innerHeight();
        $(e).innerHeight(height - reduce1 - reduce2);
    }
    this.getRecyclebinSuccess = function (data) {
        $("#recyclebin_userfilelist").text("");

        var num = 0;
        if (data.userFoldList != null) {
            for (var i = 0; i < data.userFoldList.length; i++) {
                var userFold = data.userFoldList[i];
                var view = this.createUserFold(userFold);
                $("#recyclebin_userfilelist").append(view);
            }
            num += data.userFoldList.length;
        }
        if (data.userFileList != null) {
            for (var i = 0; i < data.userFileList.length; i++) {
                var userFile = data.userFileList[i];
                var view = this.createUserFile(userFile);
                $("#recyclebin_userfilelist").append(view);
            }
            num += data.userFileList.length;
        }

        $("#recyclebin_userfilenum").text(num);

        $('input:checkbox').iCheck({
            checkboxClass: 'icheckbox_square-blue',
            radioClass: 'iradio_square-blue'
        });

        $("#recyclebin_userfilelist").removeClass("hide");

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
            '<b class="fileBag_PJY"></b>' +
            '<span>' + userFold.userFoldName + '</span>' +
            '</li>' +
            '<li class="li2_PJY">' +
            '<div class="hide">' +
            '<a href="javascript:;" class="reBack_PJY" id="' + userFold.userFoldId + '_reBackFold"></a>' +
            '<a href="javascript:;" class="delete_PJY" id="' + userFold.userFoldId + '_deleteFold"></a>' +
            '</div>' +
            '</li>' +
            '<li class="li3_PJY"><span>-</span></li>' +
            '<li class="li4_PJY"><span>10</span>天</li>' +
            '<li class="li5_PJY"><span>' + userFold.userFoldUpdateTime + '</span></li>' +
            '</ul>';

        view.innerHTML = body;
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
            '<b class="' + $T.postfixUtil.getClassByFileName2(userFile.userFileName) + '"></b>' +
            '<span>' + userFile.userFileName + '</span>' +
            '<div class="changeBox_PJY">' +
            '<input type="text"/>' +
            '<i class="yes_PJY"></i>' +
            '<i class="no_PJY"></i>' +
            '</div>' +
            '</li>' +
            '<li class="li2_PJY">' +
            '<div class="hide">' +
            '<a href="javascript:;" class="reBack_PJY" id="' + userFile.userFileId + '_reBackFile"></a>' +
            '<a href="javascript:;" class="delete_PJY" id="' + userFile.userFileId + '_deleteFile"></a>' +
            '</div>' +
            '</li>' +
            '<li class="li3_PJY"><span>' + $T.byteUtil.getByte(userFile.fileBase.fileBaseTotalSize) + '</span></li>' +
            '<li class="li4_PJY"><span>10</span>天</li>' +
            '<li class="li5_PJY"><span>' + userFile.userFileUpdateTime + '</span></li>' +
            '</ul>';

        view.innerHTML = body;
        return $(view);
    }

}
$T.containerRecyclebinMediator = new ContainerRecyclebinMediator();