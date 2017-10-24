package config;

import java.util.Properties;

public class CommonConfigBox {
	// 用户中心url
	public static String UCENTER_URL;
	// 是否使用hdfs
	public static boolean IS_USE_HDFS;
	// 基础文件路径
	public static String FILE_BASE_PATH;
	// 最大上传长度
	public static int UPLOAD_MAX_LENGTH;
	// 客户端下一次上传文件间隔
	public static int WAIT_TIME;
	// 一次性写入文件的大小
	public static int ONCE_WRITE_FILE_SIZE;
	// 网盘初始化大小
	public static int BOX_INIT_SIZE;

	public static String TJSMESP_URL;
	public static String GET_USER_MSG_BY_USER_CODEURL;

	public static void init(Properties properties) {

		UCENTER_URL = properties.getProperty("uCenterUrl");
		IS_USE_HDFS = Boolean.valueOf(properties.getProperty("isUseHDFS"));
		FILE_BASE_PATH = properties.getProperty("fileBasePath");
		UPLOAD_MAX_LENGTH = Integer.valueOf(properties.getProperty("uploadMaxLength"));
		WAIT_TIME = Integer.valueOf(properties.getProperty("waitTime"));
		ONCE_WRITE_FILE_SIZE = Integer.valueOf(properties.getProperty("onceWriteFileSize"));
		BOX_INIT_SIZE = Integer.valueOf(properties.getProperty("boxInitSize"));

		TJSMESP_URL = properties.getProperty("tjsmespUrl");
		GET_USER_MSG_BY_USER_CODEURL = properties.getProperty("getUserMsgByUserCodeUrl");

	}

}
