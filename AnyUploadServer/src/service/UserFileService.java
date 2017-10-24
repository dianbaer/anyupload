package service;

import java.util.HashMap;
import java.util.Map;

import org.grain.httpserver.HttpException;
import org.grain.httpserver.HttpPacket;
import org.grain.httpserver.IHttpListener;

import action.BoxErrorSAction;
import action.UserFileAction;
import dao.model.ext.UserFileExt;
import http.HOpCodeBox;
import protobuf.http.BoxErrorProto.BoxErrorCode;
import protobuf.http.BoxErrorProto.BoxErrorS;
import protobuf.http.UserFoldProto.UpdateUserFileC;
import protobuf.http.UserFoldProto.UpdateUserFileS;

public class UserFileService implements IHttpListener {

	@Override
	public Map<String, String> getHttps() {
		HashMap<String, String> map = new HashMap<>();
		map.put(HOpCodeBox.UPDATE_USERFILE, "updateUserFileHandle");
		return map;
	}

	public HttpPacket updateUserFileHandle(HttpPacket httpPacket) throws HttpException {
		UpdateUserFileC message = (UpdateUserFileC) httpPacket.getData();
		UserFileExt userFile = UserFileAction.updateUserFile(message.getUserFileId(), message.getUserFileName(), message.getUserFileState(), message.getIsUpdateUserFoldParent(), message.getUserFoldParentId());
		if (userFile == null) {
			BoxErrorS boxErrorS = BoxErrorSAction.create(BoxErrorCode.ERROR_CODE_19, httpPacket.hSession.headParam.hOpCode);
			throw new HttpException(HOpCodeBox.BOX_ERROR, boxErrorS);
		}
		UpdateUserFileS.Builder builder = UpdateUserFileS.newBuilder();
		builder.setHOpCode(httpPacket.hSession.headParam.hOpCode);
		builder.setUserFile(UserFileAction.getUserFileBuilder(userFile));
		HttpPacket packet = new HttpPacket(httpPacket.hSession.headParam.hOpCode, builder.build());
		return packet;
	}
}
