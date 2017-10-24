package service;

import java.util.HashMap;
import java.util.Map;

import org.grain.httpserver.HttpException;
import org.grain.httpserver.HttpPacket;
import org.grain.httpserver.IHttpListener;

import action.BoxErrorSAction;
import action.UserAction;
import action.UserBoxInfoAction;
import action.UserFoldAction;
import action.UserType2Action;
import config.CommonConfigBox;
import config.UserFoldConfig;
import dao.model.base.UserBoxinfo;
import dao.model.base.UserFold;
import data.UserData;
import http.HOpCodeBox;
import protobuf.http.BoxErrorProto.BoxErrorCode;
import protobuf.http.BoxErrorProto.BoxErrorS;
import protobuf.http.LoginProto.LoginC;
import protobuf.http.LoginProto.LoginS;

public class LoginService implements IHttpListener {

	@Override
	public Map<String, String> getHttps() {
		HashMap<String, String> map = new HashMap<>();
		map.put(HOpCodeBox.LOGIN, "loginHandle");
		return map;
	}

	public HttpPacket loginHandle(HttpPacket httpPacket) throws HttpException {
		LoginC message = (LoginC) httpPacket.getData();
		UserData userData;
		if (message.getType() == 2) {
			userData = UserType2Action.getUser(message.getToken());
		} else {
			userData = UserAction.getUser(message.getToken());
		}

		if (userData == null) {
			BoxErrorS boxErrorS = BoxErrorSAction.create(BoxErrorCode.ERROR_CODE_1, httpPacket.hSession.headParam.hOpCode);
			throw new HttpException(HOpCodeBox.BOX_ERROR, boxErrorS);
		}
		UserFold userFold = UserFoldAction.getUserFoldTopType(UserFoldConfig.OWNER_TYPE_USER, userData.getUserId());
		if (userFold == null) {
			userFold = UserFoldAction.createUserFoldTopType(UserFoldConfig.OWNER_TYPE_USER, userData.getUserId());
			if (userFold == null) {
				userFold = UserFoldAction.getUserFoldTopType(UserFoldConfig.OWNER_TYPE_USER, userData.getUserId());
			}
		}
		if (userFold == null) {
			BoxErrorS boxErrorS = BoxErrorSAction.create(BoxErrorCode.ERROR_CODE_2, httpPacket.hSession.headParam.hOpCode);
			throw new HttpException(HOpCodeBox.BOX_ERROR, boxErrorS);
		}
		UserBoxinfo userBoxinfo = UserBoxInfoAction.getUserBoxinfoById(userData.getUserId());
		if (userBoxinfo == null) {
			int boxSize = 0;
			if (message.getBoxsize() > 0) {
				boxSize = message.getBoxsize() - CommonConfigBox.BOX_INIT_SIZE;
			}
			userBoxinfo = UserBoxInfoAction.createUserBoxInfo(userData.getUserId(), boxSize);
			if (userBoxinfo == null) {
				userBoxinfo = UserBoxInfoAction.getUserBoxinfoById(userData.getUserId());
			}
		} else {
			if (message.getBoxsize() > 0) {
				userBoxinfo = UserBoxInfoAction.updateUserBoxinfo(userData.getUserId(), message.getBoxsize() - CommonConfigBox.BOX_INIT_SIZE);
			}
		}
		if (userBoxinfo == null) {
			BoxErrorS boxErrorS = BoxErrorSAction.create(BoxErrorCode.ERROR_CODE_2, httpPacket.hSession.headParam.hOpCode);
			throw new HttpException(HOpCodeBox.BOX_ERROR, boxErrorS);
		}
		LoginS.Builder builder = LoginS.newBuilder();
		builder.setHOpCode(httpPacket.hSession.headParam.hOpCode);
		builder.setUserFoldTopId(userFold.getUserFoldId());
		builder.setUserId(userData.getUserId());
		builder.setUserRealName(userData.getUserRealName());
		builder.setUserImgUrl(userData.getUserImgUrl());
		HttpPacket packet = new HttpPacket(httpPacket.hSession.headParam.hOpCode, builder.build());
		return packet;
	}
}
