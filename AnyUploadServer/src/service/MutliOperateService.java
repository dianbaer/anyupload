package service;

import java.util.HashMap;
import java.util.Map;

import org.grain.httpserver.HttpException;
import org.grain.httpserver.HttpPacket;
import org.grain.httpserver.IHttpListener;

import action.BoxErrorSAction;
import action.UserFileAction;
import action.UserFoldAction;
import config.UserFileConfig;
import config.UserFoldConfig;
import http.HOpCodeBox;
import protobuf.http.BoxErrorProto.BoxErrorCode;
import protobuf.http.BoxErrorProto.BoxErrorS;
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

public class MutliOperateService implements IHttpListener {

	@Override
	public Map<String, String> getHttps() {
		HashMap<String, String> map = new HashMap<>();
		map.put(HOpCodeBox.MUTLI_TO_RECYCLEBIN, "mutliToRecycleBinHandle");
		map.put(HOpCodeBox.MUTLI_OFF_RECYCLEBIN, "mutliOffRecycleBinHandle");
		map.put(HOpCodeBox.MUTLI_MOVE_TO, "mutliMoveToHandle");
		map.put(HOpCodeBox.MUTLI_REMOVE, "mutliRemoveHandle");
		map.put(HOpCodeBox.MUTLI_CLEAR_RECYCLEBIN, "mutliClearRecycleBinHandle");
		return map;
	}

	public HttpPacket mutliToRecycleBinHandle(HttpPacket httpPacket) throws HttpException {
		MutilOperateToRecyclebinC message = (MutilOperateToRecyclebinC) httpPacket.getData();
		boolean result;
		if (message.getUserFoldIdsList().size() != 0) {
			result = UserFoldAction.updateUserFoldListState(message.getUserFoldIdsList(), UserFoldConfig.STATE_IN_RECYCLEBIN);
			if (!result) {
				BoxErrorS boxErrorS = BoxErrorSAction.create(BoxErrorCode.ERROR_CODE_20, httpPacket.hSession.headParam.hOpCode);
				throw new HttpException(HOpCodeBox.BOX_ERROR, boxErrorS);
			}
		}
		if (message.getUserFileIdsList().size() != 0) {
			result = UserFileAction.updateUserFileListState(message.getUserFileIdsList(), UserFileConfig.STATE_IN_RECYCLEBIN);
			if (!result) {
				BoxErrorS boxErrorS = BoxErrorSAction.create(BoxErrorCode.ERROR_CODE_20, httpPacket.hSession.headParam.hOpCode);
				throw new HttpException(HOpCodeBox.BOX_ERROR, boxErrorS);
			}
		}
		MutilOperateToRecyclebinS.Builder builder = MutilOperateToRecyclebinS.newBuilder();
		builder.setHOpCode(httpPacket.hSession.headParam.hOpCode);
		HttpPacket packet = new HttpPacket(httpPacket.hSession.headParam.hOpCode, builder.build());
		return packet;
	}

	public HttpPacket mutliOffRecycleBinHandle(HttpPacket httpPacket) throws HttpException {
		MutilOperateOffRecyclebinC message = (MutilOperateOffRecyclebinC) httpPacket.getData();
		boolean result;
		if (message.getUserFoldIdsList().size() != 0) {
			result = UserFoldAction.updateUserFoldListState(message.getUserFoldIdsList(), UserFoldConfig.STATE_CAN_USE);
			if (!result) {
				BoxErrorS boxErrorS = BoxErrorSAction.create(BoxErrorCode.ERROR_CODE_21, httpPacket.hSession.headParam.hOpCode);
				throw new HttpException(HOpCodeBox.BOX_ERROR, boxErrorS);
			}
		}
		if (message.getUserFileIdsList().size() != 0) {
			result = UserFileAction.updateUserFileListState(message.getUserFileIdsList(), UserFileConfig.STATE_CAN_USE);
			if (!result) {
				BoxErrorS boxErrorS = BoxErrorSAction.create(BoxErrorCode.ERROR_CODE_21, httpPacket.hSession.headParam.hOpCode);
				throw new HttpException(HOpCodeBox.BOX_ERROR, boxErrorS);
			}
		}
		MutilOperateOffRecyclebinS.Builder builder = MutilOperateOffRecyclebinS.newBuilder();
		builder.setHOpCode(httpPacket.hSession.headParam.hOpCode);
		HttpPacket packet = new HttpPacket(httpPacket.hSession.headParam.hOpCode, builder.build());
		return packet;
	}

	public HttpPacket mutliMoveToHandle(HttpPacket httpPacket) throws HttpException {
		MutilOperateMoveToC message = (MutilOperateMoveToC) httpPacket.getData();
		boolean result;
		if (message.getUserFoldIdsList().size() != 0) {
			result = UserFoldAction.updateUserFoldListParentId(message.getUserFoldIdsList(), message.getUserFoldParentId());
			if (!result) {
				BoxErrorS boxErrorS = BoxErrorSAction.create(BoxErrorCode.ERROR_CODE_22, httpPacket.hSession.headParam.hOpCode);
				throw new HttpException(HOpCodeBox.BOX_ERROR, boxErrorS);
			}
		}
		if (message.getUserFileIdsList().size() != 0) {
			result = UserFileAction.updateUserFileListParentId(message.getUserFileIdsList(), message.getUserFoldParentId());
			if (!result) {
				BoxErrorS boxErrorS = BoxErrorSAction.create(BoxErrorCode.ERROR_CODE_22, httpPacket.hSession.headParam.hOpCode);
				throw new HttpException(HOpCodeBox.BOX_ERROR, boxErrorS);
			}
		}
		MutilOperateMoveToS.Builder builder = MutilOperateMoveToS.newBuilder();
		builder.setHOpCode(httpPacket.hSession.headParam.hOpCode);
		HttpPacket packet = new HttpPacket(httpPacket.hSession.headParam.hOpCode, builder.build());
		return packet;
	}

	public HttpPacket mutliRemoveHandle(HttpPacket httpPacket) throws HttpException {
		MutilOperateRemoveC message = (MutilOperateRemoveC) httpPacket.getData();
		boolean result;
		if (message.getUserFoldIdsList().size() != 0) {
			result = UserFoldAction.updateUserFoldListState(message.getUserFoldIdsList(), UserFoldConfig.STATE_DELETE);
			if (!result) {
				BoxErrorS boxErrorS = BoxErrorSAction.create(BoxErrorCode.ERROR_CODE_23, httpPacket.hSession.headParam.hOpCode);
				throw new HttpException(HOpCodeBox.BOX_ERROR, boxErrorS);
			}
		}
		if (message.getUserFileIdsList().size() != 0) {
			result = UserFileAction.updateUserFileListState(message.getUserFileIdsList(), UserFileConfig.STATE_DELETE);
			if (!result) {
				BoxErrorS boxErrorS = BoxErrorSAction.create(BoxErrorCode.ERROR_CODE_23, httpPacket.hSession.headParam.hOpCode);
				throw new HttpException(HOpCodeBox.BOX_ERROR, boxErrorS);
			}
		}
		MutilOperateRemoveS.Builder builder = MutilOperateRemoveS.newBuilder();
		builder.setHOpCode(httpPacket.hSession.headParam.hOpCode);
		HttpPacket packet = new HttpPacket(httpPacket.hSession.headParam.hOpCode, builder.build());
		return packet;
	}

	public HttpPacket mutliClearRecycleBinHandle(HttpPacket httpPacket) throws HttpException {
		MutilOperateClearRecyclebinC message = (MutilOperateClearRecyclebinC) httpPacket.getData();
		boolean result = UserFoldAction.clearRecycleBin(message.getUserFoldTopId());
		if (!result) {
			BoxErrorS boxErrorS = BoxErrorSAction.create(BoxErrorCode.ERROR_CODE_24, httpPacket.hSession.headParam.hOpCode);
			throw new HttpException(HOpCodeBox.BOX_ERROR, boxErrorS);
		}
		result = UserFileAction.clearRecycleBin(message.getUserFoldTopId());
		if (!result) {
			BoxErrorS boxErrorS = BoxErrorSAction.create(BoxErrorCode.ERROR_CODE_24, httpPacket.hSession.headParam.hOpCode);
			throw new HttpException(HOpCodeBox.BOX_ERROR, boxErrorS);
		}
		MutilOperateClearRecyclebinS.Builder builder = MutilOperateClearRecyclebinS.newBuilder();
		builder.setHOpCode(httpPacket.hSession.headParam.hOpCode);
		HttpPacket packet = new HttpPacket(httpPacket.hSession.headParam.hOpCode, builder.build());
		return packet;
	}

}
