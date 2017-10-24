package action;

import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

import dao.model.base.FileBase;
import tool.StringUtil;

public class FileBaseAction implements IFileBaseAction {
	public static Map<String, FileBase> completeFileBaseMap = new ConcurrentHashMap<String, FileBase>();

	@Override
	public FileBase getFileBaseByMd5(String fileBaseMd5) {
		if (StringUtil.stringIsNull(fileBaseMd5)) {
			return null;
		}
		return completeFileBaseMap.get(fileBaseMd5);
	}
}
