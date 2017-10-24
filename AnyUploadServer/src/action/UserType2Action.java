package action;

import java.io.UnsupportedEncodingException;

import org.grain.httpclient.HttpUtil;
import org.grain.httpserver.HttpConfig;

import config.CommonConfigBox;
import data.UserData;
import net.sf.json.JSONObject;
import tool.StringUtil;

public class UserType2Action {

	public static UserData getUser(String userId) {
		if (StringUtil.stringIsNull(userId)) {
			HttpConfig.log.warn("获取用户信息参数userId为空，获取信息失败");
			return null;
		}
		String getUserUrl = CommonConfigBox.TJSMESP_URL + CommonConfigBox.GET_USER_MSG_BY_USER_CODEURL + userId;
		byte[] returnByte = HttpUtil.send(null, getUserUrl, null, HttpUtil.GET);
		if (returnByte == null) {
			return null;
		}
		String str = null;
		try {
			str = new String(returnByte, "UTF-8");
		} catch (UnsupportedEncodingException e) {
			HttpConfig.log.error("返回字符串解析异常", e);
		}
		JSONObject result = JSONObject.fromObject(str);
		JSONObject data = result.getJSONObject("data");
		int status = result.getInt("status");
		if (status != 1 || !data.containsKey("userMsg")) {
			HttpConfig.log.warn("获取用户userId为" + userId + "的用户信息失败,status=" + status);
			return null;
		}
		JSONObject userMsg = data.getJSONObject("userMsg");
		UserData user = new UserData();
		user.setUserId(StringUtil.blank(userMsg.getString("userCode")));
		user.setUserRealName(StringUtil.blank(userMsg.getString("name")));
		return user;
	}

}
