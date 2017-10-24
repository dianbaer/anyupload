package action;

import java.io.UnsupportedEncodingException;
import java.util.HashMap;
import java.util.Map;

import org.grain.httpclient.HttpUtil;
import org.grain.httpserver.HttpConfig;

import config.CommonConfigBox;
import data.UserData;
import net.sf.json.JSONObject;

public class UserAction {
	public static UserData getUser(String token) {
		JSONObject js = new JSONObject();
		js.put("hOpCode", "11");
		Map<String, String> header = new HashMap<>();
		header.put("hOpCode", "11");
		header.put("token", token);
		byte[] returnByte = HttpUtil.send(js.toString(), CommonConfigBox.UCENTER_URL, header, HttpUtil.POST);
		if (returnByte != null) {
			String str = null;
			try {
				str = new String(returnByte, "UTF-8");
			} catch (UnsupportedEncodingException e) {
				HttpConfig.log.error("返回字符串解析异常", e);
			}
			JSONObject returnjs = JSONObject.fromObject(str);
			// 如果返回的是错误类型,说明用户中心拦截器没通过
			if (returnjs.getString("hOpCode").equals("0")) {
				return null;
			}
			UserData userData = new UserData(returnjs.getJSONObject("user"));
			return userData;
		}
		return null;
	}
}
