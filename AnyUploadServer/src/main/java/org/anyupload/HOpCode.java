package org.anyupload;

import org.anyupload.protobuf.ErrorProto.ErrorS;
import org.anyupload.protobuf.UploadFileProto.MD5CheckC;
import org.anyupload.protobuf.UploadFileProto.MD5CheckS;
import org.anyupload.protobuf.UploadFileProto.UploadFileC;
import org.anyupload.protobuf.UploadFileProto.UploadFileS;
import org.grain.httpserver.HttpManager;

public class HOpCode {
	/**
	 * 错误
	 */
	public static String ERROR = "49999";
	/**
	 * md5校验
	 */
	public static String MD5_CHECK = "50000";
	/**
	 * 上传文件
	 */
	public static String UPLOAD_FILE = "50001";

	public static void init() {
		HttpManager.addMapping(ERROR, null, ErrorS.class);
		HttpManager.addMapping(MD5_CHECK, MD5CheckC.class, MD5CheckS.class);
		HttpManager.addMapping(UPLOAD_FILE, UploadFileC.class, UploadFileS.class);
	}
}
