package tool;

public class StringUtil {
	public static boolean stringIsNull(String str) {
		if (str == null || str.equals("")) {
			return true;
		}
		return false;
	}

	public static String blank(String str) {
		if (str == null || str.equals("")) {
			return "";
		}
		return str;
	}
}
