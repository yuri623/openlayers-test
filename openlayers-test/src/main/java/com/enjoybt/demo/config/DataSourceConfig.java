package com.enjoybt.demo.config;

import javax.sql.DataSource;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.boot.jdbc.DataSourceBuilder;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Primary;
import org.springframework.jdbc.datasource.DataSourceTransactionManager;

import com.zaxxer.hikari.HikariDataSource;

/**
 * 스프링 부트 자동 DataSource로 SQL로그를 적용 하면 
 * Quartz 쿼리 로그가 너무 많아 Datasource를 분리하기 위해 직접 DataSource 선언하고 분리함 
 * 
 * @author seunguk
 *
 */
@Configuration
public class DataSourceConfig {
	
	@Bean
	@Primary
	@ConfigurationProperties(prefix = "spring.datasource.hikari")
	public DataSource dataSource() {
		return DataSourceBuilder.create().type(HikariDataSource.class).build();
	}
	
	
	@Bean(name = "mybatisDataSource")
	@ConfigurationProperties(prefix = "mybatis.datasource.hikari")
	public DataSource mybatisDataSource() {
		return DataSourceBuilder.create().type(HikariDataSource.class).build();
		
//		Log4jdbcProxyDataSource proxyDataSource = new Log4jdbcProxyDataSource(dataSource());
//		
//		Log4JdbcCustomFormatter logFormatter = new Log4JdbcCustomFormatter();
//		logFormatter.setLoggingType(LoggingType.MULTI_LINE);
//		logFormatter.setSqlPrefix("\n");
//		
//		proxyDataSource.setLogFormatter(logFormatter);
		
	}

	
	
	@Bean
	public DataSourceTransactionManager transactionManager() {
		DataSourceTransactionManager transactionManager = new DataSourceTransactionManager(mybatisDataSource());
		return transactionManager;
	}

}
