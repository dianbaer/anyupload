(function (window) {
    if (!window.anyupload) window.anyupload = {};
    var ByteUtil = function () {
        this.B_SIZE = 1024;
        this.KB_SIZE = 1048576;
        this.MB_SIZE = 1073741824;
        /**
         * 获取速度
         * @param passedTime 经过时间
         * @param bit 大小
         * @returns {string}
         */
        this.getSpeed = function (passedTime, bit) {
            var speed = bit / (passedTime * 0.001);
            if (speed < this.B_SIZE) {
                return speed.toFixed(2) + "B/S";
            } else if (speed < this.KB_SIZE) {
                return (speed / this.B_SIZE).toFixed(2) + "KB/S";
            } else {
                return (speed / this.KB_SIZE).toFixed(2) + "MB/S";
            }
        };
        /**
         * 格式化bit
         * @param bit
         * @param fixSizeKB 如果是KB的小数点后几位
         * @param fixSizeMB 如果是MB的小数点后几位
         * @param fixSizeGM 如果是GB的小数点后几位
         * @returns {string}
         */
        this.getByte = function (bit, fixSizeKB, fixSizeMB, fixSizeGM) {
            if (bit < this.B_SIZE) {
                return bit + "B";
            } else if (bit < this.KB_SIZE) {
                if (fixSizeKB !== null) {
                    return (bit / this.B_SIZE).toFixed(fixSizeKB) + "KB";
                } else {
                    return (bit / this.B_SIZE).toFixed(2) + "KB";
                }
            } else if (bit < this.MB_SIZE) {
                if (fixSizeMB !== null) {
                    return (bit / this.KB_SIZE).toFixed(fixSizeMB) + "MB";
                } else {
                    return (bit / this.KB_SIZE).toFixed(2) + "MB";
                }
            } else {
                if (fixSizeGM !== null) {
                    return (bit / this.MB_SIZE).toFixed(fixSizeGM) + "GB";
                } else {
                    return (bit / this.MB_SIZE).toFixed(2) + "GB";
                }
            }
        }
    };
    window.anyupload.byteUtil = new ByteUtil();
})(window);
(function (window) {
    if (!window.anyupload) window.anyupload = {};
    var FileConfig = function () {
        this.SLICE = File.prototype.slice || File.prototype.mozSlice || File.prototype.webkitSlice;
        this.INCREMENT_ID = 1;
        // 最大md5校验文件数量
        this.MAX_MD5_MAKE_FILE_NUM = 5;
        // 最大md5校验文件数量
        this.MAX_MD5_CHECK_FILE_NUM = 5;
        // 最大上传文件数量
        this.MAX_UPLOAD_FILE_NUM = 5;
        // 每次读取的块大小1M
        this.READ_CHUNK_SIZE = 1048576;
        // 初始化
        this.STATUS_INIT = 1;
        this.STATUS_START_MD5_CHECK = 2;
        // 读取文件失败
        this.STATUS_READ_FILE_FAIL = 3;
        // md5生成完成
        this.STATUS_MD5_SUCCESS = 4;
        this.STATUS_ENTER_MD5CHECK_ARRAY = 5;
        this.STATUS_START_MD5CHECK = 6;
        // md5校验成功
        this.STATUS_MD5_CHECK_SUCCESS = 7;
        // md5校验失败
        this.STATUS_MD5_CHECK_FAIL = 8;
        // 秒传
        this.STATUS_MD5_MOMENT_UPLOAD = 9;
        this.STATUS_ENTER_WAIT_UPLOAD_ARRAY = 10;
        // 请求上传中
        this.STATUS_REQUEST_UPLOAD = 11;
        // 请求上传成功返回
        this.STATUS_RESPONSE_UPLOAD_SUCCESS = 12;
        // 请求上传失败返回
        this.STATUS_RESPONSE_UPLOAD_FAIL = 13;
        // 上传成功
        this.STATUS_UPLOAD_SUCCESS = 14;
        this.getIncrementId = function () {
            return "uploadFile_" + this.INCREMENT_ID++;
        }
    };
    window.anyupload.fileConfig = new FileConfig();
})(window);
(function (window) {
    if (!window.anyupload) window.anyupload = {};
    var NotificationExt = function () {
        this.MD5_CHECK_SUCCESS = "md5CheckSuccess";
        this.MD5_CHECK_FAIL = "md5CheckFail";
        this.UPLOAD_FILE_SUCCESS = "uploadFileSuccess";
        this.UPLOAD_FILE_FAIL = "uploadFileFail";
    };
    window.anyupload.notificationExt = new NotificationExt();
})(window);
(function (window) {
    if (!window.anyupload) window.anyupload = {};
    var PostfixUtil = function () {
        this.postfixToClass = [];
        this.postfixToClass["ai"] = "fileicon_ai";
        this.postfixToClass["doc"] = "fileicon_doc";
        this.postfixToClass["docx"] = "fileicon_doc";
        this.postfixToClass["jpg"] = "fileicon_jpg";
        this.postfixToClass["jpeg"] = "fileicon_jpg";
        this.postfixToClass["pdf"] = "fileicon_pdf";
        this.postfixToClass["png"] = "fileicon_png";
        this.postfixToClass["ppt"] = "fileicon_ppt";
        this.postfixToClass["pptx"] = "fileicon_ppt";
        this.postfixToClass["psd"] = "fileicon_psd";
        this.postfixToClass["xls"] = "fileicon_xls";
        this.postfixToClass["txt"] = "fileicon_txt";
        this.getClassByFileName = function (userFileName) {
            var nameArray = userFileName.toLowerCase().split(".");
            if (nameArray.length === 1) {
                return "fileicon_qitageshi";
            } else {
                if (this.postfixToClass[nameArray[nameArray.length - 1]] === null || this.postfixToClass[nameArray[nameArray.length - 1]] === undefined) {
                    return "fileicon_qitageshi";
                } else {
                    return this.postfixToClass[nameArray[nameArray.length - 1]];
                }
            }
        }
    };
    window.anyupload.postfixUtil = new PostfixUtil();
})(window);

(function (window) {
    if (!window.anyupload) window.anyupload = {};
    var UploadEventType = function () {
        /** 加入等待md5队列 */
        this.ADD_WAIT_MD5_ARRAY = "addWaitMd5Array";
        this.ADD_MD5_CHECK_ARRAY_AND_LOAD = "addMd5CheckArrayAndLoad";
        this.ADD_MD5_CHECK_ARRAY = "addMd5CheckArray";
        this.ADD_WAIT_CHECK_ARRAY = "addWaitCheckArray";
        this.ADD_CHECK_ARRAY = "addCheckArray";
        this.ADD_WAIT_UPLOAD_ARRAY = "addWaitUploadArray";
        this.ADD_UPLOAD_ARRAY = "addUploadArray";
        this.UPLOAD_COMPLETE = "uploadComplete";
        this.CHANGE_USER_FOLD = "changeUserFold";
        this.OPEN_CANCEL_CHOOSE_BOX = "openCancelChooseBox";
    };
    window.anyupload.uploadEventType = new UploadEventType();
})(window);
(function (window) {
    if (!window.anyupload) window.anyupload = {};
    var FileSystemStatus = function () {
        this.nowFoldId = "rootId";
        this.nowFoldName = "root";
    };
    window.anyupload.fileSystemStatus = new FileSystemStatus();
})(window);
(function (window) {
    if (!window.anyupload) window.anyupload = {};
    var notificationExt = window.anyupload.notificationExt;
    var UploadFileProxy = function () {
        juggle.Proxy.apply(this);
        this.url = null;
        /**
         * 校验md5
         * @param uploadFileId 界面上的显示对象id
         * @param fileBaseMd5 md5
         * @param userFileName 文件名
         * @param userFoldParentId 父类id（没用）
         * @param fileBaseTotalSize 文件大小
         * @param userFileId 文件id（没用）
         */
        this.checkMD5 = function (uploadFileId, fileBaseMd5, userFileName, userFoldParentId, fileBaseTotalSize, userFileId) {
            var data = {
                "hOpCode": "50000",
                "fileBaseMd5": fileBaseMd5,
                "userFileName": userFileName,
                "userFoldParentId": userFoldParentId,
                "fileBaseTotalSize": fileBaseTotalSize,
                "userFileId": userFileId
            };
            // 用于确认回调到底是哪个文件的消息
            var sendParam = {
                "data": data,
                "uploadFileId": uploadFileId
            };
            var httpClient = new juggle.HttpClient();
            httpClient.sendParam = sendParam;
            httpClient.send(data, this.url, null);
            httpClient.addEventListener(juggle.httpEventType.SUCCESS, this.checkMD5Success, this);
            httpClient.addEventListener(juggle.httpEventType.ERROR, this.checkMD5Fail, this);
        };
        this.checkMD5Success = function (event) {
            var result = JSON.parse(event.mData);
            var sendParam = event.mTarget.sendParam;
            //返回错误
            if (result.hOpCode === "49999") {
                this.notifyObservers(this.getNotification(notificationExt.MD5_CHECK_FAIL, {
                    "result": result,
                    "sendParam": sendParam
                }));
                return;
            }
            //protobuf传0则是null，纠正过来
            if (result.fileBasePos === null || result.fileBasePos === undefined) {
                result.fileBasePos = 0;
            }
            this.notifyObservers(this.getNotification(notificationExt.MD5_CHECK_SUCCESS, {
                "result": result,
                "sendParam": sendParam
            }));
        };
        this.checkMD5Fail = function (event) {
            var sendParam = event.mTarget.sendParam;
            this.notifyObservers(this.getNotification(notificationExt.MD5_CHECK_FAIL, {
                "result": null,
                "sendParam": sendParam
            }));
        };
        /**
         * 上传文件
         * @param uploadFileId 显示对象id
         * @param userFileId 文件id
         * @param fileBasePos 位置
         * @param uploadLength 长度
         * @param fileArray 文件块
         */
        this.uploadFile = function (uploadFileId, userFileId, fileBasePos, uploadLength, fileArray) {
            var data = {
                "hOpCode": "50001",
                "userFileId": userFileId,
                "fileBasePos": fileBasePos,
                "uploadLength": uploadLength
            };
            // 用于确认回调到底是哪个文件的消息
            var sendParam = {
                "data": data,
                "uploadFileId": uploadFileId
            };

            var httpClient = new juggle.HttpClient();
            httpClient.sendParam = sendParam;
            httpClient.sendFile(fileArray, data, this.url, null);
            httpClient.addEventListener(juggle.httpEventType.SUCCESS, this.uploadFileSuccess, this);
            httpClient.addEventListener(juggle.httpEventType.ERROR, this.uploadFileFail, this);
        };
        this.uploadFileSuccess = function (event) {
            var result = JSON.parse(event.mData);
            var sendParam = event.mTarget.sendParam;
            //错误的返回
            if (result.hOpCode === "49999") {
                this.notifyObservers(this.getNotification(notificationExt.UPLOAD_FILE_FAIL, {
                    "result": result,
                    "sendParam": sendParam
                }));
                return;
            }
            //protobuf传0则是null，纠正过来
            if (result.fileBasePos === null || result.fileBasePos === undefined) {
                result.fileBasePos = 0;
            }
            this.notifyObservers(this.getNotification(notificationExt.UPLOAD_FILE_SUCCESS, {
                "result": result,
                "sendParam": sendParam
            }));
        };
        this.uploadFileFail = function (event) {
            var sendParam = event.mTarget.sendParam;
            this.notifyObservers(this.getNotification(notificationExt.UPLOAD_FILE_FAIL, {
                "result": null,
                "sendParam": sendParam
            }));
        }
    };
    window.anyupload.uploadFileProxy = new UploadFileProxy();
})(window);
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
(function (window) {
    if (!window.anyupload) window.anyupload = {};
    var fileConfig = window.anyupload.fileConfig;
    var uploadEventType = window.anyupload.uploadEventType;
    var notificationExt = window.anyupload.notificationExt;
    var UploadFileObj = window.anyupload.UploadFileObj;
    var FileMediator = function () {
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
        this.allNum = 0;
        this.nowCompleteNum = 0;
        this.ulContainer = null;
        this.uploadNumText = null;
        this.initView = function (container) {
            this.createView(container);
            juggle.jugglerManager.juggler.add(this);
        };
        this.createView = function (container) {
            var view = document.createElement("div");
            var body =
                '<div class="uploadBoxT clearfix">' +
                '<p class="fl" id="anyupload_num">正在上传（' + this.nowCompleteNum + '/' + this.allNum + '）</p>' +
                '<div class="fr">' +
                '<i class="minimize"></i>' +
                '<i class="all_cancel"></i>' +
                '</div>' +
                '</div>' +
                '<div class="uploader_list_header">' +
                '<div class="file_name">文件名</div>' +
                '<div class="file_size">大小</div>' +
                '<div class="file_path">上传目录</div>' +
                '<div class="file_status">状态</div>' +
                '<div class="file_operate">操作</div>' +
                '<div class="clear"></div>' +
                '</div>' +
                '<div class="uploadBoxB">' +
                '<ul id="anyupload_ul">' +
                '</ul>' +
                '</div>';
            view.innerHTML = body;
            container.append($(view));
            this.ulContainer = $("#anyupload_ul");
            this.uploadNumText = $("#anyupload_num");
        };
        // 关心消息数组
        this.listNotificationInterests = [notificationExt.MD5_CHECK_SUCCESS, notificationExt.MD5_CHECK_FAIL, notificationExt.UPLOAD_FILE_SUCCESS, notificationExt.UPLOAD_FILE_FAIL];
        // 关心的消息处理
        this.handleNotification = function (data) {
            var result, sendParam;
            switch (data.name) {
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
            }
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
                this.ulContainer.append(uploadFileObj.view);
                uploadFileObj.addListener();
                uploadFileObj.addEventListener(uploadEventType.ADD_WAIT_MD5_ARRAY, this.addWaitMd5Array, this);
                uploadFileObj.addEventListener(uploadEventType.ADD_MD5_CHECK_ARRAY_AND_LOAD, this.addMd5CheckArrayAndLoad, this);
                uploadFileObj.addEventListener(uploadEventType.ADD_MD5_CHECK_ARRAY, this.addMd5CheckArray, this);
                uploadFileObj.addEventListener(uploadEventType.ADD_WAIT_CHECK_ARRAY, this.addWaitCheckArray, this);
                uploadFileObj.addEventListener(uploadEventType.ADD_CHECK_ARRAY, this.addCheckArray, this);
                uploadFileObj.addEventListener(uploadEventType.ADD_WAIT_UPLOAD_ARRAY, this.addWaitUploadArray, this);
                uploadFileObj.addEventListener(uploadEventType.ADD_UPLOAD_ARRAY, this.addUploadArray, this);
                uploadFileObj.addEventListener(uploadEventType.UPLOAD_COMPLETE, this.onUploadComplete, this);
                uploadFileObj.addEventListener(uploadEventType.OPEN_CANCEL_CHOOSE_BOX, this.onOpenCancelChooseBox, this);
                uploadFileObj.addEventListener(uploadEventType.CHANGE_USER_FOLD, this.onChangeUserFold, this);
                this.waitMD5Array.push(uploadFileObj);
                this.uploadFileMap[uploadFileObj.id] = uploadFileObj;
                this.allNum++;
            }
            this.uploadNumText.text("正在上传（" + this.nowCompleteNum + "/" + this.allNum + "）");
        };
        this.removeUploadFile = function (uploadFileObj) {
            uploadFileObj.view.remove();
            this.allNum--;
            if (uploadFileObj.status === fileConfig.STATUS_MD5_MOMENT_UPLOAD || uploadFileObj.status === fileConfig.STATUS_UPLOAD_SUCCESS) {
                this.nowCompleteNum--;
            }
            this.uploadNumText.text("正在上传（" + this.nowCompleteNum + "/" + this.allNum + "）");
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
            this.nowCompleteNum++;
            this.uploadNumText.text("正在上传（" + this.nowCompleteNum + "/" + this.allNum + "）");
        };
        this.onOpenCancelChooseBox = function (event) {
            var uploadFileObj = event.mTarget;
            uploadFileObj.isCancel = true;
        };
        this.onChangeUserFold = function (event) {
            var uploadFileObj = event.mTarget;
            //更换文件夹
            //uploadFileObj.nowFoldId
        };
        juggle.Mediator.apply(this);
    };
    window.anyupload.FileMediator = FileMediator;
})(window);