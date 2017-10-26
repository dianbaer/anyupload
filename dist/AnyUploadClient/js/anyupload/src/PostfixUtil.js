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
