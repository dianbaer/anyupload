package server;

import javax.servlet.http.HttpServlet;

import org.grain.httpserver.HttpManager;
import org.grain.httpserver.IExpandServer;

import http.HOpCodeBox;
import service.UploadService;

public class Expand implements IExpandServer {

	@Override
	public void init(HttpServlet servlet) throws Exception {
		HOpCodeBox.init();
		HttpManager.addHttpListener(new UploadService());

	}

}
