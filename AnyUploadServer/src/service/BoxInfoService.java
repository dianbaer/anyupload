package service;

import java.util.HashMap;
import java.util.Map;

import org.grain.httpserver.HttpException;
import org.grain.httpserver.HttpPacket;
import org.grain.httpserver.IHttpListener;

import action.UserBoxInfoAction;
import action.UserFileAction;
import config.CommonConfigBox;
import dao.model.base.UserBoxinfo;
import data.UserData;
import http.HOpCodeBox;
import protobuf.http.BoxInfoProto.BoxInfoC;
import protobuf.http.BoxInfoProto.BoxInfoS;
import util.SizeUtil;

public class BoxInfoService implements IHttpListener {

	@Override
	public Map<String, String> getHttps() {
		HashMap<String, String> map = new HashMap<>();
		map.put(HOpCodeBox.GET_BOX_INFO, "getBoxInfoHandle");
		return map;
	}

	public HttpPacket getBoxInfoHandle(HttpPacket httpPacket) throws HttpException {
		BoxInfoC message = (BoxInfoC) httpPacket.getData();
		Long countSize = UserFileAction.getUserFileTotalSize(message.getUserFoldTopId());
		BoxInfoS.Builder builder = BoxInfoS.newBuilder();
		builder.setHOpCode(httpPacket.hSession.headParam.hOpCode);
		if (countSize == null) {
			builder.setUseSize(0);
		} else {
			int countM = (int) Math.ceil(countSize.longValue() / (SizeUtil.KB_SIZE + 0.0));
			builder.setUseSize(countM);
		}
		UserData userData = (UserData) httpPacket.hSession.otherData;
		UserBoxinfo userBoxinfo = UserBoxInfoAction.getUserBoxinfoById(userData.getUserId());
		if (userBoxinfo == null) {
			builder.setTotalSize(CommonConfigBox.BOX_INIT_SIZE);
		} else {
			builder.setTotalSize(CommonConfigBox.BOX_INIT_SIZE + userBoxinfo.getBoxSizeOffset());
		}
		HttpPacket packet = new HttpPacket(httpPacket.hSession.headParam.hOpCode, builder.build());
		return packet;
	}

}
