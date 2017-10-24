package action;

import java.util.List;

import org.apache.ibatis.session.SqlSession;
import org.grain.mariadb.MybatisManager;

import config.FileBaseConfig;
import dao.dao.base.FileBaseMapper;
import dao.model.base.FileBase;
import dao.model.base.FileBaseCriteria;
import tool.StringUtil;

public class FileBaseAction {
	public static FileBase getFileBaseByMd5(String fileBaseMd5) {
		if (StringUtil.stringIsNull(fileBaseMd5)) {
			return null;
		}
		SqlSession sqlSession = null;
		try {
			sqlSession = MybatisManager.getSqlSession();
			FileBaseMapper fileBaseMapper = sqlSession.getMapper(FileBaseMapper.class);
			FileBaseCriteria fileBaseCriteria = new FileBaseCriteria();
			FileBaseCriteria.Criteria criteria = fileBaseCriteria.createCriteria();
			criteria.andFileBaseMd5EqualTo(fileBaseMd5).andFileBaseStateEqualTo((byte) FileBaseConfig.STATE_COMPLETE);
			List<FileBase> fileBaseList = fileBaseMapper.selectByExample(fileBaseCriteria);
			if (fileBaseList == null || fileBaseList.size() == 0) {
				return null;
			}
			return fileBaseList.get(0);
		} catch (Exception e) {
			if (sqlSession != null) {
				sqlSession.rollback();
			}
			MybatisManager.log.error("通过md5获取基础文件异常", e);
			return null;
		} finally {
			if (sqlSession != null) {
				sqlSession.close();
			}
		}
	}
}
