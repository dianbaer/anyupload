package http;

import org.grain.httpserver.HttpManager;

import protobuf.http.BoxErrorProto.BoxErrorS;
import protobuf.http.UploadFileProto.MD5CheckC;
import protobuf.http.UploadFileProto.MD5CheckS;
import protobuf.http.UploadFileProto.UploadFileC;
import protobuf.http.UploadFileProto.UploadFileS;

public class HOpCodeBox {
	public static String BOX_ERROR = "49999";
	public static String MD5_CHECK = "50000";
	public static String UPLOAD_FILE = "50001";

	public static void init() {
		HttpManager.addMapping(BOX_ERROR, null, BoxErrorS.class);
		HttpManager.addMapping(MD5_CHECK, MD5CheckC.class, MD5CheckS.class);
		HttpManager.addMapping(UPLOAD_FILE, UploadFileC.class, UploadFileS.class);
	}
}
