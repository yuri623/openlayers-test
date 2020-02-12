package com.enjoybt.demo.config;

import java.util.Properties;

import javax.sql.DataSource;

import org.apache.ibatis.session.ExecutorType;
import org.apache.ibatis.session.LocalCacheScope;
import org.apache.ibatis.session.SqlSessionFactory;
import org.mybatis.spring.SqlSessionFactoryBean;
import org.mybatis.spring.SqlSessionTemplate;
import org.mybatis.spring.annotation.MapperScan;
import org.mybatis.spring.boot.autoconfigure.SpringBootVFS;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.context.ApplicationContext;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.transaction.annotation.EnableTransactionManagement;

@Configuration
@MapperScan("com.enjoybt.demo.**.dao")
@EnableTransactionManagement
public class MybatisConfig {
	

	@Bean(name="sqlSessionFactory")
	public SqlSessionFactory sqlSessionFactory(@Qualifier("mybatisDataSource") DataSource dataSource, ApplicationContext applicationContext) throws Exception {
		SqlSessionFactoryBean sqlSessionFactoryBean = new SqlSessionFactoryBean();
		
		org.apache.ibatis.session.Configuration conf = new org.apache.ibatis.session.Configuration();
		conf.setCacheEnabled(false);
		conf.setDefaultExecutorType(ExecutorType.REUSE);
		conf.setDefaultFetchSize(1000);
		conf.setLocalCacheScope(LocalCacheScope.STATEMENT);
		sqlSessionFactoryBean.setConfiguration(conf);
		
		//sqlSessionFactoryBean.setConfigurationProperties(mybatisProperties());
		sqlSessionFactoryBean.setVfs(SpringBootVFS.class);
		
		sqlSessionFactoryBean.setDataSource(dataSource);
		sqlSessionFactoryBean.setMapperLocations(applicationContext.getResources("classpath:mappers/**/*.xml"));
		return sqlSessionFactoryBean.getObject();
	}
	
	
	private Properties mybatisProperties() {
        Properties properties = new Properties();
        properties.put("cacheEnabled", "false");
        properties.put("defaultExecutorType", "reuse");
        properties.put("defaultFetchSize", "1000");

        return properties;
    }
	
	
	@Bean(name="sqlSessionTemplate")
	public SqlSessionTemplate sqlSessionTemplate(@Qualifier("sqlSessionFactory") SqlSessionFactory sqlSessionFactory) throws Exception {
		return new SqlSessionTemplate(sqlSessionFactory);
	}
	
}
