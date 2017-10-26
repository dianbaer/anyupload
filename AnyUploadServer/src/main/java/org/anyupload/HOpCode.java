package org.anyupload;

import org.anyupload.protobuf.ErrorProto.ErrorS;
import org.anyupload.protobuf.UploadFileProto.MD5CheckC;
import org.anyupload.protobuf.UploadFileProto.MD5CheckS;
import org.anyupload.protobuf.UploadFileProto.UploadFileC;
import org.anyupload.protobuf.UploadFileProto.UploadFileS;
import org.grain.httpserver.HttpManager;

public class HOpCode {
	public static String BOX_ERROR = "49999";
	public static String MD5_CHECK = "50000";
	public static String UPLOAD_FILE = "50001";

	public static void init() {
		HttpManager.addMapping(BOX_ERROR, null, ErrorS.class);
		HttpManager.addMapping(MD5_CHECK, MD5CheckC.class, MD5CheckS.class);
		HttpManager.addMapping(UPLOAD_FILE, UploadFileC.class, UploadFileS.class);
	}
}
