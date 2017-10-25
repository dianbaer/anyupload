function BoxErrorMsg() {
    this.errorMap = [];
    this.errorMap["ERROR_CODE_0"] = "未知错误";
    this.errorMap["ERROR_CODE_1"] = "不存在这个用户";
    this.errorMap["ERROR_CODE_2"] = "创建用户顶级文件夹失败";
    this.errorMap["ERROR_CODE_3"] = "md5校验失败";
    this.errorMap["ERROR_CODE_4"] = "上传失败，不存在这个文件";
    this.errorMap["ERROR_CODE_5"] = "上传失败，上传位置不对";
    this.errorMap["ERROR_CODE_6"] = "上传失败，长度不对";
    this.errorMap["ERROR_CODE_7"] = "上传失败，没发送文件";
    this.errorMap["ERROR_CODE_8"] = "上传失败，不存在实体文件";
    this.errorMap["ERROR_CODE_9"] = "上传失败，时间超前";
    this.errorMap["ERROR_CODE_10"] = "上传失败，更换基础文件失败";
    this.errorMap["ERROR_CODE_11"] = "上传失败，写入文件失败";
    this.errorMap["ERROR_CODE_12"] = "上传失败，更新数据失败";

}
boxErrorMsg = new BoxErrorMsg();
