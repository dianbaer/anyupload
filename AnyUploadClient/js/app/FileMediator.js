function FileMediator() {
    // 上传文件map，生命周期结束后移除
    this.uploadFileMap = [];
    // 等待md5生成数组
    this.waitMD5Array = [];
    // md5生成数组
    this.md5Array = [];
    // 等待校验数组
    this.waitCheckArray = [];
    // 校验数组
    this.checkArray = [];
    // 等待上传数组
    this.waitUploadArray = [];
    // 上传数组
    this.uploadArray = [];
    // 可以关闭的数组
    this.closeArray = [];
    this.isOpen = false;
    this.allNum = 0;
    this.nowCompleteNum = 0;
    this.view1Num = 0;
    this.isFirst = true;
    this.init = function (view) {

    }
    // 注销方法
    this.dispose = function () {

    }
    // 关心消息数组
    this.listNotificationInterests = [$T.notificationExt.UPLOAD_FILE, $T.notificationExt.MD5_CHECK_SUCCESS, $T.notificationExt.MD5_CHECK_FAIL, $T.notificationExt.UPLOAD_FILE_SUCCESS, $T.notificationExt.UPLOAD_FILE_FAIL, $T.notificationExt.OPEN_UPLOADBOX];
    // 关心的消息处理
    this.handleNotification = function (data) {
        switch (data[0].name) {
            case $T.notificationExt.UPLOAD_FILE:
                this.upLoadFile(data[0].body);
                break;
            case $T.notificationExt.MD5_CHECK_SUCCESS:
                var result = data[0].body.result;
                var sendParam = data[0].body.sendParam;
                this.uploadFileMap[sendParam.uploadFileId].checkMD5Success(result);
                break;
            case $T.notificationExt.MD5_CHECK_FAIL:
                var result = data[0].body.result;
                var sendParam = data[0].body.sendParam;
                this.uploadFileMap[sendParam.uploadFileId].checkMD5Fail(result);
                break;
            case $T.notificationExt.UPLOAD_FILE_SUCCESS:
                var result = data[0].body.result;
                var sendParam = data[0].body.sendParam;
                this.uploadFileMap[sendParam.uploadFileId].uploadFileSuccess(result);
                break;
            case $T.notificationExt.UPLOAD_FILE_FAIL:
                var result = data[0].body.result;
                var sendParam = data[0].body.sendParam;
                this.uploadFileMap[sendParam.uploadFileId].uploadFileFail(result);
                break;
            case $T.notificationExt.OPEN_UPLOADBOX:
                this.openUploadBox();
                break;
        }
    }
    this.openUploadBox = function () {
        if (this.isOpen) {
            return;
        }
        this.isOpen = true;
        var uploadBoxT = '<div class="uploadBoxT clearfix">'
            + '<p class="fl" id="upload_box_num_text">正在上传（' + this.nowCompleteNum + '/' + this.allNum + '）</p>'
            + '<div class="fr">'
            + '<i class="minimize"></i>'
            + '<i class="all_cancel"></i>'
            + '</div>'
            + '</div>';
        layer.open({
            type: 1,
            title: uploadBoxT,
            closeBtn: 0, //不显示关闭按钮
            skin: 'uploadSkin',
            area: ['60%', '74%'],
            offset: 'rb',
            anim: 2,
            shade: 0,
            move: false, //禁止拖拽
            content: $("#index_uploadbox"),
            success: function (index, layero) {
//                        警告
                $(".warning i").click(function () {
                    $(this).parent().hide();
                });
                //滚动条
                $(".layui-layer-content .uploadBoxB ul").height($(".layui-layer-content").height() - 42);
                $(".layui-layer-content .uploadBoxB ul").mCustomScrollbar({
                    theme: "minimal"
                });
                $(".minimize").click(function () {
                    layer.closeAll();
                    $T.fileMediator.isOpen = false;
                });
                $(".all_cancel").click(function () {
                    var i = 0;
                    for (var key in $T.fileMediator.uploadFileMap) {
                        i++;
                        if (i >= 1) {
                            break;
                        }
                    }
                    if (i == 0) {
                        layer.closeAll();
                        $T.fileMediator.isOpen = false;
                        return;
                    }
                    layer.confirm('<br>清空上传列表会取消未上传完成的文件，您确定要清空上传列表吗？', {
                        title: "清空上传列表",
                        type: 1,
                        area: ['460px', 'auto'],
                        move: false,
                        btn1: function (index, layero) {
                            //按钮确定的回调
                            layer.closeAll();
                            $T.fileMediator.isOpen = false;
                            for (var key in $T.fileMediator.uploadFileMap) {
                                $T.fileMediator.uploadFileMap[key].isCancel = true;
                            }
                        },
                        btn2: function (index, layero) {

                        }
                    })
                });
            }
        });
    }
    this.advanceTime = function (passedTime) {
        if (this.md5Array.length < $T.fileConfig.MAX_MD5_MAKE_FILE_NUM) {
            for (var i = 0; i < this.waitMD5Array.length; i++) {
                var uploadFileObj = this.waitMD5Array.shift();
                if (uploadFileObj.isStop) {
                    uploadFileObj.stop();
                    i--;
                    // 放入可关闭数组
                    this.closeArray.push(uploadFileObj);
                    continue;
                }
                if (uploadFileObj.isCancel) {
                    this.removeUploadFile(uploadFileObj);
                    i--;
                    continue;
                }
                this.md5Array.push(uploadFileObj);
                uploadFileObj.startMD5Make();
                i--;
                if (this.md5Array.length == $T.fileConfig.MAX_MD5_MAKE_FILE_NUM) {
                    break;
                }

            }
        }
        for (var i = 0; i < this.md5Array.length; i++) {
            var uploadFileObj = this.md5Array[i];
            // 正在异步，不进行操作
            if (uploadFileObj.isLoad) {
                continue;
            }
            if (uploadFileObj.isCancel) {
                this.md5Array.splice(i, 1);
                this.removeUploadFile(uploadFileObj);
                i--;
                continue;
            }
            if (uploadFileObj.isStop) {
                this.md5Array.splice(i, 1);
                i--;
                if (uploadFileObj.status != $T.fileConfig.STATUS_READ_FILE_FAIL) {
                    uploadFileObj.stop();
                }
                // 放入可关闭数组
                this.closeArray.push(uploadFileObj);
                continue;
            }
            if (uploadFileObj.status == $T.fileConfig.STATUS_READ_FILE_FAIL) {
                // 失败，移出列表不用管了
                this.md5Array.splice(i, 1);
                i--;
                // 放入可关闭数组
                this.closeArray.push(uploadFileObj);
            } else if (uploadFileObj.status == $T.fileConfig.STATUS_MD5_SUCCESS) {
                this.waitCheckArray.push(uploadFileObj);
                uploadFileObj.enterMD5CheckArray();
                this.md5Array.splice(i, 1);
                i--;
            }
        }
        if (this.checkArray.length < $T.fileConfig.MAX_MD5_CHECK_FILE_NUM) {
            for (var i = 0; i < this.waitCheckArray.length; i++) {
                var uploadFileObj = this.waitCheckArray.shift();
                if (uploadFileObj.isStop) {
                    uploadFileObj.stop();
                    i--;
                    // 放入可关闭数组
                    this.closeArray.push(uploadFileObj);
                    continue;
                }
                if (uploadFileObj.isCancel) {
                    this.removeUploadFile(uploadFileObj);
                    i--;
                    continue;
                }
                this.checkArray.push(uploadFileObj);
                uploadFileObj.startMD5Check();
                i--;
                if (this.checkArray.length == $T.fileConfig.MAX_MD5_CHECK_FILE_NUM) {
                    break;
                }
            }
        }
        for (var i = 0; i < this.checkArray.length; i++) {
            var uploadFileObj = this.checkArray[i];
            if (uploadFileObj.isLoad) {
                continue;
            }
            if (uploadFileObj.isCancel) {
                this.checkArray.splice(i, 1);
                this.removeUploadFile(uploadFileObj);
                i--;
                continue;
            }
            if (uploadFileObj.isStop) {
                this.checkArray.splice(i, 1);
                i--;
                if (uploadFileObj.status != $T.fileConfig.STATUS_MD5_CHECK_FAIL && uploadFileObj.status != $T.fileConfig.STATUS_MD5_MOMENT_UPLOAD) {
                    uploadFileObj.stop();
                }
                // 放入可关闭数组
                this.closeArray.push(uploadFileObj);
                continue;
            }
            if (uploadFileObj.status == $T.fileConfig.STATUS_MD5_CHECK_SUCCESS) {
                this.waitUploadArray.push(uploadFileObj);
                uploadFileObj.enterWaitUploadArray();
                this.checkArray.splice(i, 1);
                i--;
            } else if (uploadFileObj.status == $T.fileConfig.STATUS_MD5_CHECK_FAIL) {
                this.checkArray.splice(i, 1);
                i--;
                // 放入可关闭数组
                this.closeArray.push(uploadFileObj);
            } else if (uploadFileObj.status == $T.fileConfig.STATUS_MD5_MOMENT_UPLOAD) {
                this.checkArray.splice(i, 1);
                i--;
                // 放入可关闭数组
                this.closeArray.push(uploadFileObj);
            }
        }
        if (this.uploadArray.length < $T.fileConfig.MAX_UPLOAD_FILE_NUM) {
            for (var i = 0; i < this.waitUploadArray.length; i++) {
                var uploadFileObj = this.waitUploadArray.shift();
                if (uploadFileObj.isStop) {
                    uploadFileObj.stop();
                    i--;
                    // 放入可关闭数组
                    this.closeArray.push(uploadFileObj);
                    continue;
                }
                if (uploadFileObj.isCancel) {
                    this.removeUploadFile(uploadFileObj);
                    i--;
                    continue;
                }
                this.uploadArray.push(uploadFileObj);
                uploadFileObj.startUploadFile();
                i--;
                if (this.uploadArray.length == $T.fileConfig.MAX_UPLOAD_FILE_NUM) {
                    break;
                }
            }
        }
        for (var i = 0; i < this.uploadArray.length; i++) {
            var uploadFileObj = this.uploadArray[i];
            if (uploadFileObj.isLoad) {
                continue;
            }
            if (uploadFileObj.isCancel) {
                this.uploadArray.splice(i, 1);
                this.removeUploadFile(uploadFileObj);
                i--;
                continue;
            }
            if (uploadFileObj.isStop) {
                this.uploadArray.splice(i, 1);
                i--;
                if (uploadFileObj.status != $T.fileConfig.STATUS_MD5_MOMENT_UPLOAD && uploadFileObj.status != $T.fileConfig.STATUS_RESPONSE_UPLOAD_FAIL && uploadFileObj.status != $T.fileConfig.STATUS_UPLOAD_SUCCESS) {
                    uploadFileObj.stop();
                }
                // 放入可关闭数组
                this.closeArray.push(uploadFileObj);
                continue;
            }
            if (uploadFileObj.status == $T.fileConfig.STATUS_RESPONSE_UPLOAD_FAIL) {
                this.uploadArray.splice(i, 1);
                i--;
                // 放入可关闭数组
                this.closeArray.push(uploadFileObj);
            } else if (uploadFileObj.status == $T.fileConfig.STATUS_MD5_MOMENT_UPLOAD) {
                this.uploadArray.splice(i, 1);
                i--;
                // 放入可关闭数组
                this.closeArray.push(uploadFileObj);
            } else if (uploadFileObj.status == $T.fileConfig.STATUS_UPLOAD_SUCCESS) {
                this.uploadArray.splice(i, 1);
                i--;
                // 放入可关闭数组
                this.closeArray.push(uploadFileObj);
            } else if (uploadFileObj.status == $T.fileConfig.STATUS_RESPONSE_UPLOAD_SUCCESS) {
                uploadFileObj.uploadFile(false);
            }
        }
        for (var i = 0; i < this.closeArray.length; i++) {
            var uploadFileObj = this.closeArray[i];
            if (uploadFileObj.isCancel) {
                this.closeArray.splice(i, 1);
                this.removeUploadFile(uploadFileObj);
                i--;
                continue;
            }
        }
    }
    this.upLoadFile = function (fileList) {
        if (fileList == null || fileList.length == 0) {
            return;
        }
        if (this.isFirst) {
            this.openUploadBox();
            this.isFirst = false;
        }
        for (var i = 0; i < fileList.length; i++) {
            var file = fileList[i];
            var uploadFileObj = new UploadFileObj();
            uploadFileObj.init(file, $T.fileConfig.getIncrementId());
            $(".uploadBoxB .mCSB_container").append(uploadFileObj.view);
            $("#mCSB_1_container").append(uploadFileObj.view1);
            uploadFileObj.addListener();
            uploadFileObj.addEventListener($T.uploadEventType.ADD_WAIT_MD5_ARRAY, this.addWaitMd5Array, this);
            uploadFileObj.addEventListener($T.uploadEventType.ADD_MD5_CHECK_ARRAY_AND_LOAD, this.addMd5CheckArrayAndLoad, this);
            uploadFileObj.addEventListener($T.uploadEventType.ADD_MD5_CHECK_ARRAY, this.addMd5CheckArray, this);
            uploadFileObj.addEventListener($T.uploadEventType.ADD_WAIT_CHECK_ARRAY, this.addWaitCheckArray, this);
            uploadFileObj.addEventListener($T.uploadEventType.ADD_CHECK_ARRAY, this.addCheckArray, this);
            uploadFileObj.addEventListener($T.uploadEventType.ADD_WAIT_UPLOAD_ARRAY, this.addWaitUploadArray, this);
            uploadFileObj.addEventListener($T.uploadEventType.ADD_UPLOAD_ARRAY, this.addUploadArray, this);
            uploadFileObj.addEventListener($T.uploadEventType.UPLOAD_COMPLETE, this.onUploadComplete, this);
            uploadFileObj.addEventListener($T.uploadEventType.OPEN_UPLOAD_BOX, this.onOpenUploadBox, this);
            uploadFileObj.addEventListener($T.uploadEventType.OPEN_CANCEL_CHOOSE_BOX, this.onOpenCancelChooseBox, this);
            uploadFileObj.addEventListener($T.uploadEventType.REMOVE_VIEW1, this.onRemoveView1, this);
            uploadFileObj.addEventListener($T.uploadEventType.CHANGE_USER_FOLD, this.onChangeUserFold, this);
            this.waitMD5Array.push(uploadFileObj);
            this.uploadFileMap[uploadFileObj.id] = uploadFileObj;
            this.allNum++;
            this.view1Num++;
        }
        $("#upload_box_num_text").text("正在上传（" + this.nowCompleteNum + "/" + this.allNum + "）");
        $("#right_upload_num_text").text("正在上传（" + this.view1Num + "）");
        $("#right_uploadnone_style").hide();
    }
    this.removeUploadFile = function (uploadFileObj) {
        uploadFileObj.view.remove();
        uploadFileObj.view1.remove();
        this.allNum--;
        if (uploadFileObj.status == $T.fileConfig.STATUS_MD5_MOMENT_UPLOAD || uploadFileObj.status == $T.fileConfig.STATUS_UPLOAD_SUCCESS) {
            this.nowCompleteNum--;
        }
        $("#upload_box_num_text").text("正在上传（" + this.nowCompleteNum + "/" + this.allNum + "）");
        delete this.uploadFileMap[uploadFileObj.id];
    }
    this.addWaitMd5Array = function (event) {
        var uploadFileObj = event.mTarget;
        this.removeCloseArray(uploadFileObj);
        this.waitMD5Array.push(uploadFileObj);
    }
    this.addMd5CheckArrayAndLoad = function (event) {
        var uploadFileObj = event.mTarget;
        this.removeCloseArray(uploadFileObj);
        this.md5Array.push(uploadFileObj);
        uploadFileObj.loadNext();

    }
    this.addMd5CheckArray = function (event) {
        var uploadFileObj = event.mTarget;
        this.removeCloseArray(uploadFileObj);
        this.md5Array.push(uploadFileObj);
    }
    this.addWaitCheckArray = function (event) {
        var uploadFileObj = event.mTarget;
        this.removeCloseArray(uploadFileObj);
        this.waitCheckArray.push(uploadFileObj);
    }
    this.addCheckArray = function (event) {
        var uploadFileObj = event.mTarget;
        this.removeCloseArray(uploadFileObj);
        this.checkArray.push(uploadFileObj);
    }
    this.addWaitUploadArray = function (event) {
        var uploadFileObj = event.mTarget;
        this.removeCloseArray(uploadFileObj);
        this.waitUploadArray.push(uploadFileObj);
    }
    this.addUploadArray = function (event) {
        var uploadFileObj = event.mTarget;
        this.removeCloseArray(uploadFileObj);
        this.uploadArray.push(uploadFileObj);

    }
    this.removeCloseArray = function (uploadFileObj) {
        for (var i = 0; i < this.closeArray.length; i++) {
            var uploadFileObj1 = this.closeArray[i];
            if (uploadFileObj1.id == uploadFileObj.id) {
                this.closeArray.splice(i, 1);
                break;
            }

        }
    }
    this.onUploadComplete = function (event) {
        $T.viewManager.notifyObservers($T.viewManager.getNotification($T.notificationExt.REFRESH_NOW_USERFOLD));
        $T.boxInfoProxy.getBoxInfo($T.cookieParam.getCookieParam($T.cookieName.USER_FOLD_TOP_ID));
        this.nowCompleteNum++;
        $("#upload_box_num_text").text("正在上传（" + this.nowCompleteNum + "/" + this.allNum + "）");
    }
    this.onOpenUploadBox = function (event) {
        this.openUploadBox();
    }
    this.onRemoveView1 = function () {
        this.view1Num--;
        if (this.view1Num == 0) {
            $("#right_uploadnone_style").show();
        }
        $("#right_upload_num_text").text("正在上传（" + this.view1Num + "）");
    }
    this.onOpenCancelChooseBox = function (event) {
        var uploadFileObj = event.mTarget;
        layer.confirm('<br>' + uploadFileObj.file.name + '，您确定要取消上传吗？', {
            title: "取消上传",
            type: 1,
            area: ['460px', 'auto'],
            move: false,
            btn1: function (index, layero) {
                //按钮确定的回调
                layer.close(index);
                uploadFileObj.isCancel = true;

            },
            btn2: function (index, layero) {

            }
        })
    }
    this.onChangeUserFold = function (event) {
        var uploadFileObj = event.mTarget;
        $T.userFoldProxy.getUserFoldChildren(uploadFileObj.nowFoldId);
    }

}
$T.fileMediator = new FileMediator();