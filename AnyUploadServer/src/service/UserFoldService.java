package service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.grain.httpserver.HttpException;
import org.grain.httpserver.HttpPacket;
import org.grain.httpserver.IHttpListener;

import action.BoxErrorSAction;
import action.UserFileAction;
import action.UserFoldAction;
import dao.model.base.UserFold;
import dao.model.ext.UserFileExt;
import dao.model.ext.UserFoldExt;
import data.UserData;
import http.HOpCodeBox;
import protobuf.http.BoxErrorProto.BoxErrorCode;
import protobuf.http.BoxErrorProto.BoxErrorS;
import protobuf.http.UserFoldProto.CreateUserFoldC;
import protobuf.http.UserFoldProto.CreateUserFoldS;
import protobuf.http.UserFoldProto.GetRecycleBinListC;
import protobuf.http.UserFoldProto.GetRecycleBinListS;
import protobuf.http.UserFoldProto.GetUserFoldChildrenC;
import protobuf.http.UserFoldProto.GetUserFoldChildrenS;
import protobuf.http.UserFoldProto.GetUserFoldChildrenUserFoldC;
import protobuf.http.UserFoldProto.GetUserFoldChildrenUserFoldS;
import protobuf.http.UserFoldProto.UpdateUserFoldC;
import protobuf.http.UserFoldProto.UpdateUserFoldS;
import tool.StringUtil;

public class UserFoldService implements IHttpListener {

	@Override
	public Map<String, String> getHttps() {
		HashMap<String, String> map = new HashMap<>();
		map.put(HOpCodeBox.CREATE_USERFOLD, "createUserFoldHandle");
		map.put(HOpCodeBox.UPDATE_USERFOLD, "updateUserFoldHandle");
		map.put(HOpCodeBox.GET_USERFOLD_CHILDREN, "getUserFoldChildrenHandle");
		map.put(HOpCodeBox.GET_RECYCLEBIN_LIST, "getRecyclebinHandle");
		map.put(HOpCodeBox.GET_USERFOLD_CHILDREN_USERFOLD, "getUserFoldChildrenUserFoldHandle");
		return map;
	}

	public HttpPacket createUserFoldHandle(HttpPacket httpPacket) throws HttpException {
		CreateUserFoldC message = (CreateUserFoldC) httpPacket.getData();
		UserData userData = (UserData) httpPacket.hSession.otherData;
		String userFoldParentId = message.getUserFoldParentId();
		if (StringUtil.stringIsNull(userFoldParentId)) {
			BoxErrorS boxErrorS = BoxErrorSAction.create(BoxErrorCode.ERROR_CODE_13, httpPacket.hSession.headParam.hOpCode);
			throw new HttpException(HOpCodeBox.BOX_ERROR, boxErrorS);
		}
		UserFold userFold = UserFoldAction.createUserFoldChild(message.getUserFoldName(), userFoldParentId, userData.getUserId());
		if (userFold == null) {
			BoxErrorS boxErrorS = BoxErrorSAction.create(BoxErrorCode.ERROR_CODE_14, httpPacket.hSession.headParam.hOpCode);
			throw new HttpException(HOpCodeBox.BOX_ERROR, boxErrorS);
		}
		CreateUserFoldS.Builder builder = CreateUserFoldS.newBuilder();
		builder.setHOpCode(httpPacket.hSession.headParam.hOpCode);
		builder.setUserFold(UserFoldAction.getUserFoldBuilder(userFold));
		HttpPacket packet = new HttpPacket(httpPacket.hSession.headParam.hOpCode, builder.build());
		return packet;
	}

	public HttpPacket updateUserFoldHandle(HttpPacket httpPacket) throws HttpException {
		UpdateUserFoldC message = (UpdateUserFoldC) httpPacket.getData();
		UserFold userFold = UserFoldAction.updateUserFold(message.getUserFoldId(), message.getUserFoldName(), message.getUserFoldState(), message.getIsUpdateUserFoldParent(), message.getUserFoldParentId());
		if (userFold == null) {
			BoxErrorS boxErrorS = BoxErrorSAction.create(BoxErrorCode.ERROR_CODE_15, httpPacket.hSession.headParam.hOpCode);
			throw new HttpException(HOpCodeBox.BOX_ERROR, boxErrorS);
		}
		UpdateUserFoldS.Builder builder = UpdateUserFoldS.newBuilder();
		builder.setHOpCode(httpPacket.hSession.headParam.hOpCode);
		builder.setUserFold(UserFoldAction.getUserFoldBuilder(userFold));
		HttpPacket packet = new HttpPacket(httpPacket.hSession.headParam.hOpCode, builder.build());
		return packet;
	}

	public HttpPacket getUserFoldChildrenHandle(HttpPacket httpPacket) throws HttpException {
		GetUserFoldChildrenC message = (GetUserFoldChildrenC) httpPacket.getData();
		List<UserFold> userFoldList = UserFoldAction.getUserFoldChildren(message.getUserFoldParentId());
		if (userFoldList == null) {
			BoxErrorS boxErrorS = BoxErrorSAction.create(BoxErrorCode.ERROR_CODE_16, httpPacket.hSession.headParam.hOpCode);
			throw new HttpException(HOpCodeBox.BOX_ERROR, boxErrorS);
		}
		List<UserFileExt> userFileList = UserFileAction.getUserFoldChildren(message.getUserFoldParentId());
		if (userFileList == null) {
			BoxErrorS boxErrorS = BoxErrorSAction.create(BoxErrorCode.ERROR_CODE_16, httpPacket.hSession.headParam.hOpCode);
			throw new HttpException(HOpCodeBox.BOX_ERROR, boxErrorS);
		}
		List<UserFold> recursionUserFoldList = UserFoldAction.getRecursionUserFoldList(message.getUserFoldParentId());
		if (recursionUserFoldList == null) {
			BoxErrorS boxErrorS = BoxErrorSAction.create(BoxErrorCode.ERROR_CODE_16, httpPacket.hSession.headParam.hOpCode);
			throw new HttpException(HOpCodeBox.BOX_ERROR, boxErrorS);
		}
		GetUserFoldChildrenS.Builder builder = GetUserFoldChildrenS.newBuilder();
		builder.setHOpCode(httpPacket.hSession.headParam.hOpCode);
		for (int i = 0; i < userFoldList.size(); i++) {
			UserFold userFold = userFoldList.get(i);
			builder.addUserFoldList(UserFoldAction.getUserFoldBuilder(userFold));
		}
		for (int i = 0; i < userFileList.size(); i++) {
			UserFileExt userFile = userFileList.get(i);
			builder.addUserFileList(UserFileAction.getUserFileBuilder(userFile));
		}
		for (int i = 0; i < recursionUserFoldList.size(); i++) {
			UserFold userFold = recursionUserFoldList.get(i);
			builder.addRecursionUserFoldList(UserFoldAction.getUserFoldBuilder(userFold));
		}
		HttpPacket packet = new HttpPacket(httpPacket.hSession.headParam.hOpCode, builder.build());
		return packet;
	}

	public HttpPacket getUserFoldChildrenUserFoldHandle(HttpPacket httpPacket) throws HttpException {
		GetUserFoldChildrenUserFoldC message = (GetUserFoldChildrenUserFoldC) httpPacket.getData();
		List<UserFoldExt> userFoldList = UserFoldAction.getUserFoldChildrenWithChildNum(message.getUserFoldParentId());
		if (userFoldList == null) {
			BoxErrorS boxErrorS = BoxErrorSAction.create(BoxErrorCode.ERROR_CODE_17, httpPacket.hSession.headParam.hOpCode);
			throw new HttpException(HOpCodeBox.BOX_ERROR, boxErrorS);
		}
		GetUserFoldChildrenUserFoldS.Builder builder = GetUserFoldChildrenUserFoldS.newBuilder();
		builder.setHOpCode(httpPacket.hSession.headParam.hOpCode);
		for (int i = 0; i < userFoldList.size(); i++) {
			UserFold userFold = userFoldList.get(i);
			builder.addUserFoldList(UserFoldAction.getUserFoldBuilder(userFold));
		}
		HttpPacket packet = new HttpPacket(httpPacket.hSession.headParam.hOpCode, builder.build());
		return packet;
	}

	public HttpPacket getRecyclebinHandle(HttpPacket httpPacket) throws HttpException {
		GetRecycleBinListC message = (GetRecycleBinListC) httpPacket.getData();
		List<UserFold> userFoldList = UserFoldAction.getRecyclebinUserFold(message.getUserFoldTopId());
		if (userFoldList == null) {
			BoxErrorS boxErrorS = BoxErrorSAction.create(BoxErrorCode.ERROR_CODE_18, httpPacket.hSession.headParam.hOpCode);
			throw new HttpException(HOpCodeBox.BOX_ERROR, boxErrorS);
		}
		List<UserFileExt> userFileList = UserFileAction.getRecycleBinUserFile(message.getUserFoldTopId());
		if (userFileList == null) {
			BoxErrorS boxErrorS = BoxErrorSAction.create(BoxErrorCode.ERROR_CODE_18, httpPacket.hSession.headParam.hOpCode);
			throw new HttpException(HOpCodeBox.BOX_ERROR, boxErrorS);
		}
		GetRecycleBinListS.Builder builder = GetRecycleBinListS.newBuilder();
		builder.setHOpCode(httpPacket.hSession.headParam.hOpCode);
		for (int i = 0; i < userFoldList.size(); i++) {
			UserFold userFold = userFoldList.get(i);
			builder.addUserFoldList(UserFoldAction.getUserFoldBuilder(userFold));
		}
		for (int i = 0; i < userFileList.size(); i++) {
			UserFileExt userFile = userFileList.get(i);
			builder.addUserFileList(UserFileAction.getUserFileBuilder(userFile));
		}
		HttpPacket packet = new HttpPacket(httpPacket.hSession.headParam.hOpCode, builder.build());
		return packet;
	}
}
