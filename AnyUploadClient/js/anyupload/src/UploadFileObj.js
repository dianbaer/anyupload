(function (window) {
    if (!window.anyupload) window.anyupload = {};
    var byteUtil = window.anyupload.byteUtil;
    var fileConfig = window.anyupload.fileConfig;
    var fileSystemStatus = window.anyupload.fileSystemStatus;
    var postfixUtil = window.anyupload.postfixUtil;
    var uploadEventType = window.anyupload.uploadEventType;
    var uploadFileProxy = window.anyupload.uploadFileProxy;
    var UploadFileObj = function () {
        this.file = null;// 文件
        this.id = null;// 唯一id
        this.view = null;// 视图
        this.sparkMD5 = null;// md5工具
        this.fileReader = null;// 读取文件工具
        this.currentChunk = null;// 当前块
        this.totalChunk = null;// 总块数
        this.md5 = null;// md5值说明完成
        this.onLoadFunc = null;// 加载完成函数
        this.onErrorFunc = null;// 报错函数
        this.status = null;// 状态 1：开始,2:读取文件失败，3读取文件成功
        this.userFileId = null;// 当前上传得文件id
        this.resultData = null;// 返回数据（fileBasePos、uploadMaxLength）
        this.lastTime = null;// 上一次时间
        this.nowFoldId = null;
        this.nowFoldName = null;
        this.isStop = false;// 是否暂停
        this.isCancel = false;// 是否关闭
        this.isLoad = false;// 是否正在异步
        this.createView = function (text) {
            var view = document.createElement("li");
            var body =
                '<div class="info">' +
                '<div class="file_name clearfix">' +
                '<span class="file_icon ' + postfixUtil.getClassByFileName(this.file.name) + '"></span>' +
                '<p title="' + this.file.name + '">' +
                this.file.name +
                '</p>' +
                '</div>' +
                '<div class="file_size" title="' + byteUtil.getByte(this.file.size) + '">' +
                byteUtil.getByte(this.file.size) +
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
        };
        this.updateView = function (text) {
            $("#" + this.id + "_text").text(text);
        };
        this.updateProgress = function (text) {
            $("#" + this.id + "_progress").attr({"style": "width:" + text + ""});
        };
        this.init = function (file, id) {
            this.file = file;
            this.id = id;
            this.sparkMD5 = new SparkMD5.ArrayBuffer();
            this.fileReader = new FileReader();
            this.currentChunk = 0;
            this.totalChunk = Math.ceil(this.file.size / fileConfig.READ_CHUNK_SIZE);
            this.status = fileConfig.STATUS_INIT;
            this.nowFoldId = fileSystemStatus.nowFoldId;
            this.nowFoldName = fileSystemStatus.nowFoldName;
            this.createView("等待中..");
            juggle.EventDispatcher.apply(this);
        };
        this.addListener = function () {
            this.onStartClickListener(this, this.onStartClick);
            this.onStopClickListener(this, this.onStopClick);
            this.onCancelClickListener(this, this.onCancelClick);
            this.onRetryClickListener(this, this.onRetryClick);
            this.onFoldClickListener(this, this.onFoldClick);
            $("#" + this.id + "_start").hide();
            $("#" + this.id + "_retry").hide();
            this.updateProgress("0%");
        };
        this.onStartClickListener = function (uploadFileObj, call) {
            var onLoadFunc = function (event) {
                call.call(uploadFileObj, event);
            };
            $("#" + this.id + "_start").on("click", onLoadFunc);
        };
        this.onStopClickListener = function (uploadFileObj, call) {
            var onLoadFunc = function (event) {
                call.call(uploadFileObj, event);
            };
            $("#" + this.id + "_stop").on("click", onLoadFunc);
        };
        this.onCancelClickListener = function (uploadFileObj, call) {
            var onLoadFunc = function (event) {
                call.call(uploadFileObj, event);
            };
            $("#" + this.id + "_cancel").on("click", onLoadFunc);
        };
        this.onRetryClickListener = function (uploadFileObj, call) {
            var onLoadFunc = function (event) {
                call.call(uploadFileObj, event);
            };
            $("#" + this.id + "_retry").on("click", onLoadFunc);
        };
        this.onFoldClickListener = function (uploadFileObj, call) {
            var onLoadFunc = function (event) {
                call.call(uploadFileObj, event);
            };
            $("#" + this.id + "_fold").on("click", onLoadFunc);
        };
        this.onStartClick = function () {
            if (this.isStop) {
                this.isStop = false;
                $("#" + this.id + "_start").hide();
                $("#" + this.id + "_stop").show();
                if (this.status === fileConfig.STATUS_INIT) {
                    this.dispatchEventWith(uploadEventType.ADD_WAIT_MD5_ARRAY);
                } else if (this.status === fileConfig.STATUS_START_MD5_CHECK) {
                    this.dispatchEventWith(uploadEventType.ADD_MD5_CHECK_ARRAY_AND_LOAD);
                } else if (this.status === fileConfig.STATUS_MD5_SUCCESS) {
                    this.dispatchEventWith(uploadEventType.ADD_MD5_CHECK_ARRAY);
                } else if (this.status === fileConfig.STATUS_ENTER_MD5CHECK_ARRAY) {
                    this.dispatchEventWith(uploadEventType.ADD_WAIT_CHECK_ARRAY);
                } else if (this.status === fileConfig.STATUS_MD5_CHECK_SUCCESS) {
                    this.dispatchEventWith(uploadEventType.ADD_CHECK_ARRAY);
                } else if (this.status === fileConfig.STATUS_ENTER_WAIT_UPLOAD_ARRAY) {
                    this.dispatchEventWith(uploadEventType.ADD_WAIT_UPLOAD_ARRAY);
                } else if (this.status === fileConfig.STATUS_RESPONSE_UPLOAD_SUCCESS) {
                    this.dispatchEventWith(uploadEventType.ADD_UPLOAD_ARRAY);
                }

            }
        };
        this.onStopClick = function () {
            this.isStop = true;
        };
        this.onCancelClick = function () {
            if (this.status === fileConfig.STATUS_REQUEST_UPLOAD || this.status === fileConfig.STATUS_RESPONSE_UPLOAD_SUCCESS) {
                this.dispatchEventWith(uploadEventType.OPEN_CANCEL_CHOOSE_BOX, this);
                return;
            }
            this.isCancel = true;
        };
        this.onRetryClick = function () {

        };
        this.onFoldClick = function () {
            this.dispatchEventWith(uploadEventType.CHANGE_USER_FOLD);
        };
        this.stop = function () {
            $("#" + this.id + "_start").show();
            $("#" + this.id + "_stop").hide();
            this.updateView("暂停");
        };
        this.clear = function () {
            this.file = null;
            this.id = null;
            this.view = null;
            this.sparkMD5 = null;
            this.fileReader.removeEventListener("load", this.onLoadFunc);
            this.fileReader.removeEventListener("error", this.onErrorFunc);
            this.fileReader = null;
        };
        this.startMD5Make = function () {
            this.onLoadListener(this, this.onLoad);
            this.onErrorListener(this, this.onError);
            this.loadNext();
            this.updateView("生成MD5..");
            this.status = fileConfig.STATUS_START_MD5_CHECK;
        };
        this.onLoadListener = function (uploadFileObj, call) {
            this.onLoadFunc = function (event) {
                call.call(uploadFileObj, event);
            };
            this.fileReader.addEventListener("load", this.onLoadFunc);
        };
        this.onErrorListener = function (uploadFileObj, call) {
            this.onErrorFunc = function (event) {
                call.call(uploadFileObj, event);
            };
            this.fileReader.addEventListener("error", this.onErrorFunc);
        };
        this.loadNext = function () {
            var startPos = this.currentChunk * fileConfig.READ_CHUNK_SIZE;
            var endPos = startPos + fileConfig.READ_CHUNK_SIZE >= this.file.size ? this.file.size : startPos + fileConfig.READ_CHUNK_SIZE;
            this.fileReader.readAsArrayBuffer(fileConfig.SLICE.call(this.file, startPos, endPos));
            this.isLoad = true;
        };
        this.onLoad = function (event) {
            this.isLoad = false;
            this.sparkMD5.append(this.fileReader.result);
            this.currentChunk++;
            if (this.currentChunk < this.totalChunk) {
                if (this.isStop || this.isCancel) {
                    return;
                }
                this.loadNext();
                this.updateView("MD5：" + parseInt(this.currentChunk / this.totalChunk * 100) + "%");
            } else {
                this.md5 = this.sparkMD5.end();
                this.updateView("MD5完成");
                this.status = fileConfig.STATUS_MD5_SUCCESS;
            }
        };
        this.onError = function (event) {
            this.isLoad = false;
            this.updateView("生成md5失败，读取文件异常");
            this.status = fileConfig.STATUS_READ_FILE_FAIL;
            $("#" + this.id + "_start").hide();
            $("#" + this.id + "_stop").hide();
        };
        this.enterMD5CheckArray = function () {
            this.status = fileConfig.STATUS_ENTER_MD5CHECK_ARRAY;
            this.updateView("等待校验..");
        };
        this.startMD5Check = function () {
            this.updateView("开始校验..");
            this.isLoad = true;
            this.status = fileConfig.STATUS_START_MD5CHECK;
            uploadFileProxy.checkMD5(this.id, this.md5, this.file.name, this.nowFoldId, this.file.size, this.userFileId);

        };
        this.checkMD5Success = function (result) {
            this.isLoad = false;
            if (result.result === 1) {
                // 秒传
                this.status = fileConfig.STATUS_MD5_MOMENT_UPLOAD;
                this.updateView("急速上传!");
                $("#" + this.id + "_start").hide();
                $("#" + this.id + "_stop").hide();
                this.updateProgress("100%");
                this.dispatchEventWith(uploadEventType.UPLOAD_COMPLETE);
            } else {
                // 可以上传
                this.status = fileConfig.STATUS_MD5_CHECK_SUCCESS;
                this.resultData = result;
                this.userFileId = result.userFileId;
                this.updateView("校验完成");
            }

        };
        this.checkMD5Fail = function (result) {
            this.isLoad = false;
            this.status = fileConfig.STATUS_MD5_CHECK_FAIL;
            this.updateView("md5校验失败");
            $("#" + this.id + "_start").hide();
            $("#" + this.id + "_stop").hide();
        };
        this.enterWaitUploadArray = function () {
            this.status = fileConfig.STATUS_ENTER_WAIT_UPLOAD_ARRAY;
            this.updateView("等待中..");
        };
        this.startUploadFile = function () {
            this.updateView("开始上传");
            this.lastTime = new Date().getTime();
            this.uploadFile(true);

        };
        this.uploadFile = function (isStart) {
            if (!isStart) {
                var nowTime = new Date().getTime();
                if ((nowTime - this.lastTime) < this.resultData.waitTime) {
                    return;
                }
            }
            if (this.resultData.fileBasePos === this.file.size) {
                // 上传已经完成了，服务器出问题了
                this.status = fileConfig.STATUS_UPLOAD_SUCCESS;
                this.updateView("上传完成");
                $("#" + this.id + "_start").hide();
                $("#" + this.id + "_stop").hide();
                this.updateProgress("100%");
                this.dispatchEventWith(uploadEventType.UPLOAD_COMPLETE);
                return;
            }
            var endPos = this.resultData.fileBasePos + this.resultData.uploadMaxLength >= this.file.size ? this.file.size : this.resultData.fileBasePos + this.resultData.uploadMaxLength;
            var filePart = fileConfig.SLICE.call(this.file, this.resultData.fileBasePos, endPos);
            this.status = fileConfig.STATUS_REQUEST_UPLOAD;
            this.isLoad = true;
            uploadFileProxy.uploadFile(this.id, this.userFileId, this.resultData.fileBasePos, (endPos - this.resultData.fileBasePos), [filePart]);

        };
        this.uploadFileSuccess = function (result) {
            this.isLoad = false;
            if (result.result === 1) {
                // 秒传
                this.status = fileConfig.STATUS_MD5_MOMENT_UPLOAD;
                this.updateView("极速上传!");
                $("#" + this.id + "_start").hide();
                $("#" + this.id + "_stop").hide();
                this.updateProgress("100%");
                this.dispatchEventWith(uploadEventType.UPLOAD_COMPLETE);
            } else if (result.result === 2) {
                var endPos = this.resultData.fileBasePos + this.resultData.uploadMaxLength >= this.file.size ? this.file.size : this.resultData.fileBasePos + this.resultData.uploadMaxLength;
                // 可以上传
                this.status = fileConfig.STATUS_RESPONSE_UPLOAD_SUCCESS;
                var nowTime = new Date().getTime();
                var passedTime = nowTime - this.lastTime;
                this.lastTime = nowTime;
                this.updateView(byteUtil.getSpeed(passedTime, (endPos - this.resultData.fileBasePos)));
                this.resultData = result;
                this.updateProgress((this.resultData.fileBasePos / this.file.size) * 100 + "%");
            } else {
                // 秒传
                this.status = fileConfig.STATUS_UPLOAD_SUCCESS;
                this.updateView("上传完成");
                $("#" + this.id + "_start").hide();
                $("#" + this.id + "_stop").hide();
                this.updateProgress("100%");
                this.dispatchEventWith(uploadEventType.UPLOAD_COMPLETE);
            }
        };
        this.uploadFileFail = function (result) {
            this.isLoad = false;
            this.status = fileConfig.STATUS_RESPONSE_UPLOAD_FAIL;
            this.updateView("md5校验失败");
            $("#" + this.id + "_start").hide();
            $("#" + this.id + "_stop").hide();
        };

    };
    window.anyupload.UploadFileObj = UploadFileObj;
})(window);