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
    this.initView = function () {
        this.onChange(this, this.onUploadFileButtonChange);
        juggle.jugglerManager.juggler.add(this);
    };
    this.onChange = function (mediator, call) {
        this.onLoadFunc = function (event) {
            call.call(mediator, event);
        };
        $("#allfile_head_uploadfilebutton").on("change", this.onLoadFunc);
    };
    this.onUploadFileButtonChange = function (e) {
        if (!("FileReader" in window) || !("File" in window)) {
            alert("您的浏览器不支持html5，请使用google，firefox，ie10等浏览器");
            return;
        }
        var files = e.target.files;
        this.upLoadFile(files);
        $("#allfile_head_uploadfilebutton").val("");
    };
    // 关心消息数组
    this.listNotificationInterests = [notificationExt.UPLOAD_FILE, notificationExt.MD5_CHECK_SUCCESS, notificationExt.MD5_CHECK_FAIL, notificationExt.UPLOAD_FILE_SUCCESS, notificationExt.UPLOAD_FILE_FAIL, notificationExt.OPEN_UPLOADBOX];
    // 关心的消息处理
    this.handleNotification = function (data) {
        var result, sendParam;
        switch (data.name) {
            case notificationExt.UPLOAD_FILE:
                this.upLoadFile(data.body);
                break;
            case notificationExt.MD5_CHECK_SUCCESS:
                result = data.body.result;
                sendParam = data.body.sendParam;
                this.uploadFileMap[sendParam.uploadFileId].checkMD5Success(result);
                break;
            case notificationExt.MD5_CHECK_FAIL:
                result = data.body.result;
                sendParam = data.body.sendParam;
                this.uploadFileMap[sendParam.uploadFileId].checkMD5Fail(result);
                break;
            case notificationExt.UPLOAD_FILE_SUCCESS:
                result = data.body.result;
                sendParam = data.body.sendParam;
                this.uploadFileMap[sendParam.uploadFileId].uploadFileSuccess(result);
                break;
            case notificationExt.UPLOAD_FILE_FAIL:
                result = data.body.result;
                sendParam = data.body.sendParam;
                this.uploadFileMap[sendParam.uploadFileId].uploadFileFail(result);
                break;
            case notificationExt.OPEN_UPLOADBOX:
                this.openUploadBox();
                break;
        }
    };
    this.openUploadBox = function () {
        if (this.isOpen) {
            return;
        }
        this.isOpen = true;

    };
    this.advanceTime = function (passedTime) {
        if (this.md5Array.length < fileConfig.MAX_MD5_MAKE_FILE_NUM) {
            var i, uploadFileObj;
            for (i = 0; i < this.waitMD5Array.length; i++) {
                uploadFileObj = this.waitMD5Array.shift();
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
                if (this.md5Array.length === fileConfig.MAX_MD5_MAKE_FILE_NUM) {
                    break;
                }

            }
        }
        for (i = 0; i < this.md5Array.length; i++) {
            uploadFileObj = this.md5Array[i];
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
                if (uploadFileObj.status !== fileConfig.STATUS_READ_FILE_FAIL) {
                    uploadFileObj.stop();
                }
                // 放入可关闭数组
                this.closeArray.push(uploadFileObj);
                continue;
            }
            if (uploadFileObj.status === fileConfig.STATUS_READ_FILE_FAIL) {
                // 失败，移出列表不用管了
                this.md5Array.splice(i, 1);
                i--;
                // 放入可关闭数组
                this.closeArray.push(uploadFileObj);
            } else if (uploadFileObj.status === fileConfig.STATUS_MD5_SUCCESS) {
                this.waitCheckArray.push(uploadFileObj);
                uploadFileObj.enterMD5CheckArray();
                this.md5Array.splice(i, 1);
                i--;
            }
        }
        if (this.checkArray.length < fileConfig.MAX_MD5_CHECK_FILE_NUM) {
            for (i = 0; i < this.waitCheckArray.length; i++) {
                uploadFileObj = this.waitCheckArray.shift();
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
                if (this.checkArray.length === fileConfig.MAX_MD5_CHECK_FILE_NUM) {
                    break;
                }
            }
        }
        for (i = 0; i < this.checkArray.length; i++) {
            uploadFileObj = this.checkArray[i];
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
                if (uploadFileObj.status !== fileConfig.STATUS_MD5_CHECK_FAIL && uploadFileObj.status !== fileConfig.STATUS_MD5_MOMENT_UPLOAD) {
                    uploadFileObj.stop();
                }
                // 放入可关闭数组
                this.closeArray.push(uploadFileObj);
                continue;
            }
            if (uploadFileObj.status === fileConfig.STATUS_MD5_CHECK_SUCCESS) {
                this.waitUploadArray.push(uploadFileObj);
                uploadFileObj.enterWaitUploadArray();
                this.checkArray.splice(i, 1);
                i--;
            } else if (uploadFileObj.status === fileConfig.STATUS_MD5_CHECK_FAIL) {
                this.checkArray.splice(i, 1);
                i--;
                // 放入可关闭数组
                this.closeArray.push(uploadFileObj);
            } else if (uploadFileObj.status === fileConfig.STATUS_MD5_MOMENT_UPLOAD) {
                this.checkArray.splice(i, 1);
                i--;
                // 放入可关闭数组
                this.closeArray.push(uploadFileObj);
            }
        }
        if (this.uploadArray.length < fileConfig.MAX_UPLOAD_FILE_NUM) {
            for (i = 0; i < this.waitUploadArray.length; i++) {
                uploadFileObj = this.waitUploadArray.shift();
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
                if (this.uploadArray.length === fileConfig.MAX_UPLOAD_FILE_NUM) {
                    break;
                }
            }
        }
        for (i = 0; i < this.uploadArray.length; i++) {
            uploadFileObj = this.uploadArray[i];
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
                if (uploadFileObj.status !== fileConfig.STATUS_MD5_MOMENT_UPLOAD && uploadFileObj.status !== fileConfig.STATUS_RESPONSE_UPLOAD_FAIL && uploadFileObj.status !== fileConfig.STATUS_UPLOAD_SUCCESS) {
                    uploadFileObj.stop();
                }
                // 放入可关闭数组
                this.closeArray.push(uploadFileObj);
                continue;
            }
            if (uploadFileObj.status === fileConfig.STATUS_RESPONSE_UPLOAD_FAIL) {
                this.uploadArray.splice(i, 1);
                i--;
                // 放入可关闭数组
                this.closeArray.push(uploadFileObj);
            } else if (uploadFileObj.status === fileConfig.STATUS_MD5_MOMENT_UPLOAD) {
                this.uploadArray.splice(i, 1);
                i--;
                // 放入可关闭数组
                this.closeArray.push(uploadFileObj);
            } else if (uploadFileObj.status === fileConfig.STATUS_UPLOAD_SUCCESS) {
                this.uploadArray.splice(i, 1);
                i--;
                // 放入可关闭数组
                this.closeArray.push(uploadFileObj);
            } else if (uploadFileObj.status === fileConfig.STATUS_RESPONSE_UPLOAD_SUCCESS) {
                uploadFileObj.uploadFile(false);
            }
        }
        for (i = 0; i < this.closeArray.length; i++) {
            uploadFileObj = this.closeArray[i];
            if (uploadFileObj.isCancel) {
                this.closeArray.splice(i, 1);
                this.removeUploadFile(uploadFileObj);
                i--;
            }
        }
    };
    this.upLoadFile = function (fileList) {
        if (fileList === null || fileList.length === 0) {
            return;
        }

        for (var i = 0; i < fileList.length; i++) {
            var file = fileList[i];
            var uploadFileObj = new UploadFileObj();
            uploadFileObj.init(file, fileConfig.getIncrementId());
            $("#upload_box_upload_itemcontainer").append(uploadFileObj.view);
            $("#mCSB_1_container").append(uploadFileObj.view1);
            uploadFileObj.addListener();
            uploadFileObj.addEventListener(uploadEventType.ADD_WAIT_MD5_ARRAY, this.addWaitMd5Array, this);
            uploadFileObj.addEventListener(uploadEventType.ADD_MD5_CHECK_ARRAY_AND_LOAD, this.addMd5CheckArrayAndLoad, this);
            uploadFileObj.addEventListener(uploadEventType.ADD_MD5_CHECK_ARRAY, this.addMd5CheckArray, this);
            uploadFileObj.addEventListener(uploadEventType.ADD_WAIT_CHECK_ARRAY, this.addWaitCheckArray, this);
            uploadFileObj.addEventListener(uploadEventType.ADD_CHECK_ARRAY, this.addCheckArray, this);
            uploadFileObj.addEventListener(uploadEventType.ADD_WAIT_UPLOAD_ARRAY, this.addWaitUploadArray, this);
            uploadFileObj.addEventListener(uploadEventType.ADD_UPLOAD_ARRAY, this.addUploadArray, this);
            uploadFileObj.addEventListener(uploadEventType.UPLOAD_COMPLETE, this.onUploadComplete, this);
            uploadFileObj.addEventListener(uploadEventType.OPEN_UPLOAD_BOX, this.onOpenUploadBox, this);
            uploadFileObj.addEventListener(uploadEventType.OPEN_CANCEL_CHOOSE_BOX, this.onOpenCancelChooseBox, this);
            uploadFileObj.addEventListener(uploadEventType.REMOVE_VIEW1, this.onRemoveView1, this);
            uploadFileObj.addEventListener(uploadEventType.CHANGE_USER_FOLD, this.onChangeUserFold, this);
            this.waitMD5Array.push(uploadFileObj);
            this.uploadFileMap[uploadFileObj.id] = uploadFileObj;
            this.allNum++;
            this.view1Num++;
        }
        $("#upload_box_num_text").text("正在上传（" + this.nowCompleteNum + "/" + this.allNum + "）");
        $("#right_upload_num_text").text("正在上传（" + this.view1Num + "）");
        $("#right_uploadnone_style").hide();
    };
    this.removeUploadFile = function (uploadFileObj) {
        uploadFileObj.view.remove();
        uploadFileObj.view1.remove();
        this.allNum--;
        if (uploadFileObj.status === fileConfig.STATUS_MD5_MOMENT_UPLOAD || uploadFileObj.status === fileConfig.STATUS_UPLOAD_SUCCESS) {
            this.nowCompleteNum--;
        }
        $("#upload_box_num_text").text("正在上传（" + this.nowCompleteNum + "/" + this.allNum + "）");
        delete this.uploadFileMap[uploadFileObj.id];
    };
    this.addWaitMd5Array = function (event) {
        var uploadFileObj = event.mTarget;
        this.removeCloseArray(uploadFileObj);
        this.waitMD5Array.push(uploadFileObj);
    };
    this.addMd5CheckArrayAndLoad = function (event) {
        var uploadFileObj = event.mTarget;
        this.removeCloseArray(uploadFileObj);
        this.md5Array.push(uploadFileObj);
        uploadFileObj.loadNext();

    };
    this.addMd5CheckArray = function (event) {
        var uploadFileObj = event.mTarget;
        this.removeCloseArray(uploadFileObj);
        this.md5Array.push(uploadFileObj);
    };
    this.addWaitCheckArray = function (event) {
        var uploadFileObj = event.mTarget;
        this.removeCloseArray(uploadFileObj);
        this.waitCheckArray.push(uploadFileObj);
    };
    this.addCheckArray = function (event) {
        var uploadFileObj = event.mTarget;
        this.removeCloseArray(uploadFileObj);
        this.checkArray.push(uploadFileObj);
    };
    this.addWaitUploadArray = function (event) {
        var uploadFileObj = event.mTarget;
        this.removeCloseArray(uploadFileObj);
        this.waitUploadArray.push(uploadFileObj);
    };
    this.addUploadArray = function (event) {
        var uploadFileObj = event.mTarget;
        this.removeCloseArray(uploadFileObj);
        this.uploadArray.push(uploadFileObj);

    };
    this.removeCloseArray = function (uploadFileObj) {
        for (var i = 0; i < this.closeArray.length; i++) {
            var uploadFileObj1 = this.closeArray[i];
            if (uploadFileObj1.id === uploadFileObj.id) {
                this.closeArray.splice(i, 1);
                break;
            }

        }
    };
    this.onUploadComplete = function (event) {
        this.notifyObservers(this.getNotification(notificationExt.REFRESH_NOW_USERFOLD));
        this.nowCompleteNum++;
        $("#upload_box_num_text").text("正在上传（" + this.nowCompleteNum + "/" + this.allNum + "）");
    };
    this.onOpenUploadBox = function (event) {
        this.openUploadBox();
    };
    this.onRemoveView1 = function () {
        this.view1Num--;
        if (this.view1Num === 0) {
            $("#right_uploadnone_style").show();
        }
        $("#right_upload_num_text").text("正在上传（" + this.view1Num + "）");
    };
    this.onOpenCancelChooseBox = function (event) {
        var uploadFileObj = event.mTarget;
        uploadFileObj.isCancel = true;
    };
    this.onChangeUserFold = function (event) {
        var uploadFileObj = event.mTarget;
        $T.userFoldProxy.getUserFoldChildren(uploadFileObj.nowFoldId);
    };
    juggle.Mediator.apply(this);
}