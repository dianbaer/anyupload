package org.anyupload;

import javax.servlet.http.HttpServlet;

import org.grain.httpserver.HttpManager;
import org.grain.httpserver.IExpandServer;

public class Expand implements IExpandServer {

	@Override
	public void init(HttpServlet servlet) throws Exception {
		HOpCode.init();
		HttpManager.addHttpListener(new UploadService());
	}
}
