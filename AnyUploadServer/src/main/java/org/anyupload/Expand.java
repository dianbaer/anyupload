package org.anyupload;

import javax.servlet.http.HttpServlet;

import org.grain.httpserver.HttpManager;
import org.grain.httpserver.IExpandServer;

public class Expand implements IExpandServer {

	@Override
	public void init(HttpServlet servlet) throws Exception {
		// 初始化映射
		HOpCode.init();
		// 初始化服务
		HttpManager.addHttpListener(new UploadService());
	}
}
