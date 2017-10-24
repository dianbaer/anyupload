package server;

import java.io.File;
import java.io.FileInputStream;
import java.io.InputStream;
import java.net.URL;
import java.util.Properties;
import java.util.TimeZone;

import javax.servlet.ServletContext;
import javax.servlet.http.HttpServlet;

import org.grain.httpclient.HttpUtil;
import org.grain.httpserver.HttpConfig;
import org.grain.httpserver.HttpManager;
import org.grain.httpserver.IExpandServer;
import org.grain.mariadb.MybatisManager;

import config.CommonConfigBox;
import http.HOpCodeBox;
import http.filter.TokenHttpFilter;
import log.MariadbLog;
import service.BoxInfoService;
import service.LoginService;
import service.MutliOperateService;
import service.UploadService;
import service.UserFileService;
import service.UserFoldService;

public class Expand implements IExpandServer {

	@Override
	public void init(HttpServlet servlet) throws Exception {
		TimeZone.setDefault(TimeZone.getTimeZone("Asia/Shanghai"));
		ServletContext servletContext = servlet.getServletContext();
		String configFileName = servletContext.getInitParameter("configFileName");
		Properties properties = loadConfig(configFileName);
		MybatisManager.init(properties.getProperty("config_dir"), "mybatis-config.xml", new MariadbLog());
		HOpCodeBox.init();
		HttpUtil.init("UTF-8", null);
		CommonConfigBox.init(properties);
		HttpManager.addFilter(new TokenHttpFilter());
		HttpManager.addHttpListener(new UploadService());
		HttpManager.addHttpListener(new LoginService());
		HttpManager.addHttpListener(new UserFoldService());
		HttpManager.addHttpListener(new UserFileService());
		HttpManager.addHttpListener(new MutliOperateService());
		HttpManager.addHttpListener(new BoxInfoService());
	}
	private Properties loadConfig(String configFileName) throws Exception {
		HttpConfig.log.info("初始化基础配置文件");
		InputStream inputStream = null;
		URL url = this.getClass().getClassLoader().getResource(configFileName);
		if (url != null) {
			HttpConfig.log.info("Init.class.getClassLoader().getResource找到配置文件，路径为：" + url.getPath());
			inputStream = this.getClass().getClassLoader().getResourceAsStream(configFileName);
		} else {
			HttpConfig.log.info("Init.class.getClassLoader().getResource：" + this.getClass().getClassLoader().getResource("").getPath() + "，未找到配置文件：" + configFileName);
		}
		if (inputStream == null) {
			File file = new File(System.getProperty("catalina.base") + "/" + configFileName);
			if (file.exists()) {
				HttpConfig.log.info("System.getProperty(\"catalina.base\")找到配置文件，路径为" + System.getProperty("catalina.base") + "/" + configFileName);
				inputStream = new FileInputStream(file);
			} else {
				HttpConfig.log.info("System.getProperty(\"catalina.base\")：" + System.getProperty("catalina.base") + "，未找到配置文件：" + configFileName);
			}
		}
		if (inputStream == null) {
			File file = new File(configFileName);
			if (file.exists()) {
				HttpConfig.log.info("找到配置文件，路径为" + file.getAbsolutePath());
				inputStream = new FileInputStream(file);
			} else {
				HttpConfig.log.info("未找到配置文件：" + configFileName);
			}
		}
		if (inputStream != null) {
			Properties properties = new Properties();
			properties.load(inputStream);
			HttpConfig.log.info("初始化基础配置文件完成");
			inputStream.close();
			return properties;
		} else {
			HttpConfig.log.warn("未找到配置文件：" + configFileName);
			throw new Exception("未找到配置文件" + configFileName);
		}
	}

}
