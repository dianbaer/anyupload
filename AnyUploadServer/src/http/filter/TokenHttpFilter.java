package http.filter;

import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

import org.grain.httpserver.HttpException;
import org.grain.httpserver.HttpPacket;
import org.grain.httpserver.IHttpFilter;

import action.UserAction;
import action.UserType2Action;
import data.UserData;
import http.HOpCodeBox;

public class TokenHttpFilter implements IHttpFilter {
	private Map<String, Integer> tokenTypeMap = new ConcurrentHashMap<>();

	@Override
	public boolean httpFilter(HttpPacket httpPacket) throws HttpException {
		if (httpPacket.hSession.headParam.token == null) {
			if (HOpCodeBox.LOGIN.equals(httpPacket.hSession.headParam.hOpCode)) {
				// 可以通过
				return true;
			} else {
				return false;
			}
		}
		UserData userData = null;
		Integer type = tokenTypeMap.get(httpPacket.hSession.headParam.token);
		if (type == null) {
			userData = UserAction.getUser(httpPacket.hSession.headParam.token);
			if (userData == null) {
				userData = UserType2Action.getUser(httpPacket.hSession.headParam.token);
				if (userData == null) {
					return false;
				} else {
					tokenTypeMap.put(httpPacket.hSession.headParam.token, 2);
				}
			} else {
				tokenTypeMap.put(httpPacket.hSession.headParam.token, 1);
			}
		} else if (type.intValue() == 1) {
			userData = UserAction.getUser(httpPacket.hSession.headParam.token);
			if (userData == null) {
				return false;
			}
		} else if (type.intValue() == 2) {
			userData = UserType2Action.getUser(httpPacket.hSession.headParam.token);
			if (userData == null) {
				return false;
			}
		}

		httpPacket.hSession.otherData = userData;
		return true;
	}

}
