function ImagePreviewMediator() {
    this.nowUserFoldChildrenImage;
    this.showPos = 0;
    this.pageSize = 5;
    this.pageObj;
    this.nowUserFileImage;
    this.imageRotate = [];
    this.init = function (view, userFileId) {

        this.nowUserFoldChildrenImage = [];
        this.initView(userFileId);
        $("#yunLeft").on("click", this.onLeftClick);
        $("#yunRight").on("click", this.onRightClick);

        $("#image_preview_left_rotate").on("click", this.onLeftRotate);
        $("#image_preview_right_rotate").on("click", this.onRightRotate);
        $("#image_preview_download").on("click", this.onDownload);
        $("#image_preview_delete").on("click", this.onDelete);

        var w1 = $(window).width();
        var h1 = $(window).height();
        layer.open({
            type: 1,
            skin: "layer1_P",
            content: $('.yunPopBg'),
            area: [w1 + "px", h1 + "px"],
            offset: ['0', '0'],
            success: function (index, layero) {
                //关闭按钮
                $(".yunCloseBtn").on("click", function () {
                    $(".layer1_P .layui-layer-close1").trigger("click")
                });

                //左右剪头hover效果
                $(".leftBtn").hover(function () {
                    $("#yunLeft").css("background", "url(images/yunPrev_hover.png) no-repeat");
                }, function () {
                    $("#yunLeft").css("background", "url(images/yunPrev.png) no-repeat");
                });
                $(".rightBtn").hover(function () {
                    $("#yunRight").css("background", "url(images/yunNext_hover.png) no-repeat");
                }, function () {
                    $("#yunRight").css("background", "url(images/yunNext.png) no-repeat");
                })

                //比较函数
            }
        })
    }
    this.onLeftRotate = function () {
        if (!$("#" + $T.imagePreviewMediator.nowUserFileImage.userFileId + "_previewimg").hasClass("preview_complete")) {
            return;
        }
        var image = $("#" + $T.imagePreviewMediator.nowUserFileImage.userFileId + "_previewimg");
        if ($T.imagePreviewMediator.imageRotate[$T.imagePreviewMediator.nowUserFileImage.userFileId] == null) {
            $T.imagePreviewMediator.imageRotate[$T.imagePreviewMediator.nowUserFileImage.userFileId] = 90;
        } else {
            $T.imagePreviewMediator.imageRotate[$T.imagePreviewMediator.nowUserFileImage.userFileId] -= 90;
        }
        image.rotate($T.imagePreviewMediator.imageRotate[$T.imagePreviewMediator.nowUserFileImage.userFileId]);
    }
    this.onRightRotate = function () {
        if (!$("#" + $T.imagePreviewMediator.nowUserFileImage.userFileId + "_previewimg").hasClass("preview_complete")) {
            return;
        }
        var image = $("#" + $T.imagePreviewMediator.nowUserFileImage.userFileId + "_previewimg");
        if ($T.imagePreviewMediator.imageRotate[$T.imagePreviewMediator.nowUserFileImage.userFileId] == null) {
            $T.imagePreviewMediator.imageRotate[$T.imagePreviewMediator.nowUserFileImage.userFileId] = 90;
        } else {
            $T.imagePreviewMediator.imageRotate[$T.imagePreviewMediator.nowUserFileImage.userFileId] += 90;
        }
        image.rotate($T.imagePreviewMediator.imageRotate[$T.imagePreviewMediator.nowUserFileImage.userFileId]);
    }
    this.onDownload = function () {
        window.open($T.userFileProxy.getUserFile($T.imagePreviewMediator.nowUserFileImage.userFileId));
    }
    this.onDelete = function () {
        layer.confirm('<br>确认要把所选文件放入回收站吗？<br>删除的文件可在10天内通过回收站还原', {
            title: "确认删除",
            skin: "layer2_P",
            type: 1,
            area: ['460px', 'auto'],
            move: false,
            btn1: function (index, layero) {
                layer.close(index);
                $T.mutliOperateProxy.toRecyclebin(null, [$T.imagePreviewMediator.nowUserFileImage.userFileId]);
            },
            btn2: function (index, layero) {
                layer.close(index);
            }
        })
    }
    this.onLeftClick = function () {
        $T.imagePreviewMediator.showPos--;
        if ($T.imagePreviewMediator.showPos < 1) {
            $T.imagePreviewMediator.showPos = 1;
            return;
        }
        $T.imagePreviewMediator.recountImage();

    }
    this.onRightClick = function () {
        $T.imagePreviewMediator.showPos++;
        if ($T.imagePreviewMediator.showPos > $T.imagePreviewMediator.nowUserFoldChildrenImage.length) {
            $T.imagePreviewMediator.showPos = $T.imagePreviewMediator.nowUserFoldChildrenImage.length;
            return;
        }
        $T.imagePreviewMediator.recountImage();

    }
    this.recountImage = function () {
        var currentPage = parseInt(Math.ceil($T.imagePreviewMediator.showPos / $T.imagePreviewMediator.pageSize));
        var pageObj = $T.pageFormat.format(currentPage, $T.imagePreviewMediator.pageSize, $T.imagePreviewMediator.nowUserFoldChildrenImage.length);
        if (pageObj.currentPage != $T.imagePreviewMediator.pageObj.currentPage) {
            $T.imagePreviewMediator.pageObj = pageObj;
            $T.imagePreviewMediator.changeView();
        } else {
            $T.imagePreviewMediator.pageObj = pageObj;
            $("#" + $T.imagePreviewMediator.nowUserFileImage.userFileId + "_imagepreview").css("visibility", "hidden");
            $T.imagePreviewMediator.nowUserFileImage = $T.imagePreviewMediator.nowUserFoldChildrenImage[$T.imagePreviewMediator.showPos - 1];
            if ($("#" + $T.imagePreviewMediator.nowUserFileImage.userFileId + "_previewimg").hasClass("preview_complete")) {
                $("#" + $T.imagePreviewMediator.nowUserFileImage.userFileId + "_imagepreview").css("visibility", "visible");
            }

        }
        this.resetName();
    }
    this.resetName = function () {
        $("#image_preview_filename").text(this.nowUserFileImage.userFileName);
        $("#image_preview_foldName").text("所属文件夹：" + $T.fileSystemStatus.nowFoldName);
        $("#image_preview_time").text("修改日期:" + this.nowUserFileImage.userFileUpdateTime);
    }
    // 注销方法
    this.dispose = function () {

    }
    // 关心消息数组
    this.listNotificationInterests = [$T.notificationExt.GET_FOLD_CHILDREN_SUCCESS];
    // 关心的消息处理
    this.handleNotification = function (data) {
        switch (data[0].name) {
            case $T.notificationExt.GET_FOLD_CHILDREN_SUCCESS:
                this.getFoldChildrenSuccess();
                break;
        }
    }
    this.getFoldChildrenSuccess = function () {
        if ($T.userFoldProxy.nowFoldChildren == null || $T.userFoldProxy.nowFoldChildren.userFileList == null) {
            $(".layer1_P .layui-layer-close1").trigger("click");
            return;
        }
        //清空
        this.nowUserFoldChildrenImage = [];
        for (var i = 0; i < $T.userFoldProxy.nowFoldChildren.userFileList.length; i++) {
            var userFile = $T.userFoldProxy.nowFoldChildren.userFileList[i];
            if (!$T.postfixUtil.isImage(userFile.userFileName)) {
                continue;
            }
            this.nowUserFoldChildrenImage.push(userFile);
        }
        if (this.nowUserFoldChildrenImage.length == 0) {
            $(".layer1_P .layui-layer-close1").trigger("click");
            return;
        }
        if (this.showPos > this.nowUserFoldChildrenImage.length) {
            this.showPos = this.nowUserFoldChildrenImage.length;
        }
        var currentPage = parseInt(Math.ceil(this.showPos / this.pageSize));
        this.pageObj = $T.pageFormat.format(currentPage, this.pageSize, this.nowUserFoldChildrenImage.length);
        this.changeView();
    }
    this.initView = function (userFileId) {
        if ($T.userFoldProxy.nowFoldChildren == null || $T.userFoldProxy.nowFoldChildren.userFileList == null) {
            return;
        }
        for (var i = 0; i < $T.userFoldProxy.nowFoldChildren.userFileList.length; i++) {
            var userFile = $T.userFoldProxy.nowFoldChildren.userFileList[i];
            if (!$T.postfixUtil.isImage(userFile.userFileName)) {
                continue;
            }
            this.nowUserFoldChildrenImage.push(userFile);
            if (userFile.userFileId == userFileId) {
                this.showPos = this.nowUserFoldChildrenImage.length;
            }
        }
        var currentPage = parseInt(Math.ceil(this.showPos / this.pageSize));
        this.pageObj = $T.pageFormat.format(currentPage, this.pageSize, this.nowUserFoldChildrenImage.length);
        this.changeView();
    }
    this.changeView = function () {
        $("#image_preview_container")[0].innerHTML = "";
        for (var i = this.pageObj.start; i < this.pageObj.end; i++) {
            var userFile = this.nowUserFoldChildrenImage[i];
            var view = this.createImageView(userFile);
            view.addClass("photoBox");
            if ((this.showPos - 1) == i) {
                this.nowUserFileImage = userFile;
            }
            $("#image_preview_container").append(view);
            view.css("visibility", "hidden");
            var img = $("#" + userFile.userFileId + "_previewimg");
            img.load(this.onImageLoadCompelte);
        }
        var windowH = $(window).height();
        var sw = window.screen.width * 0.9;
        var wrapH = windowH * 0.65;
        $(".yunPhotoWrap").css("height", wrapH);
        $(".photoBox,.photoBox >div").css({
            "height": wrapH,
            "width": sw
        });
        $(".photoBox").css({
            "height": wrapH,
            "width": sw,
        });
        this.resetName();
        this.imageRotate = [];
    }
    this.onImageLoadCompelte = function () {
        var windowH = $(window).height();
        var sw = window.screen.width * 0.9;
        var wrapH = windowH * 0.75;

        var marginleft = 0;
        var margintop = 0;

        var img = $("#" + this.id);
        var idArray = this.id.split("_");
        var photoBox = $("#" + idArray[0] + "_imagepreview");
        var imgWidth = img.width();
        var imgHeight = img.height();
        var photoBoxWidth = photoBox.width();
        var photoBoxHeight = photoBox.height();
        var newImgWidth;
        var newImgHeight;
        //规则1：图片高度与宽度不能大于div高度
        //规则2：图片宽度不能大于div宽度
        //规则3：等比例缩放
        if (imgWidth >= imgHeight) {
            //以宽度为标准缩放
            if (imgWidth <= photoBoxHeight) {
                //不用缩放
                newImgWidth = imgWidth;
                newImgHeight = imgHeight;
            } else {
                newImgWidth = photoBoxHeight;
                newImgHeight = (imgHeight / imgWidth) * newImgWidth;
            }
        } else {
            //以高度为标准缩放
            if (imgHeight <= photoBoxHeight) {
                //不用缩放
                newImgWidth = imgWidth;
                newImgHeight = imgHeight;
            } else {
                newImgHeight = photoBoxHeight;
                newImgWidth = (imgWidth / imgHeight) * newImgHeight;
            }
        }
        img.height(newImgHeight);
        img.width(newImgWidth);

        marginleft += (photoBoxWidth) / 2;
        if (windowH > 730) {
            margintop += ((photoBoxHeight) + windowH * 0.175 ) / 2;
        } else {
            margintop += ((photoBoxHeight)) / 2;
        }
        photoBox.css("margin-left", -marginleft);
        photoBox.css("margin-top", -margintop);
        img.addClass("preview_complete");
        if (idArray[0] == $T.imagePreviewMediator.nowUserFileImage.userFileId) {
            photoBox.css("visibility", "visible");
        }
    }

    this.createImageView = function (userFile) {
        var view = document.createElement("div");
        var body =
            '<div>' +
            '<img id="' + userFile.userFileId + '_previewimg" src="' + $T.userFileProxy.getUserFileImage(userFile.userFileId) + '" class="img" num="0"/>' +

            '<span class="leftBtn "></span>' +
            '<span class="rightBtn "></span>' +
            '</div>';
        view.innerHTML = body;
        view.id = userFile.userFileId + "_imagepreview";
        return $(view);
    }

}
$T.imagePreviewMediator = new ImagePreviewMediator();