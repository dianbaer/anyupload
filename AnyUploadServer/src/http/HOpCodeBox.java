package http;

import org.grain.httpserver.HttpManager;

import protobuf.http.BoxErrorProto.BoxErrorS;
import protobuf.http.BoxInfoProto.BoxInfoC;
import protobuf.http.BoxInfoProto.BoxInfoS;
import protobuf.http.LoginProto.LoginC;
import protobuf.http.LoginProto.LoginS;
import protobuf.http.MutliOperateProto.MutilOperateClearRecyclebinC;
import protobuf.http.MutliOperateProto.MutilOperateClearRecyclebinS;
import protobuf.http.MutliOperateProto.MutilOperateMoveToC;
import protobuf.http.MutliOperateProto.MutilOperateMoveToS;
import protobuf.http.MutliOperateProto.MutilOperateOffRecyclebinC;
import protobuf.http.MutliOperateProto.MutilOperateOffRecyclebinS;
import protobuf.http.MutliOperateProto.MutilOperateRemoveC;
import protobuf.http.MutliOperateProto.MutilOperateRemoveS;
import protobuf.http.MutliOperateProto.MutilOperateToRecyclebinC;
import protobuf.http.MutliOperateProto.MutilOperateToRecyclebinS;
import protobuf.http.UploadFileProto.MD5CheckC;
import protobuf.http.UploadFileProto.MD5CheckS;
import protobuf.http.UploadFileProto.UploadFileC;
import protobuf.http.UploadFileProto.UploadFileS;
import protobuf.http.UploadFileProto.UserFileDownloadC;
import protobuf.http.UserFoldProto.CreateUserFoldC;
import protobuf.http.UserFoldProto.CreateUserFoldS;
import protobuf.http.UserFoldProto.GetRecycleBinListC;
import protobuf.http.UserFoldProto.GetRecycleBinListS;
import protobuf.http.UserFoldProto.GetUserFoldChildrenC;
import protobuf.http.UserFoldProto.GetUserFoldChildrenS;
import protobuf.http.UserFoldProto.GetUserFoldChildrenUserFoldC;
import protobuf.http.UserFoldProto.GetUserFoldChildrenUserFoldS;
import protobuf.http.UserFoldProto.UpdateUserFileC;
import protobuf.http.UserFoldProto.UpdateUserFileS;
import protobuf.http.UserFoldProto.UpdateUserFoldC;
import protobuf.http.UserFoldProto.UpdateUserFoldS;

public class HOpCodeBox {
	public static String BOX_ERROR = "49999";
	public static String MD5_CHECK = "50000";
	public static String UPLOAD_FILE = "50001";
	public static String LOGIN = "50002";
	public static String CREATE_USERFOLD = "50003";
	public static String UPDATE_USERFOLD = "50004";
	public static String GET_USERFOLD_CHILDREN = "50005";
	public static String GET_RECYCLEBIN_LIST = "50006";
	public static String UPDATE_USERFILE = "50007";
	public static String USERFILE_DOWNLOAD = "50008";
	public static String MUTLI_TO_RECYCLEBIN = "50009";
	public static String MUTLI_OFF_RECYCLEBIN = "50010";
	public static String MUTLI_MOVE_TO = "50011";
	public static String MUTLI_REMOVE = "50012";
	public static String MUTLI_CLEAR_RECYCLEBIN = "50013";
	public static String GET_USERFOLD_CHILDREN_USERFOLD = "50014";
	public static String GET_BOX_INFO = "50015";

	public static void init() {
		HttpManager.addMapping(BOX_ERROR, null, BoxErrorS.class);
		HttpManager.addMapping(MD5_CHECK, MD5CheckC.class, MD5CheckS.class);
		HttpManager.addMapping(UPLOAD_FILE, UploadFileC.class, UploadFileS.class);
		HttpManager.addMapping(LOGIN, LoginC.class, LoginS.class);
		HttpManager.addMapping(CREATE_USERFOLD, CreateUserFoldC.class, CreateUserFoldS.class);
		HttpManager.addMapping(UPDATE_USERFOLD, UpdateUserFoldC.class, UpdateUserFoldS.class);
		HttpManager.addMapping(GET_USERFOLD_CHILDREN, GetUserFoldChildrenC.class, GetUserFoldChildrenS.class);
		HttpManager.addMapping(GET_RECYCLEBIN_LIST, GetRecycleBinListC.class, GetRecycleBinListS.class);
		HttpManager.addMapping(UPDATE_USERFILE, UpdateUserFileC.class, UpdateUserFileS.class);
		HttpManager.addMapping(USERFILE_DOWNLOAD, UserFileDownloadC.class, null);
		HttpManager.addMapping(MUTLI_TO_RECYCLEBIN, MutilOperateToRecyclebinC.class, MutilOperateToRecyclebinS.class);
		HttpManager.addMapping(MUTLI_OFF_RECYCLEBIN, MutilOperateOffRecyclebinC.class, MutilOperateOffRecyclebinS.class);
		HttpManager.addMapping(MUTLI_MOVE_TO, MutilOperateMoveToC.class, MutilOperateMoveToS.class);
		HttpManager.addMapping(MUTLI_REMOVE, MutilOperateRemoveC.class, MutilOperateRemoveS.class);
		HttpManager.addMapping(MUTLI_CLEAR_RECYCLEBIN, MutilOperateClearRecyclebinC.class, MutilOperateClearRecyclebinS.class);
		HttpManager.addMapping(GET_USERFOLD_CHILDREN_USERFOLD, GetUserFoldChildrenUserFoldC.class, GetUserFoldChildrenUserFoldS.class);
		HttpManager.addMapping(GET_BOX_INFO, BoxInfoC.class, BoxInfoS.class);

	}
}
