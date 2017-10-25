function ByteUtil() {
    this.B_SIZE = 1024;
    this.KB_SIZE = 1048576;
    this.MB_SIZE = 1073741824;
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
}
byteUtil = new ByteUtil();