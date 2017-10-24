function UploadFileObj() {
    this.file;// 文件
    this.id;// 唯一id
    this.view;// 视图
    this.view1;// 视图
    this.sparkMD5;// md5工具
    this.fileReader;// 读取文件工具
    this.currentChunk;// 当前块
    this.totalChunk;// 总块数
    this.md5;// md5值说明完成
    this.onLoadFunc;// 加载完成函数
    this.onErrorFunc;// 报错函数
    this.status;// 状态 1：开始,2:读取文件失败，3读取文件成功
    this.userFileId = null;// 当前上传得文件id
    this.resultData;// 返回数据（fileBasePos、uploadMaxLength）
    this.lastTime;// 上一次时间
    this.nowFoldId;
    this.nowFoldName;
    this.isStop = false;// 是否暂停
    this.isCancel = false;// 是否关闭
    this.isLoad = false;// 是否正在异步
}
UploadFileObj.prototype.createView1 = function (text) {
    var view = document.createElement("li");
    var body =
        '<div class="file_name clearfix">' +
        '<span class="file_icon ' + $T.postfixUtil.getClassByFileName(this.file.name) + '"></span>' +
        '<p title="' + this.file.name + '">' +
        this.file.name +
        '</p>' +
        '</div>' +
        '<div class="file_status">' +
        '<span class="pro_pre" id="' + this.id + '_text1">' + text + '</span>' +
        '</div>' +
        '<div class="progress" id="' + this.id + '_progress1"></div>';
    view.innerHTML = body;
    this.view1 = $(view);

}
UploadFileObj.prototype.createView = function (text) {
    var view = document.createElement("li");
    var body =
        '<div class="info">' +
        '<div class="file_name clearfix">' +
        '<span class="file_icon ' + $T.postfixUtil.getClassByFileName(this.file.name) + '"></span>' +
        '<p title="' + this.file.name + '">' +
        this.file.name +
        '</p>' +
        '</div>' +
        '<div class="file_size" title="' + $T.byteUtil.getByte(this.file.size) + '">' +
        $T.byteUtil.getByte(this.file.size) +
        '</div>' +
        '<div class="file_path">' +
        '<a href="javascrtipt:;" title="' + this.nowFoldName + '" id="' + this.id + '_fold">' + this.nowFoldName + '</a>' +
        '</div>' +
        '<div class="file_status">' +
        '<div class="processBox_PJY">' +
        '<p>' +
        '<span id="' + this.id + '_progress"></span>' +
        '</p>' +
        '</div>' +
        '<span class="alreadyP_PJY" id="' + this.id + '_text"></span>' +
        '</div>' +
        '<div class="file_operate">' +
        '<div class="pause" id="' + this.id + '_stop"></div>' +
        '<div class="start" id="' + this.id + '_start"></div>&nbsp;&nbsp;&nbsp;&nbsp;' +
        '<div id="' + this.id + '_retry"></div>' +
        '<div class="cancel" id="' + this.id + '_cancel"></div>' +
        '</div>' +
        '<div class="clear"></div>' +
        '</div>';
    view.innerHTML = body;
    this.view = $(view);
}
UploadFileObj.prototype.updateView = function (text) {
    $("#" + this.id + "_text").text(text);
}
UploadFileObj.prototype.updateView1 = function (text) {
    $("#" + this.id + "_text1").text(text);
}
UploadFileObj.prototype.updateProgress = function (text) {
    $("#" + this.id + "_progress").attr({"style": "width:" + text + ""});
}
UploadFileObj.prototype.updateProgress1 = function (text) {
    $("#" + this.id + "_progress1").attr({"style": "width:" + text + ""});
}
UploadFileObj.prototype.init = function (file, id) {
    this.file = file;
    this.id = id;
    this.sparkMD5 = new SparkMD5.ArrayBuffer();
    this.fileReader = new FileReader();
    this.currentChunk = 0;
    this.totalChunk = Math.ceil(this.file.size / $T.fileConfig.READ_CHUNK_SIZE);
    this.status = $T.fileConfig.STATUS_INIT;
    this.nowFoldId = $T.fileSystemStatus.nowFoldId;
    this.nowFoldName = $T.fileSystemStatus.nowFoldName;
    this.createView("等待中..");
    this.createView1("等待中..");
    EventDispatcher.apply(this);
}
UploadFileObj.prototype.addListener = function () {
    this.onStartClickListener(this, this.onStartClick);
    this.onStopClickListener(this, this.onStopClick);
    this.onCancelClickListener(this, this.onCancelClick);
    this.onRetryClickListener(this, this.onRetryClick);
    this.onView1ClickListener(this, this.onView1Click);
    this.onFoldClickListener(this, this.onFoldClick);
    $("#" + this.id + "_start").hide();
    $("#" + this.id + "_retry").hide();
    this.updateProgress("0%");
    this.updateProgress1("100%");
    this.view1.css({cursor: "pointer"});
}
UploadFileObj.prototype.onView1ClickListener = function (uploadFileObj, call) {
    this.onLoadFunc = function (event) {
        call.call(uploadFileObj, event);
    }
    this.view1.on("click", this.onLoadFunc);
}
UploadFileObj.prototype.onStartClickListener = function (uploadFileObj, call) {
    this.onLoadFunc = function (event) {
        call.call(uploadFileObj, event);
    }
    $("#" + this.id + "_start").on("click", this.onLoadFunc);
}
UploadFileObj.prototype.onStopClickListener = function (uploadFileObj, call) {
    this.onLoadFunc = function (event) {
        call.call(uploadFileObj, event);
    }
    $("#" + this.id + "_stop").on("click", this.onLoadFunc);
}
UploadFileObj.prototype.onCancelClickListener = function (uploadFileObj, call) {
    this.onLoadFunc = function (event) {
        call.call(uploadFileObj, event);
    }
    $("#" + this.id + "_cancel").on("click", this.onLoadFunc);
}
UploadFileObj.prototype.onRetryClickListener = function (uploadFileObj, call) {
    this.onLoadFunc = function (event) {
        call.call(uploadFileObj, event);
    }
    $("#" + this.id + "_retry").on("click", this.onLoadFunc);
}
UploadFileObj.prototype.onFoldClickListener = function (uploadFileObj, call) {
    this.onLoadFunc = function (event) {
        call.call(uploadFileObj, event);
    }
    $("#" + this.id + "_fold").on("click", this.onLoadFunc);
}
UploadFileObj.prototype.onView1Click = function () {
    this.dispatchEventWith($T.uploadEventType.OPEN_UPLOAD_BOX);
}
UploadFileObj.prototype.onStartClick = function () {
    if (this.isStop) {
        this.isStop = false;
        $("#" + this.id + "_start").hide();
        $("#" + this.id + "_stop").show();
        if (this.status == $T.fileConfig.STATUS_INIT) {
            this.dispatchEventWith($T.uploadEventType.ADD_WAIT_MD5_ARRAY);
        } else if (this.status == $T.fileConfig.STATUS_START_MD5_CHECK) {
            this.dispatchEventWith($T.uploadEventType.ADD_MD5_CHECK_ARRAY_AND_LOAD);
        } else if (this.status == $T.fileConfig.STATUS_MD5_SUCCESS) {
            this.dispatchEventWith($T.uploadEventType.ADD_MD5_CHECK_ARRAY);
        } else if (this.status == $T.fileConfig.STATUS_ENTER_MD5CHECK_ARRAY) {
            this.dispatchEventWith($T.uploadEventType.ADD_WAIT_CHECK_ARRAY);
        } else if (this.status == $T.fileConfig.STATUS_MD5_CHECK_SUCCESS) {
            this.dispatchEventWith($T.uploadEventType.ADD_CHECK_ARRAY);
        } else if (this.status == $T.fileConfig.STATUS_ENTER_WAIT_UPLOAD_ARRAY) {
            this.dispatchEventWith($T.uploadEventType.ADD_WAIT_UPLOAD_ARRAY);
        } else if (this.status == $T.fileConfig.STATUS_RESPONSE_UPLOAD_SUCCESS) {
            this.dispatchEventWith($T.uploadEventType.ADD_UPLOAD_ARRAY);
        }

    }
}
UploadFileObj.prototype.onStopClick = function () {
    this.isStop = true;
}
UploadFileObj.prototype.onCancelClick = function () {
    if (this.status == $T.fileConfig.STATUS_REQUEST_UPLOAD || this.status == $T.fileConfig.STATUS_RESPONSE_UPLOAD_SUCCESS) {
        this.dispatchEventWith($T.uploadEventType.OPEN_CANCEL_CHOOSE_BOX, this);
        return;
    }
    this.isCancel = true;
}
UploadFileObj.prototype.onRetryClick = function () {

}
UploadFileObj.prototype.onFoldClick = function () {
    this.dispatchEventWith($T.uploadEventType.CHANGE_USER_FOLD);
}
UploadFileObj.prototype.stop = function () {
    $("#" + this.id + "_start").show();
    $("#" + this.id + "_stop").hide();
    this.updateView("暂停");
    this.updateView1("暂停");
}
UploadFileObj.prototype.clear = function () {
    this.file = null;
    this.id = null;
    this.view = null;
    this.sparkMD5 = null;
    this.fileReader.removeEventListener("load", this.onLoadFunc);
    this.fileReader.removeEventListener("error", this.onErrorFunc);
    this.fileReader = null;
}
UploadFileObj.prototype.startMD5Make = function () {
    this.onLoadListener(this, this.onLoad);
    this.onErrorListener(this, this.onError);
    this.loadNext();
    this.updateView("生成MD5..");
    this.updateView1("生成MD5..");
    this.status = $T.fileConfig.STATUS_START_MD5_CHECK;
}
UploadFileObj.prototype.onLoadListener = function (uploadFileObj, call) {
    this.onLoadFunc = function (event) {
        call.call(uploadFileObj, event);
    }
    this.fileReader.addEventListener("load", this.onLoadFunc);
}
UploadFileObj.prototype.onErrorListener = function (uploadFileObj, call) {
    this.onErrorFunc = function (event) {
        call.call(uploadFileObj, event);
    }
    this.fileReader.addEventListener("error", this.onErrorFunc);
}
UploadFileObj.prototype.loadNext = function () {
    var startPos = this.currentChunk * $T.fileConfig.READ_CHUNK_SIZE;
    var endPos = startPos + $T.fileConfig.READ_CHUNK_SIZE >= this.file.size ? this.file.size : startPos + $T.fileConfig.READ_CHUNK_SIZE;
    this.fileReader.readAsArrayBuffer($T.fileConfig.SLICE.call(this.file, startPos, endPos));
    this.isLoad = true;
}
UploadFileObj.prototype.onLoad = function (event) {
    this.isLoad = false;
    this.sparkMD5.append(this.fileReader.result);
    this.currentChunk++;
    if (this.currentChunk < this.totalChunk) {
        if (this.isStop || this.isCancel) {
            return;
        }
        this.loadNext();
        this.updateView("MD5：" + parseInt(this.currentChunk / this.totalChunk * 100) + "%");
        this.updateView1("MD5：" + parseInt(this.currentChunk / this.totalChunk * 100) + "%");
    } else {
        this.md5 = this.sparkMD5.end();
        this.updateView("MD5完成");
        this.updateView1("MD5完成");
        this.status = $T.fileConfig.STATUS_MD5_SUCCESS;
    }
}
UploadFileObj.prototype.onError = function (event) {
    this.isLoad = false;
    this.updateView("生成md5失败，读取文件异常");
    this.updateView1("生成md5失败，读取文件异常");
    this.view1.remove();
    this.dispatchEventWith($T.uploadEventType.REMOVE_VIEW1);
    this.status = $T.fileConfig.STATUS_READ_FILE_FAIL;
    $("#" + this.id + "_start").hide();
    $("#" + this.id + "_stop").hide();
}
UploadFileObj.prototype.enterMD5CheckArray = function () {
    this.status = $T.fileConfig.STATUS_ENTER_MD5CHECK_ARRAY;
    this.updateView("等待校验..");
    this.updateView1("等待校验..");
}
UploadFileObj.prototype.startMD5Check = function () {
    this.updateView("开始校验..");
    this.updateView1("开始校验..");
    this.isLoad = true;
    this.status = $T.fileConfig.STATUS_START_MD5CHECK;
    $T.uploadFileProxy.checkMD5(this.id, this.md5, this.file.name, this.nowFoldId, this.file.size, this.userFileId);

}
UploadFileObj.prototype.checkMD5Success = function (result) {
    this.isLoad = false;
    if (result.result == 1) {
        // 秒传
        this.status = $T.fileConfig.STATUS_MD5_MOMENT_UPLOAD;
        this.updateView("急速上传!");
        this.updateView1("急速上传!");
        $("#" + this.id + "_start").hide();
        $("#" + this.id + "_stop").hide();
        this.updateProgress("100%");
        this.updateProgress1("0%");
        this.view1.remove();
        this.dispatchEventWith($T.uploadEventType.REMOVE_VIEW1);
        this.dispatchEventWith($T.uploadEventType.UPLOAD_COMPLETE);
    } else {
        // 可以上传
        this.status = $T.fileConfig.STATUS_MD5_CHECK_SUCCESS;
        this.resultData = result;
        this.userFileId = result.userFileId;
        this.updateView("校验完成");
        this.updateView1("校验完成");
    }

}
UploadFileObj.prototype.checkMD5Fail = function (result) {
    this.isLoad = false;
    this.status = $T.fileConfig.STATUS_MD5_CHECK_FAIL;
    this.updateView("md5校验失败");
    this.updateView1("md5校验失败");
    this.view1.remove();
    this.dispatchEventWith($T.uploadEventType.REMOVE_VIEW1);
    $("#" + this.id + "_start").hide();
    $("#" + this.id + "_stop").hide();
}
UploadFileObj.prototype.enterWaitUploadArray = function () {
    this.status = $T.fileConfig.STATUS_ENTER_WAIT_UPLOAD_ARRAY;
    this.updateView("等待中..");
    this.updateView1("等待中..");
}
UploadFileObj.prototype.startUploadFile = function () {
    this.updateView("开始上传");
    this.updateView1("开始上传");
    this.lastTime = new Date().getTime();
    this.uploadFile(true);

}
UploadFileObj.prototype.uploadFile = function (isStart) {
    if (!isStart) {
        var nowTime = new Date().getTime();
        if ((nowTime - this.lastTime) < this.resultData.waitTime) {
            return;
        }
    }
    if (this.resultData.fileBasePos == this.file.size) {
        // 上传已经完成了，服务器出问题了
        this.status = $T.fileConfig.STATUS_UPLOAD_SUCCESS;
        this.updateView("上传完成");
        this.updateView1("上传完成");
        $("#" + this.id + "_start").hide();
        $("#" + this.id + "_stop").hide();
        this.updateProgress("100%");
        this.updateProgress1("0%");
        this.view1.remove();
        this.dispatchEventWith($T.uploadEventType.REMOVE_VIEW1);
        this.dispatchEventWith($T.uploadEventType.UPLOAD_COMPLETE);
        return;
    }
    var endPos = this.resultData.fileBasePos + this.resultData.uploadMaxLength >= this.file.size ? this.file.size : this.resultData.fileBasePos + this.resultData.uploadMaxLength;
    var filePart = $T.fileConfig.SLICE.call(this.file, this.resultData.fileBasePos, endPos);
    this.status = $T.fileConfig.STATUS_REQUEST_UPLOAD;
    this.isLoad = true;
    $T.uploadFileProxy.uploadFile(this.id, this.userFileId, this.resultData.fileBasePos, (endPos - this.resultData.fileBasePos), [filePart]);

}
UploadFileObj.prototype.uploadFileSuccess = function (result) {
    this.isLoad = false;
    if (result.result == 1) {
        // 秒传
        this.status = $T.fileConfig.STATUS_MD5_MOMENT_UPLOAD;
        this.updateView("极速上传!");
        this.updateView1("极速上传!");
        $("#" + this.id + "_start").hide();
        $("#" + this.id + "_stop").hide();
        this.updateProgress("100%");
        this.updateProgress1("0%");
        this.view1.remove();
        this.dispatchEventWith($T.uploadEventType.REMOVE_VIEW1);
        this.dispatchEventWith($T.uploadEventType.UPLOAD_COMPLETE);
    } else if (result.result == 2) {
        var endPos = this.resultData.fileBasePos + this.resultData.uploadMaxLength >= this.file.size ? this.file.size : this.resultData.fileBasePos + this.resultData.uploadMaxLength;
        // 可以上传
        this.status = $T.fileConfig.STATUS_RESPONSE_UPLOAD_SUCCESS;
        var nowTime = new Date().getTime();
        var passedTime = nowTime - this.lastTime;
        this.lastTime = nowTime;
        this.updateView($T.byteUtil.getSpeed(passedTime, (endPos - this.resultData.fileBasePos)));
        this.updateView1($T.byteUtil.getSpeed(passedTime, (endPos - this.resultData.fileBasePos)));
        this.resultData = result;
        this.updateProgress((this.resultData.fileBasePos / this.file.size) * 100 + "%");
        this.updateProgress1((100 - ((this.resultData.fileBasePos / this.file.size) * 100)) + "%");
    } else {
        // 秒传
        this.status = $T.fileConfig.STATUS_UPLOAD_SUCCESS;
        this.updateView("上传完成");
        this.updateView1("上传完成");
        $("#" + this.id + "_start").hide();
        $("#" + this.id + "_stop").hide();
        this.updateProgress("100%");
        this.updateProgress1("0%");
        this.view1.remove();
        this.dispatchEventWith($T.uploadEventType.REMOVE_VIEW1);
        this.dispatchEventWith($T.uploadEventType.UPLOAD_COMPLETE);
    }
}
UploadFileObj.prototype.uploadFileFail = function (result) {
    this.isLoad = false;
    this.status = $T.fileConfig.STATUS_RESPONSE_UPLOAD_FAIL;
    this.updateView("md5校验失败");
    this.updateView1("md5校验失败");
    this.view1.remove();
    this.dispatchEventWith($T.uploadEventType.REMOVE_VIEW1);
    $("#" + this.id + "_start").hide();
    $("#" + this.id + "_stop").hide();
}