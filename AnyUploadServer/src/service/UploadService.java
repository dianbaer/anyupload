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

import action.IUserFileAction;
import action.UserFileAction;
import config.CommonConfigBox;
import config.FileBaseConfig;
import dao.model.base.FileBase;
import dao.model.ext.UserFileExt;
import http.HOpCodeBox;
import protobuf.http.BoxErrorProto.BoxErrorCode;
import protobuf.http.BoxErrorProto.BoxErrorS;
import protobuf.http.UploadFileProto.MD5CheckC;
import protobuf.http.UploadFileProto.MD5CheckS;
import protobuf.http.UploadFileProto.UploadFileC;
import protobuf.http.UploadFileProto.UploadFileS;
import protobuf.http.UploadFileProto.UserFileDownloadC;
import tool.StringUtil;

public class UploadService implements IHttpListener {
	public IUserFileAction userFileAction;

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
			userFile = userFileAction.getUserFile(message.getUserFileId());
			if (userFile != null && userFile.getFileBase().getFileBaseState() == FileBaseConfig.STATE_COMPLETE) {
				MD5CheckS.Builder builder = MD5CheckS.newBuilder();
				builder.setHOpCode(httpPacket.hSession.headParam.hOpCode);
				builder.setResult(1);
				builder.setUserFileId(userFile.getUserFileId());
				HttpPacket packet = new HttpPacket(httpPacket.hSession.headParam.hOpCode, builder.build());
				return packet;
			}
		}
		FileBase fileBase = userFileAction.getFileBaseByMd5(message.getFileBaseMd5());
		if (userFile == null) {
			userFile = userFileAction.createUserFile(message.getUserFileName(), message.getUserFoldParentId(), "xxxxx", message.getFileBaseMd5(), message.getFileBaseTotalSize(), fileBase);
			if (userFile == null) {
				BoxErrorS boxErrorS = createError(BoxErrorCode.ERROR_CODE_3, httpPacket.hSession.headParam.hOpCode);
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
				boolean result = userFileAction.changeFileBase(userFile, fileBase);
				if (!result) {
					BoxErrorS boxErrorS = createError(BoxErrorCode.ERROR_CODE_3, httpPacket.hSession.headParam.hOpCode);
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
		UserFileExt userFile = userFileAction.getUserFile(message.getUserFileId());
		if (userFile == null) {
			BoxErrorS boxErrorS = createError(BoxErrorCode.ERROR_CODE_4, httpPacket.hSession.headParam.hOpCode);
			throw new HttpException(HOpCodeBox.BOX_ERROR, boxErrorS);
		}
		// 位置不对
		if (message.getFileBasePos() != userFile.getFileBase().getFileBasePos()) {
			BoxErrorS boxErrorS = createError(BoxErrorCode.ERROR_CODE_5, httpPacket.hSession.headParam.hOpCode);
			throw new HttpException(HOpCodeBox.BOX_ERROR, boxErrorS);
		}
		// 不能大于默认长度
		if (message.getUploadLength() > CommonConfigBox.UPLOAD_MAX_LENGTH) {
			BoxErrorS boxErrorS = createError(BoxErrorCode.ERROR_CODE_6, httpPacket.hSession.headParam.hOpCode);
			throw new HttpException(HOpCodeBox.BOX_ERROR, boxErrorS);
		}
		// 没有文件
		if (httpPacket.fileList == null || httpPacket.fileList.size() == 0) {
			BoxErrorS boxErrorS = createError(BoxErrorCode.ERROR_CODE_7, httpPacket.hSession.headParam.hOpCode);
			throw new HttpException(HOpCodeBox.BOX_ERROR, boxErrorS);
		}
		FileData fileData = httpPacket.fileList.get(0);
		// 文件长度与消息长度不符
		if ((int) fileData.getFile().length() != message.getUploadLength()) {
			BoxErrorS boxErrorS = createError(BoxErrorCode.ERROR_CODE_6, httpPacket.hSession.headParam.hOpCode);
			throw new HttpException(HOpCodeBox.BOX_ERROR, boxErrorS);
		}
		// 不存在这个文件
		File file = userFileAction.getFile(userFile.getFileBase().getFileBaseRealPath());
		if (file == null) {
			BoxErrorS boxErrorS = createError(BoxErrorCode.ERROR_CODE_8, httpPacket.hSession.headParam.hOpCode);
			throw new HttpException(HOpCodeBox.BOX_ERROR, boxErrorS);
		}
		if (file.length() != message.getFileBasePos()) {
			BoxErrorS boxErrorS = createError(BoxErrorCode.ERROR_CODE_6, httpPacket.hSession.headParam.hOpCode);
			throw new HttpException(HOpCodeBox.BOX_ERROR, boxErrorS);
		}
		Date date = new Date();
		// 是否在规定时间后上传
		if (date.getTime() < userFile.getFileBase().getFileBaseNextUploadTime().getTime()) {
			BoxErrorS boxErrorS = createError(BoxErrorCode.ERROR_CODE_9, httpPacket.hSession.headParam.hOpCode);
			throw new HttpException(HOpCodeBox.BOX_ERROR, boxErrorS);
		}
		FileBase fileBase = userFileAction.getFileBaseByMd5(userFile.getFileBase().getFileBaseMd5());
		if (fileBase != null) {
			// 更新，然后秒传
			boolean result = userFileAction.changeFileBase(userFile, fileBase);
			if (!result) {
				BoxErrorS boxErrorS = createError(BoxErrorCode.ERROR_CODE_10, httpPacket.hSession.headParam.hOpCode);
				throw new HttpException(HOpCodeBox.BOX_ERROR, boxErrorS);
			}
			UploadFileS.Builder builder = UploadFileS.newBuilder();
			builder.setHOpCode(httpPacket.hSession.headParam.hOpCode);
			builder.setResult(1);
			builder.setUserFileId(userFile.getUserFileId());
			HttpPacket packet = new HttpPacket(httpPacket.hSession.headParam.hOpCode, builder.build());
			return packet;
		}
		boolean result = userFileAction.updateFile(file, fileData.getFile());
		if (!result) {
			BoxErrorS boxErrorS = createError(BoxErrorCode.ERROR_CODE_11, httpPacket.hSession.headParam.hOpCode);
			throw new HttpException(HOpCodeBox.BOX_ERROR, boxErrorS);
		}
		result = userFileAction.updateUserFile(userFile, message.getUploadLength());
		if (!result) {
			BoxErrorS boxErrorS = createError(BoxErrorCode.ERROR_CODE_12, httpPacket.hSession.headParam.hOpCode);
			throw new HttpException(HOpCodeBox.BOX_ERROR, boxErrorS);
		}
		if ((message.getFileBasePos() + message.getUploadLength()) == userFile.getFileBase().getFileBaseTotalSize()) {
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
		UserFileExt userFile = userFileAction.getUserFileComplete(message.getUserFileId());
		if (userFile == null) {
			return null;
		}
		File file = userFileAction.getFile(userFile.getFileBase().getFileBaseRealPath());
		if (file == null) {
			return null;
		}
		ReplyFile replyFile = new ReplyFile(file, userFile.getUserFileName());
		return replyFile;
	}

	public UploadService() {
		userFileAction = new UserFileAction();
		userFileAction.createFileBaseDir();
	}

	public static BoxErrorS createError(BoxErrorCode boxErrorCode, String errorHOpCode) {
		BoxErrorS.Builder errorBuilder = BoxErrorS.newBuilder();
		errorBuilder.setHOpCode(HOpCodeBox.BOX_ERROR);
		errorBuilder.setErrorCode(boxErrorCode);
		errorBuilder.setErrorHOpCode(errorHOpCode);
		return errorBuilder.build();
	}
}
