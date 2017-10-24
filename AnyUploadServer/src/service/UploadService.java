package service;

import java.io.File;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;

import org.grain.httpserver.FileData;
import org.grain.httpserver.HttpException;
import org.grain.httpserver.HttpPacket;
import org.grain.httpserver.IHttpListener;
import org.grain.httpserver.ReplyFile;

import action.BoxErrorSAction;
import action.FileBaseAction;
import action.UserBoxInfoAction;
import action.UserFileAction;
import action.UserFoldAction;
import config.CommonConfigBox;
import config.FileBaseConfig;
import dao.model.base.FileBase;
import dao.model.base.UserBoxinfo;
import dao.model.base.UserFold;
import dao.model.ext.UserFileExt;
import data.UserData;
import http.HOpCodeBox;
import protobuf.http.BoxErrorProto.BoxErrorCode;
import protobuf.http.BoxErrorProto.BoxErrorS;
import protobuf.http.UploadFileProto.MD5CheckC;
import protobuf.http.UploadFileProto.MD5CheckS;
import protobuf.http.UploadFileProto.UploadFileC;
import protobuf.http.UploadFileProto.UploadFileS;
import protobuf.http.UploadFileProto.UserFileDownloadC;
import tool.StringUtil;
import util.SizeUtil;

public class UploadService implements IHttpListener {

	@Override
	public Map<String, String> getHttps() {
		HashMap<String, String> map = new HashMap<>();
		map.put(HOpCodeBox.MD5_CHECK, "md5CheckHandle");
		map.put(HOpCodeBox.UPLOAD_FILE, "uploadFileHandle");
		map.put(HOpCodeBox.USERFILE_DOWNLOAD, "userFileDownloadHandle");
		return map;
	}

	public HttpPacket md5CheckHandle(HttpPacket httpPacket) throws HttpException {
		MD5CheckC message = (MD5CheckC) httpPacket.getData();
		UserFileExt userFile = null;
		if (!StringUtil.stringIsNull(message.getUserFileId())) {
			userFile = UserFileAction.getUserFile(message.getUserFileId());
			if (userFile != null && userFile.getFileBase().getFileBaseState().intValue() == FileBaseConfig.STATE_COMPLETE) {
				MD5CheckS.Builder builder = MD5CheckS.newBuilder();
				builder.setHOpCode(httpPacket.hSession.headParam.hOpCode);
				builder.setResult(1);
				builder.setUserFileId(userFile.getUserFileId());
				HttpPacket packet = new HttpPacket(httpPacket.hSession.headParam.hOpCode, builder.build());
				return packet;
			}
		}
		UserData userData = (UserData) httpPacket.hSession.otherData;
		FileBase fileBase = FileBaseAction.getFileBaseByMd5(message.getFileBaseMd5());
		if (userFile == null) {
			// 校验大小开始
			UserFold parentUserFold = UserFoldAction.getUserFoldById(message.getUserFoldParentId());
			String userFoldTopId = null;
			if (StringUtil.stringIsNull(parentUserFold.getUserFoldTopId())) {
				userFoldTopId = parentUserFold.getUserFoldId();
			} else {
				userFoldTopId = parentUserFold.getUserFoldTopId();
			}
			Long userFileTotalSize = UserFileAction.getUserFileTotalSize(userFoldTopId);
			UserBoxinfo userBoxinfo = UserBoxInfoAction.getUserBoxinfoById(userData.getUserId());
			int boxSize = CommonConfigBox.BOX_INIT_SIZE;
			if (userBoxinfo != null) {
				boxSize = CommonConfigBox.BOX_INIT_SIZE + userBoxinfo.getBoxSizeOffset();
			}
			if (userFileTotalSize != null) {
				if (userFileTotalSize.longValue() + message.getFileBaseTotalSize() > boxSize * SizeUtil.KB_SIZE) {
					BoxErrorS boxErrorS = BoxErrorSAction.create(BoxErrorCode.ERROR_CODE_25, httpPacket.hSession.headParam.hOpCode);
					throw new HttpException(HOpCodeBox.BOX_ERROR, boxErrorS);
				}
			}
			// 校验大小结束
			userFile = UserFileAction.createUserFile(message.getUserFileName(), message.getUserFoldParentId(), userData.getUserId(), message.getFileBaseMd5(), message.getFileBaseTotalSize(), fileBase);
			if (userFile == null) {
				BoxErrorS boxErrorS = BoxErrorSAction.create(BoxErrorCode.ERROR_CODE_3, httpPacket.hSession.headParam.hOpCode);
				throw new HttpException(HOpCodeBox.BOX_ERROR, boxErrorS);
			}
			if (fileBase != null) {
				// 秒传
				MD5CheckS.Builder builder = MD5CheckS.newBuilder();
				builder.setHOpCode(httpPacket.hSession.headParam.hOpCode);
				builder.setResult(1);
				builder.setUserFileId(userFile.getUserFileId());
				HttpPacket packet = new HttpPacket(httpPacket.hSession.headParam.hOpCode, builder.build());
				return packet;
			} else {
				// 通知从哪开始传
				MD5CheckS.Builder builder = MD5CheckS.newBuilder();
				builder.setHOpCode(httpPacket.hSession.headParam.hOpCode);
				builder.setResult(2);
				builder.setUserFileId(userFile.getUserFileId());
				builder.setFileBasePos(userFile.getFileBase().getFileBasePos());
				builder.setUploadMaxLength(CommonConfigBox.UPLOAD_MAX_LENGTH);
				HttpPacket packet = new HttpPacket(httpPacket.hSession.headParam.hOpCode, builder.build());
				return packet;
			}
		} else {
			if (fileBase != null) {
				// 更新，然后秒传
				boolean result = UserFileAction.changeFileBase(userFile.getUserFileId(), fileBase.getFileBaseId());
				if (!result) {
					BoxErrorS boxErrorS = BoxErrorSAction.create(BoxErrorCode.ERROR_CODE_3, httpPacket.hSession.headParam.hOpCode);
					throw new HttpException(HOpCodeBox.BOX_ERROR, boxErrorS);
				}
				MD5CheckS.Builder builder = MD5CheckS.newBuilder();
				builder.setHOpCode(httpPacket.hSession.headParam.hOpCode);
				builder.setResult(1);
				builder.setUserFileId(userFile.getUserFileId());
				HttpPacket packet = new HttpPacket(httpPacket.hSession.headParam.hOpCode, builder.build());
				return packet;
			} else {
				// 通知从哪开始传
				MD5CheckS.Builder builder = MD5CheckS.newBuilder();
				builder.setHOpCode(httpPacket.hSession.headParam.hOpCode);
				builder.setResult(2);
				builder.setUserFileId(userFile.getUserFileId());
				builder.setFileBasePos(userFile.getFileBase().getFileBasePos());
				builder.setUploadMaxLength(CommonConfigBox.UPLOAD_MAX_LENGTH);
				HttpPacket packet = new HttpPacket(httpPacket.hSession.headParam.hOpCode, builder.build());
				return packet;
			}
		}
	}

	public HttpPacket uploadFileHandle(HttpPacket httpPacket) throws HttpException {
		UploadFileC message = (UploadFileC) httpPacket.getData();
		UserFileExt userFile = UserFileAction.getUserFile(message.getUserFileId());
		if (userFile == null) {
			BoxErrorS boxErrorS = BoxErrorSAction.create(BoxErrorCode.ERROR_CODE_4, httpPacket.hSession.headParam.hOpCode);
			throw new HttpException(HOpCodeBox.BOX_ERROR, boxErrorS);
		}
		// 位置不对
		if (message.getFileBasePos() != userFile.getFileBase().getFileBasePos().longValue()) {
			BoxErrorS boxErrorS = BoxErrorSAction.create(BoxErrorCode.ERROR_CODE_5, httpPacket.hSession.headParam.hOpCode);
			throw new HttpException(HOpCodeBox.BOX_ERROR, boxErrorS);
		}
		// 不能大于默认长度
		if (message.getUploadLength() > CommonConfigBox.UPLOAD_MAX_LENGTH) {
			BoxErrorS boxErrorS = BoxErrorSAction.create(BoxErrorCode.ERROR_CODE_6, httpPacket.hSession.headParam.hOpCode);
			throw new HttpException(HOpCodeBox.BOX_ERROR, boxErrorS);
		}
		// 没有文件
		if (httpPacket.fileList == null || httpPacket.fileList.size() == 0) {
			BoxErrorS boxErrorS = BoxErrorSAction.create(BoxErrorCode.ERROR_CODE_7, httpPacket.hSession.headParam.hOpCode);
			throw new HttpException(HOpCodeBox.BOX_ERROR, boxErrorS);
		}
		FileData fileData = httpPacket.fileList.get(0);
		// 文件长度与消息长度不符
		if ((int) fileData.getFile().length() != message.getUploadLength()) {
			BoxErrorS boxErrorS = BoxErrorSAction.create(BoxErrorCode.ERROR_CODE_6, httpPacket.hSession.headParam.hOpCode);
			throw new HttpException(HOpCodeBox.BOX_ERROR, boxErrorS);
		}
		// 不存在这个文件
		File file = UserFileAction.getFile(userFile.getFileBase().getFileBaseRealPath());
		if (file == null) {
			BoxErrorS boxErrorS = BoxErrorSAction.create(BoxErrorCode.ERROR_CODE_8, httpPacket.hSession.headParam.hOpCode);
			throw new HttpException(HOpCodeBox.BOX_ERROR, boxErrorS);
		}
		if (file.length() != message.getFileBasePos()) {
			BoxErrorS boxErrorS = BoxErrorSAction.create(BoxErrorCode.ERROR_CODE_6, httpPacket.hSession.headParam.hOpCode);
			throw new HttpException(HOpCodeBox.BOX_ERROR, boxErrorS);
		}
		Date date = new Date();
		// 是否在规定时间后上传
		if (date.getTime() < userFile.getFileBase().getFileBaseNextUploadTime().getTime()) {
			BoxErrorS boxErrorS = BoxErrorSAction.create(BoxErrorCode.ERROR_CODE_9, httpPacket.hSession.headParam.hOpCode);
			throw new HttpException(HOpCodeBox.BOX_ERROR, boxErrorS);
		}
		FileBase fileBase = FileBaseAction.getFileBaseByMd5(userFile.getFileBase().getFileBaseMd5());
		if (fileBase != null) {
			// 更新，然后秒传
			boolean result = UserFileAction.changeFileBase(userFile.getUserFileId(), fileBase.getFileBaseId());
			if (!result) {
				BoxErrorS boxErrorS = BoxErrorSAction.create(BoxErrorCode.ERROR_CODE_10, httpPacket.hSession.headParam.hOpCode);
				throw new HttpException(HOpCodeBox.BOX_ERROR, boxErrorS);
			}
			UploadFileS.Builder builder = UploadFileS.newBuilder();
			builder.setHOpCode(httpPacket.hSession.headParam.hOpCode);
			builder.setResult(1);
			builder.setUserFileId(userFile.getUserFileId());
			HttpPacket packet = new HttpPacket(httpPacket.hSession.headParam.hOpCode, builder.build());
			return packet;
		}
		boolean result = UserFileAction.updateFile(file, fileData.getFile());
		if (!result) {
			BoxErrorS boxErrorS = BoxErrorSAction.create(BoxErrorCode.ERROR_CODE_11, httpPacket.hSession.headParam.hOpCode);
			throw new HttpException(HOpCodeBox.BOX_ERROR, boxErrorS);
		}
		result = UserFileAction.updateUserFile(userFile, message.getUploadLength());
		if (!result) {
			BoxErrorS boxErrorS = BoxErrorSAction.create(BoxErrorCode.ERROR_CODE_12, httpPacket.hSession.headParam.hOpCode);
			throw new HttpException(HOpCodeBox.BOX_ERROR, boxErrorS);
		}
		if ((message.getFileBasePos() + message.getUploadLength()) == userFile.getFileBase().getFileBaseTotalSize().longValue()) {
			UploadFileS.Builder builder = UploadFileS.newBuilder();
			builder.setHOpCode(httpPacket.hSession.headParam.hOpCode);
			builder.setResult(3);
			builder.setUserFileId(userFile.getUserFileId());
			HttpPacket packet = new HttpPacket(httpPacket.hSession.headParam.hOpCode, builder.build());
			return packet;
		} else {
			UploadFileS.Builder builder = UploadFileS.newBuilder();
			builder.setHOpCode(httpPacket.hSession.headParam.hOpCode);
			builder.setResult(2);
			builder.setUserFileId(userFile.getUserFileId());
			builder.setWaitTime(CommonConfigBox.WAIT_TIME);
			builder.setUploadMaxLength(CommonConfigBox.UPLOAD_MAX_LENGTH);
			builder.setFileBasePos((message.getFileBasePos() + message.getUploadLength()));
			HttpPacket packet = new HttpPacket(httpPacket.hSession.headParam.hOpCode, builder.build());
			return packet;
		}
	}

	public ReplyFile userFileDownloadHandle(HttpPacket httpPacket) {
		UserFileDownloadC message = (UserFileDownloadC) httpPacket.getData();
		UserFileExt userFile = UserFileAction.getUserFileComplete(message.getUserFileId());
		if (userFile == null) {
			return null;
		}
		File file = UserFileAction.getFile(userFile.getFileBase().getFileBaseRealPath());
		if (file == null) {
			return null;
		}
		ReplyFile replyFile = new ReplyFile(file, userFile.getUserFileName());
		return replyFile;
	}

	public UploadService() {
		UserFileAction.createFileBaseDir();
	}

}
