function FileConfig() {
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
}
fileConfig = new FileConfig();